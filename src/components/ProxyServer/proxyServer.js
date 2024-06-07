const express = require("express");
const cors = require("cors");
const axios = require("axios");
const iconv = require("iconv-lite");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/suggestions", async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${q}&ds=yt&hl=az`,
      { responseEncoding: "latin1" }
    );
    // res.setHeader("Content-Type", "application/json; charset=UTF8");
    // const suggestions = JSON.parse(response.data.toString("utf-8"));
    // console.log(response.data.toString("latin1"));
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching suggestions");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
