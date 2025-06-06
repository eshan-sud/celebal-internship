// index.js

const fs = require("fs").promises;
const path = require("path");
const http = require("http");
const querystring = require("querystring");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    try {
      const data = await fs.readFile("index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    } catch (err) {
      res.writeHead(404);
      res.end("Error: File Not Found");
    }
  } else if (req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const parsed = querystring.parse(body);
      const filePath = path.join(__dirname, parsed.filename);

      try {
        if (req.url === "/create") {
          await fs.writeFile(filePath, parsed.content);
          console.log(`Created: ${filePath}`);
          res.end("File created successfully.");
        } else if (req.url === "/append") {
          await fs.appendFile(filePath, parsed.content);
          console.log(`Appended: ${filePath}`);
          res.end("Content appended successfully.");
        } else if (req.url === "/read") {
          const data = await fs.readFile(filePath, "utf8");
          res.end(`Contents of file:\n\n${data}`);
        } else if (req.url === "/rename") {
          const newFilePath = path.join(__dirname, parsed.newfilename);
          await fs.rename(filePath, newFilePath);
          console.log(`Renamed to: ${newFilePath}`);
          res.end("File renamed successfully.");
        } else if (req.url === "/delete") {
          await fs.unlink(filePath);
          console.log(`Deleted: ${filePath}`);
          res.end("File deleted successfully.");
        } else {
          res.writeHead(404);
          res.end("Route not found");
        }
      } catch (err) {
        res.writeHead(500);
        res.end("Error: " + err.message);
      }
    });
  } else {
    res.writeHead(405);
    res.end("Method not allowed");
  }
});

server.listen(PORT, (err) => {
  if (err) throw new Error(err);
  console.log("Server listening on port " + PORT);
});
