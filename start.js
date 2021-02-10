const cors = require('cors')
const express = require("express");
const app = express();
const handler = require("./index").handler;
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors());

app.post("/webhook", handler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});