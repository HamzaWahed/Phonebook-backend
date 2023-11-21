const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ihamzy22:${password}@cluster0.ph4dk2a.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 5) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    if (result) {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    }

    mongoose.connection.close();
  });
} else {
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  person.save().then((result) => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
}
