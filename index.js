const express = require("express");
const app = express();

app.use(express.json());

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "May",
  "Apr",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const currentDate = new Date();
  res.end(`
    <p>Phonebook has info for ${persons.length} people test</p>
    <p>${weekday[currentDate.getDay()]} ${
    months[currentDate.getMonth()]
  } ${currentDate.getDay()} ${currentDate.getFullYear()} ${currentDate.toLocaleTimeString()} ${currentDate.getTimezoneOffset()} (${
    Intl.DateTimeFormat().resolvedOptions().timeZone
  } time)</p>
  `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
