const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
.route('/:id') 
.get(reviewController.getReview)                         
.post(reviewController.createReview)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview);


module.exports = router;