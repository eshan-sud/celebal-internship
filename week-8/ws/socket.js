const WebSocket = require("ws");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", (message) => {
      console.log("Received:", message);
      ws.send(`Echo: ${message}`);
    });

    ws.send("Welcome to WebSocket!");
  });
};
