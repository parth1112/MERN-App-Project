const mongoose = require('mongoose');


process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
 
  process.exit(1);
});

const app = require('./app');

require('dotenv').config();

const uri = process.env.DATABASE_URI;
mongoose
.connect(uri, {                     
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open',  () => {
  console.log('DB connection succesfull!')
})
.catch( err => console.log(err));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
 
  server.close(() => {
    process.exit(1);
  });
});

