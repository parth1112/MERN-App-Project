const User = require('../models/userModel');
const Post = require('../models/postModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Email = require('../utils/email');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };
  
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
       // 2) Check if email OR userName exists

     const { email, userName } = req.body;

    if( !userName && !email ) {
      return  next( new AppError('Please provide email OR userName!', 400));
    } 
    
    // 3) Get user from collection
    const user = await User.findById(req.user.id);
      if(!user) {
        return next(new AppError('User does not exists',400) );
     }

     // 4) Check if user is blackListed
      if(user.blackList) {
        return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
      }
  
    // 5) Update user document
          if(email) user.email = email;

          const postChange = async (post) => {
            post.userName = userName; 
            await post.save();
         };

         if(userName) {
          const posts = await Post.find({ userName: user.userName });
          posts.forEach(post => postChange(post));
            user.userName = userName;
           await user.save({validateBeforeSave: false});
         }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  });

exports.deleteMe = catchAsync(async (req, res, next) => {

  const postChange = async (post) => {
    await post.remove();
 };
 
 const posts = await Post.find({userName: req.user.userName });
   posts.forEach(post => postChange(post));

    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully'
    });
});

exports.getAllUsers = catchAsync(async(req, res, next) => {

     //EXECUTE QUERY
     const features = new APIFeatures(User.find(), req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();  

      const  users = await features.query; 

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
    
    
});

exports.getUser = catchAsync(async(req, res, next) => {
    user = await User.findById(req.params.id);

    if(!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    if(user.blackList) {
     return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
    
    
});

exports.updateUser = catchAsync(async (req, res, next) => {

   const filteredBody = filterObj(req.body, 'role','blackList');

   const user = await User.findById(req.params.id);
   if(!user) {
    return next(new AppError('No user found with that ID', 404));
    }

    const postChange = async (post) => {
       post.blackList = true; 
       await post.save();
    };
    
    if(filteredBody.blackList === true) {
      user.blackList = true;
      await user.save({ validateBeforeSave: false });
      const posts = await Post.find({userName: user.userName });
      posts.forEach(post => postChange(post));
      await new Email(user).sendBlackList();
      }
      

   res.status(200).json({
     status: 'success',
     data: {
       user
     }
   });

 });

 exports.deleteUser = catchAsync(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id);
  
     if(!user) {
      return next(new AppError('No user found with that ID', 404));
     }
     res.status(204).json({
      status: 'success',
      message: 'User deleted successfully'
    });
});

exports.createUser =(req, res) => {
        res.status(500).json({ 
             status : 'error',
             message: 'This route is not  defined! Please use /signup instead'
    });
};
  


