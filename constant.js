const users = [
  {
    userId: "minh",
    name: "John Doe",
    password: "admin",
    apiKey: "minh",
    lastRequest: 0,
    data: {
      responseData: {
        output0: false,
        output1: false,
        output2: false,
        ledMode: "case1",
      },
      clientData: {
        output0: false,
        output1: false,
        output2: false,
        sensor: [
          {
            name: "KHÍ GAS",
            value: 0,
            unit: "%",
          },
          {
            name: "NHIỆT ĐỘ",
            value: 0,
            unit: "°C",
          },
        ],
        sensorData: [
          {
            name: "KHÍ GAS",
            data: [

            ],
          },
          {
            name: "NHIỆT ĐỘ",
            data: [
            ],
          },
        ],
        ledMode: "case1",
      },
    },
  },
  {
    userId: "minh1",
    name: "John Doe",
    password: "admin",
    apiKey: "minh1",
    data: {
      responseData: {
        output0: false,
        output1: false,
        output2: false,
        ledMode: "case1",
      },
      clientData: {
        output0: false,
        output1: false,
        output2: false,
        sensor: [
          {
            name: "KHÍ GAS",
            value: 0,
            unit: "%",
          },
          {
            name: "NHIỆT ĐỘ",
            value: 0,
            unit: "°C",
          },
        ],
        sensorData: [
          {
            name: "KHÍ GAS",
            data: [],
          },
          {
            name: "NHIỆT ĐỘ",
            data: [],
          },
        ],
        ledMode: "case1",
      },
    },
  },
];

export default users;
