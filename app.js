import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import users from "./constant.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.post('/api/init', (req, res) => {
  const { userId } = req.body;
  const user = users.find((user) => user.userId === userId);
  res.json(user);
})

app.post("/api/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.userId === username && user.password === password
  );
  if (!user) {
    return res.status(400).send("Incorrect username or password");
  }
  const token = jwt.sign({ userId: user.id }, "my-secret-token");
  res.json({ token, userId: user.userId });
});

// res.json({
//   message: `request ${req.query.request} OKKK`,
//   ledMode,
//   output0: user.data.output0?"on":"off",
//   output1: user.data.output1?"on":"off",
//   output2: user.data.output2?"on":"off",
// });

app.get("/api/data", (req, res) => {
  const { sw0, sw1, sw2, ledMode, value, apiKey } = req.query;
  console.log(req.query);
  const user = users.find((user) => user.apiKey === apiKey);
  if (apiKey && user) {
    user.data.clientData.sw0 = sw0 == 1;
    user.data.clientData.sw1 = sw1 == 1;
    user.data.clientData.sw2 = sw2 == 1;
    user.data.clientData.sensor = value;
    user.data.clientData.ledMode = "case"+ledMode;
    io.emit(user.userId, user.data);
    res.json({message: "OK"});
  } else {
    res.send("ERROR");
  }
});

app.post("/api/contact", (req, res) => {
  const {output, userId} = req.body;
  const user = users.find((user) => user.userId === userId);
  if (user) {
    user.data.responseData[output] = !user.data.responseData[output];
    Object.assign(users, user);
    io.emit(user.userId, user.data);
    res.json({
      message: `request ${output} OKKK`,
      o0: user.data.responseData.output0 ? "on" : "off",
      o1: user.data.responseData.output1 ? "on" : "off",
      o2: user.data.responseData.output2 ? "on" : "off",
    });
  } else {
    res.status(401).send("ERROR");
  }
});

app.post("/api/ledMode", (req, res) => {
  const { userId, ledMode } = req.body;
  const user = users.find((user) => user.userId === userId);
  if (user) {
    user.data.responseData.ledMode = ledMode;
    Object.assign(users, user);
    io.to(user.userId).emit("data", JSON.stringify(user.data));
    console.log(users);
    res.json({
      message: `request ${ledMode} OKKK`,
      o0: user.data.responseData.output0 ? "on" : "off",
      o1: user.data.responseData.output1 ? "on" : "off",
      o2: user.data.responseData.output2 ? "on" : "off",
    });
  } else {
    res.status(401).send("ERROR");
  }
});

server.listen(8163, () => {
  console.log("listening on *:3000");
});


// import express from 'express';
// import {createServer} from 'http'
// import { Server } from "socket.io";
// import cors from 'cors';
// const app = express();
// app.use(cors(
//   {
//     origin: '*',
//   }
// ));
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: { origin: '*' }
// });
// io.on("connection", (socket) => {
//   // ...
//   console.log("a user connected");
//   io.emit("data", {
//     message: "hello",
//   })
// });

// httpServer.listen(8163, () => {
//   console.log("listening on *:8163");
// });
