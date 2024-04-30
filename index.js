import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { marked } from "marked";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/", async (req, res) => {
    try {
      const result = await axios.get(`https://api.reliefweb.int/v1/reports?appname=DataDisaster&limit=100`);
      res.render("index.ejs", {
        content: pickElementsFromArray(result.data.data, req.body.limit)
      });
    } catch (error) {
      console.log(error.response.data);
      res.status(500);
    }
  });

app.get("/disaster/:id", async (req, res) => {
  try {
    const result = await axios.get(`https://api.reliefweb.int/v1/reports/${req.params.id}`);
    res.render("seeDisaster.ejs", {
      title: result.data.data[0].fields.title,
      articleText : marked.parse(result.data.data[0].fields.body)
    });
  } catch (error) {
    console.log(error.response.data);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function pickElementsFromArray(array, count) {
  if (count >= array.length) {
      return array.slice(); // Return a copy of the entire array
  }

  const pickedElements = [];
  const arrayCopy = array.slice(); // Create a copy of the original array

  for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * arrayCopy.length);
      const pickedElement = arrayCopy.splice(randomIndex, 1)[0]; // Remove and get the picked element
      pickedElements.push(pickedElement);
  }

  return pickedElements;
}