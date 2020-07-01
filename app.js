const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(helmet());

if (process.env.NODE_ENV === 'development') { 
    app.use(morgan('dev'));
  }

  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
app.use('/api', limiter);

app.use(express.json({ limit:'5kb' }));
app.use(express.urlencoded({ extended: true, limit: '5kb'} ));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/reviews', reviewRouter);

app.use(express.static('./client/build'));


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
 app.use(globalErrorHandler); 

module.exports = app;