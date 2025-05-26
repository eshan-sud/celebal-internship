const fs = require("fs");
const path = require("path");
const HTTP = require("http");
const { error } = require("console");

const port = 3000;

const server = HTTP.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("Hello World!");
});
server.listen(port, () => {
  console.log("Server started on port " + port);
});

function writeToFile(path, data) {
  // Writes to / Creates the file
  fs.writeFile(path, data, (err) => {
    if (err) throw new Error(err);
    console.log("File - " + path + " has been created");
  });
}

function appendToFile(path, newdata) {
  // Appends to the file
  fs.appendFile(path, newdata, (err) => {
    if (err) throw new Error(err);
    /* Body After Writing Data */
  });
}
function readFromFile(path) {
  // Reads the file
  fs.readFile(path, "utf8", (err, data) => {
    if (err) throw new Error(err);
    console.log("File has been read");
    console.log(data);
  });
}
function renameFile(path) {
  // Renames the file
  fs.rename("files/name.txt", "files/name2.txt", (err) => {
    if (err) throw new Error(err);
    /* Body After Renaming File */
  });
}

function deleteFile(path) {
  // Deletes the file
  fs.unlink(path, (err) => {
    if (err) throw new Error(err);
  });
}

writeToFile("names.txt", "Hello World");
