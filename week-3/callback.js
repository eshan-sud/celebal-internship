// callback.js

const fs = require("fs");

fs.readFile("demo.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  fs.writeFile("copy.txt", data, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("File copied successfully");
  });
});
