const express = require("express");
const cors = require("cors");
const axios = require("axios");
const iconv = require("iconv-lite");

const app = express();
const PORT = 4000;

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

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
