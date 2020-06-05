const path = require('path');
const morgan = require('morgan');
const express = require('express');

const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');

const app = express();

// if (process.env.NODE_ENV === 'development') { //console.log(process.env.NODE_ENV);
//     app.use(morgan('dev'));
//   }
app.use(morgan('dev'));
app.use(express.json({ limit:'5kb' }));
app.use(express.urlencoded({ extended: true, limit: '5kb'} ));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

module.exports = app;