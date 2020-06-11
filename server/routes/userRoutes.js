const express = require('express');
const postController = require('../controllers/postController');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);


router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);


// Protect all routes after this middleware
router.use(authController.protect); 

router
.route('/profile/myPosts')
.get(postController.getMyPost, postController.getAllPosts)
.post(postController.createPost);

router.get('/profile', userController.getMe, userController.getUser);
router.patch('/profile/updateMe', userController.updateMe);
router.patch('/profile/updateMyPassword', authController.updatePassword);
router.delete('/profile/deleteMe',userController.deleteMe);

// Restrict all routes after this middleware to admin
router.use(authController.restrictTo('admin'));

router
.route('/')                           
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')                        
.get(userController.getUser)
.patch(userController.updateUser) // password will not update with this 
.delete(userController.deleteUser);

module.exports = router;