// promise.js

const fs = require("fs").promises;

async function copyFile() {
  try {
    const data = await fs.readFile("demo.txt", "utf8");
    await fs.writeFile("copy.txt", data);
    console.log("File copied successfully");
  } catch (err) {
    console.error("Error:", err);
  }
}

copyFile();
