import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import users from "./constant.js";
import cors from "cors";

import { getDateTime } from "./helper/apiData.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.get("/api/init/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find((user) => user.userId === userId);
  res.json(user.data);
});

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
  io.emit(user.userId, user.data);
  res.json({ token, userId: user.userId });
});

app.get("/api/data", (req, res) => {
  const { output0, output1, output2, ledMode, adc0, adc1, apiKey } = req.query;
  const sensor1Value = Math.floor((adc0 * 100) / 4095);
  const sensor2Value =  Math.floor( ((adc1*330)/4095));
  const user = users.find((user) => user.apiKey === apiKey);
  if (user) {
    console.log(user.data.clientData.sensor, adc0, adc1);
    if (
      Date.now() - user.lastRequest > 60000 ||
      Math.abs(sensor1Value - user.data.clientData.sensor[0].value) > 10 ||
      Math.abs(sensor2Value - user.data.clientData.sensor[1].value) > 2
    ) {
      user.lastRequest = Date.now();
      if (user.data.clientData.sensorData[0].data.length > 50) {
        user.data.clientData.sensorData[0].data.shift();
      }
      if (user.data.clientData.sensorData[1].data.length > 50) {
        user.data.clientData.sensorData[1].data.shift();
      }
      user.data.clientData.sensorData[0].data.push({
        value: sensor1Value,
        createdAt: getDateTime(),
      });
      user.data.clientData.sensorData[1].data.push({
        value: sensor2Value,
        createdAt: getDateTime(),
      });
    }
    user.data.clientData.output0 = output0 == 1;
    user.data.clientData.output1 = output1 == 1;
    user.data.clientData.output2 = output2 == 1;
    user.data.clientData.sensor[0].value = sensor1Value;
    user.data.clientData.sensor[1].value = sensor2Value;
    user.data.clientData.ledMode = "case" + ledMode;
    io.emit(user.userId, user.data);
    res.json({
      message: "Request OKKK",
      ledMode: user.data.responseData.ledMode,
      output0: user.data.responseData.output0 ? "on" : "off",
      output1: user.data.responseData.output1 ? "on" : "off",
      output2: user.data.responseData.output2 ? "on" : "off",
    });
  } else {
    console.log("error");
    res.send("ERROR");
  }
});

app.post("/api/contact", (req, res) => {
  const { output, userId } = req.body;
  const user = users.find((user) => user.userId === userId);
  if (user) {
    user.data.responseData[output] = !user.data.responseData[output];
    Object.assign(users, user);
    console.log(user.data.clientData);
    io.emit(user.userId, user.data);
    res.json(user.data.responseData);
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
    io.emit(user.userId, user.data);
    res.json(user);
  } else {
    res.status(401).send("ERROR");
  }
});

server.listen(8163, () => {
  console.log("listening on *:3000");
});
