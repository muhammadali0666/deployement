const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");
const { read_file, write_file } = require("./api/api");
const errorMiddleware = require("./middleware/error.middleware");
const BaseError = require("./utils/base_error");
require('dotenv').config()

const PORT = process.env.PORT || 4000

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Ishlayapti!"
  })
})

app.get("/get", (req, res, next) => {
  try {
    const data = read_file("data.json");
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.post("/add", (req, res, next) => {
  try {
    const data = read_file("data.json");

    data.push({
      id: v4(),
      ...req.body,
    });
    write_file("data.json", data);
    res.json({
      message: "added",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/get_one/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const data = read_file("data.json");

    const foundedData = data.find((item) => item.id === id);

    if (!foundedData) {
      throw BaseError.BadRequest("Data not found");
    }
    res.json(foundedData);
  } catch (error) {
    next(error);
  }
});

app.put("/update/:id", (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    const data = read_file("data.json");

    const foundedData = data.find((item) => item.id === id);
    if (!foundedData) {
      res.json({
        message: "Not found",
      });
    }
    data.forEach((item) => {
      if (item.id === id) {
        item.title = title ? title : item.title;
      }
    });

    write_file("data.json", data);

    res.json({
      message: "updated",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("running: " + PORT);
});
