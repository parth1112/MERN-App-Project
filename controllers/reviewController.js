const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReview = catchAsync(async (req, res, next) => {

    const review = await Review.findOne({ post: req.params.id, user: req.user._id });
  
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
     });
});

exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create({
      post: req.params.id,  
      user: req.user._id,
      upVotes: req.body.upVotes ? 1 : 0,
      downVotes: req.body.downVotes ? 1 : 0,
    });

  res.status(200).json({
      status: 'success',
      data: {
          review: newReview
      }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {

    const review = await Review.findOne({ post: req.params.id, user: req.user._id });

    if(req.body.upVotes) {
        review.upVotes = 1;
        review.downVotes = 0;
    } else if (req.body.downVotes) {
        review.downVotes = 1;
        review.upVotes = 0;
    }

     review.save();
    
     res.status(200).json({
         status: 'success',
         data: {
             review
         }
     });
});

exports.deleteReview = catchAsync(async (req, res, next) => {

    const review = await Review.findOne({ post: req.params.id, user: req.user._id });     
    review.remove();                      
    res.status(200).json({
      status: 'success',
      message: 'Review Deleted Successfully'
   });
});