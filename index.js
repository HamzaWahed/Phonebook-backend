require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.use(
  morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens["body"](req, res),
      ].join(" ");
    }

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

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

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", async (request, response) => {
  const count = await Person.countDocuments();
  const currentDate = new Date();
  response.end(`
    <p>Phonebook has info for ${count} people</p>
    <p>${weekday[currentDate.getDay()]} ${
    months[currentDate.getMonth()]
  } ${currentDate.getDay()} ${currentDate.getFullYear()} ${currentDate.toLocaleTimeString()} ${currentDate.getTimezoneOffset()} (${
    Intl.DateTimeFormat().resolvedOptions().timeZone
  } time)</p>
  `);
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).send();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  Person.findOne({ name: request.body.name }).then((result) => {
    if (result) {
      Person.findByIdAndUpdate(
        result.id,
        { ...result.toObject(), number: request.body.number },
        { new: true }
      )
        .then((updatedPerson) => {
          response.json(updatedPerson);
        })
        .catch((error) => next(error));
    }
  });

  morgan.token("body", (request, response) => {
    return JSON.stringify(request.body);
  });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "name and number missing",
    });
  }

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  person
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));

  morgan.token("body", (request, response) => {
    return JSON.stringify(body);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
