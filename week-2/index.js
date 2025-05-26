// index.js

const fs = require("fs");
const path = require("path");
const http = require("http");
const querystring = require("querystring");

const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    // Serve HTML page
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile("index.html", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.write("Error: File Not Found");
      } else {
        res.write(data);
      }
      res.end();
    });
  } else if (req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsed = querystring.parse(body);
      const filePath = path.join(__dirname, parsed.filename);

      if (req.url === "/create") {
        // Creates / Overwrites the file
        fs.writeFile(filePath, parsed.content, (err) => {
          if (err) return res.end("Error writing file: " + err.message);
          console.log(`Created: ${filePath}`);
          res.end("File created successfully.");
        });
      } else if (req.url == "/append") {
        // Appends to the file
        fs.appendFile(filePath, parsed.content, (err) => {
          if (err) return res.end("Error appending to file: " + err.message);
          console.log(`Appended: ${filePath}`);
          res.end("Content appended successfully.");
        });
      } else if (req.url === "/read") {
        // Reads the file
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) return res.end("Error reading file: " + err.message);
          res.end(`Contents of file:\n\n${data}`);
        });
      } else if (req.url === "/rename") {
        // Renames the file
        const newFilePath = path.join(__dirname, parsed.newfilename);
        fs.rename(filePath, newFilePath, (err) => {
          if (err) return res.end("Error renaming file: " + err.message);
          console.log(`Renamed to: ${newFilePath}`);
          res.end("File renamed successfully.");
        });
      } else if (req.url === "/delete") {
        // Deletes the file
        fs.unlink(filePath, (err) => {
          if (err) return res.end("Error deleting file: " + err.message);
          console.log(`Deleted: ${filePath}`);
          res.end("File deleted successfully.");
        });
      } else {
        res.writeHead(404);
        res.end("Route not found");
      }
    });
  } else {
    res.writeHead(405);
    res.end("Method not allowed");
  }
});

server.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log("Server listening on port " + port);
});
