const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));

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

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    res.json(person);
  }
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

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const newPersons = persons.filter((p) => p.id !== id);
  persons = newPersons;
  res.status(204).end();
});

const generateId = (min, max) => {
  return Math.floor(Math.random() * (min, max) + min);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      error: "name and number missing",
    });
  }

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(0, 1000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
