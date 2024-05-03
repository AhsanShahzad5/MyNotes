//connecting to mongodb server
const mongoose = require('mongoose');
const { Schema } = mongoose;
connectToMongo().then(console.log("Connected to mongo")).catch(err => console.log(err));

async function connectToMongo() {
  await mongoose.connect('mongodb://localhost:27017/inotebook');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//export the module to index.js
module.exports = connectToMongo