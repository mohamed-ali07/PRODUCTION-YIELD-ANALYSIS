const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "data", "yield_data.json");

app.use(bodyParser.json());
app.use(express.static("public"));

// Get all yield data
app.get("/api/yields", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  res.json(data);
});

// Post new yield data
app.post("/api/yields", (req, res) => {
  const { crop, area, production } = req.body;

  if (!crop || !area || !production) {
    return res.status(400).json({ error: "All fields required" });
  }

  const newEntry = {
    crop,
    area: parseFloat(area),
    production: parseFloat(production),
    yield: parseFloat(production) / parseFloat(area),
    date: new Date().toISOString()
  };

  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  data.push(newEntry);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

  res.json({ message: "Yield data added", data: newEntry });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
