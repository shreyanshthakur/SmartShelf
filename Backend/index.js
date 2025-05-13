const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
