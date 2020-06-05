const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

  
exports.getAllPosts = catchAsync(async(req, res, next) => {
 // To allow for nested GET posts on user 
 let filter = {};
 if (req.user.id) {
     filter = { user: req.user.id };
 }

    //EXECUTE QUERY
     const features = new APIFeatures( Post.find(filter), req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();

   const posts = await features.query;

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            data: posts
        }
    })
    
    
});

exports.getPost = catchAsync(async(req, res, next) => {
    post = await Post.findById(req.params.id);

    if(!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: post
        }
    })
    
    
});

exports.updatePost = catchAsync(async (req, res, next) => {
  
    const updatedPost = await Post.findByIdAndUpdate( req.params.id, req.body , {
        new: true,
        runValidators: true
    });
 
    if(!updatedPost) {
     return next(new AppError('No post found with that ID', 404));
 }
 
   res.status(200).json({
     status: 'success',
     data: {
      data: updatedPost
     }
   });

 });

 exports.deletePost = catchAsync(async (req, res, next) => {

    const post = await Post.findByIdAndDelete(req.params.id);
  
     if(!post) {
      return next(new AppError('No post found with that ID', 404));
  }
     res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
      // Allow nested routes
    if (!req.body.user) req.body.user = req.user.id;
   
    const newPost = await Post.create({
        discription: req.body.discription,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        comments: req.body.comments,
        user:req.body.user
    });

    res.status(200).json({
        status: 'success',
        data: {
            post: newPost
        }
    });
});

