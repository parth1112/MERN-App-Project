 
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
};

  const sendToken = (user, statusCode, req, res) => {
    const token = createToken(user._id);
 
    const cookieOptions = {
      expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
  };

 // if(process.env.NODE_ENV === 'production ') {  cookieOptions.secure = true; }

  res.cookie('jwt', token, cookieOptions); 

  user.password = undefined;
     
  
    res.status(statusCode).json({
      status: 'success',
      data: {
          role: user.role
     },
     token
   });
}; 

exports.signup = catchAsync(async(req, res, next) => {

  const { userName, email, password, passwordConfirm } = req.body;
  
   if( !userName || !email || !password || !passwordConfirm ) {
      return  next( new AppError('Please provide all required data!', 400));
   }

     const newUser = await User.create({
        userName: userName,
        email:email,
        password:password,
        passwordConfirm: passwordConfirm,
        role: req.body.role ? req.body.role : 'user'
     });

     const token = newUser.createPasswordResetToken();
     await newUser.save({ validateBeforeSave: false });

   try {
   
      await new Email(newUser, token).sendWelcome();
  
      res.status(201).json({
        status: 'success',
        message: 'Token has been sent to Your email!'
      });
    }   catch (err) {
          newUser.PasswordResetToken = undefined;
          newUser.PasswordResetExpires = undefined;

          await newUser.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!',500) );
      }
});

exports.verifyEmail = catchAsync(async(req, res, next) => {

      const { token } = req.body;

      if( !token ) {
        return  next( new AppError('Please provide token for verification and activate your account!', 400));
      }

    const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: { $gt:  Date.now() }
    });


   if(!user) {
       return next(new AppError('Token is in valid or has expired',400) );
    }

       user.passwordResetToken = undefined;
       user.passwordResetExpires = undefined;
       
       await user.save({ validateBeforeSave: false });

    sendToken(user, 200, req, res);
});

 
exports.login = catchAsync( async (req, res, next) => {
     const { email, password } = req.body;
  
    // 1) Check if email and password exists
     if( !email || !password) {
        return  next( new AppError('Please provide email and password!', 400));
     }
  
  // 2) Check if user exists && password is correct
  const user = await  User.findOne({ email }).select('+password');

  if(!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError('Incorrect email or password',401));
  }

   // 3) Check if user is blackListed
   if(user.blackList) {
    return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
    }

    // 4) If everyone ok, send token client
    sendToken(user, 200, req, res);
});   
 
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
  });
    res.status(200).json({ 
      status: 'success',
      message:'Logged out successfully!!'
    });
};
 
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
         
  if(!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action!',403));
  }
  next();
}
};

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // 4) Check if user is blackListed
   if(currentUser.blackList) {
    return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
    }
  
    // 5) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// Only for rendered pages, no errors!
exports.checkLoginStatus = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next();
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next();
  }
  // 5) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next();
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if(req.user) {
    res.status(200).json({
      status: 'success',
      data: {
          role: req.user.role
     }
   });
  } else {
    res.status(400).json({
      status: 'fail'
   });
  }
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
     // 1) Check if email exists

    const { email } = req.body;

    if( !email ) {
      return  next( new AppError('Please provide email!', 400));
    }

  // 2) Get User based on POSTed email

    const user = await User.findOne({ email });
    if(!user) {
        return next(new AppError('There is no user with email adderss',404) );
    }
    
    // 3) Check if user is blackListed
   if(user.blackList) {
    return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
    }

    // 4)  Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
   
    // 5) Send it to user's email
  try {
   
    await new Email(user, resetToken).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to Your email!'
    });
  }   catch (err) {
        user.PasswordResetToken = undefined;
        user.PasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
     
        return next(new AppError('There was an error sending the email. Try again later!',500) );
    }
 });

exports.resetPassword = catchAsync(async(req, res, next) => {
  // 1) Check if data exists

     const { token, password, passwordConfirm } = req.body;

    if( !token || !password || !passwordConfirm ) {
      return  next( new AppError('Please provide all required data!', 400));
    }
        // 2) Get user based on the token
        const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
        const user = await User.findOne({
            passwordResetToken: hashedToken, 
            passwordResetExpires: { $gt:  Date.now() }
        });
    
    
        // 3) If token has not expired, and there is user, set the new password
       if(!user) {
           return next(new AppError('Token is in valid or has expired',400) );
        }

        // 4) Check if user is blackListed
          if(user.blackList) {
            return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
            }

           user.password = password;
           user.passwordConfirm = passwordConfirm;
           user.passwordResetToken = undefined;
           user.passwordResetExpires = undefined;
    
           await user.save();
    
           res.status(200).json({
            status: 'success',
            message: 'Password changed successfully!'
          });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
   // 1) Check if data exists

    const { passwordCurrent, password, passwordConfirm } = req.body;

    if( !passwordCurrent || !password || !passwordConfirm ) {
      return  next( new AppError('Please provide all required data!', 400));
    }

    // 2) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
      if(!user) {
        return next(new AppError('User does not exists',400) );
     }

     // 3) Check if user is blackListed
   if(user.blackList) {
    return next(new AppError('You are BlackListed, NOT authorized to perform any action',401));
    }

    // 4) Check if POSTed current password is correct
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 5) If so, update password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();
  
    // 6) Log user in, send JWT
    sendToken(user, 200, req, res);
});
  
 
 
 
 
 
 
 
 
 
 
 
 
 