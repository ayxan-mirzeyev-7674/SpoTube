const express = require("express");
const cors = require("cors");
const axios = require("axios");
const iconv = require("iconv-lite");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

function replaceChars(inputArray, replaceMap) {
  let resultArray = [];
  for (inputString of inputArray) {
    let result = inputString;
    for (let char in replaceMap) {
      result = result.split(char).join(replaceMap[char]);
    }
    resultArray.push(result);
  }

  return resultArray;
}

const replaceMap = {
  ý: "ı",
  ð: "ğ",
  þ: "ş",
};

app.use(cors());

app.get("/suggestions", async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${q}&ds=yt&hl=az`,
      { responseEncoding: "latin1" }
    );
    response.data[1] = replaceChars(response.data[1], replaceMap);

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching suggestions");
  }
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send({
    message: "File uploaded successfully",
    file: req.file,
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
