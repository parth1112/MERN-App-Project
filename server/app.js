const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') { 
    app.use(morgan('dev'));
  }

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit:'5kb' }));
app.use(express.urlencoded({ extended: true, limit: '5kb'} ));
app.use(cookieParser());


app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
 app.use(globalErrorHandler); 

module.exports = app;