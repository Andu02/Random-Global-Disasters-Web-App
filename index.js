import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { marked } from "marked";

const app = express();
const port = 3000;

// Total number of disasters to fetch
const totalNumberOfDisasters = 100;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Handling POST request to fetch disaster reports
app.post("/", async (req, res) => {
    try {
      const result = await axios.get(`https://api.reliefweb.int/v1/reports?appname=DataDisaster&limit=${totalNumberOfDisasters}`);
      res.render("index.ejs", {
        content: pickElementsFromArray(result.data.data, req.body.limit)
      });
    } catch (error) {
      console.log(error.response.data);
      res.status(500);
    }
  });

// Handling route to view a specific disaster
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

// Listening to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Function to pick random elements from an array
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

