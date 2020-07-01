const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getMyPost = (req, res, next) => {
     // To allow for nested GET posts on user 
  const  filter = { userName: req.user.userName };
     req.filter = filter; 
     next();
};
  
 exports.getAllPosts = catchAsync(async(req, res, next) => {
       //EXECUTE QUERY

     const features = new APIFeatures( Post.find(req.filter), req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();

   const posts = await features.query;

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            posts
        }
    })
    
    
});

exports.getPost = catchAsync(async(req, res, next) => {
    post = await Post.findById(req.params.id);

    if(!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    if(post.blackList){
        return next (new AppError('Your post had been BLACKLISTED!!',404));
      }

    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    })
    
    
});

exports.updatePost = catchAsync(async (req, res, next) => {

    const post = await Post.findById(req.params.id);
     
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
      }
     
      if((req.user.userName !== post.userName) && (req.user.role !== 'admin')) {
        return next(new AppError(`You don't have permission to update this post`,403));
      }

      if(req.body.discription) post.discription = req.body.discription;
      else if(req.body.blackList && req.user.role === 'admin') post.blackList = req.body.blackList;

      await post.save();

    res.status(200).json({
        status: 'success',
        data: {
           post
        }
     });

 });

 exports.deletePost = catchAsync(async (req, res, next) => {

    const post = await Post.findByIdAndDelete(req.params.id);

    if(!post) {
      return next(new AppError('No post found with that ID', 404));
    }

    if(req.user.userName !== post.userName && req.user.role !== 'admin') {
      return next(new AppError(`You don't have permission to delete this post`,403));
    }
  
    res.status(204).json({
      status: 'success',
      message: 'Post deleted successfully'
    });
});

exports.createPost = catchAsync(async (req, res, next) => {

      if(!req.body.discription) {
        return  next( new AppError('Please provide discription', 400));
      }
        
     const newPost = await Post.create({
        discription: req.body.discription,
        userName: req.user.userName
    });

    res.status(200).json({
        status: 'success',
        data: {
            post: newPost
        }
    });
});

