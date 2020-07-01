const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
 
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

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
  console.log(process.env.NODE_ENV);
  console.log('DB connection succesfull!');
})
.catch( err => console.log(err));

const port = process.env.PORT || 5000;


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, './client/build/index.html'));
});

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

