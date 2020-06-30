const mongoose = require('mongoose');
const Post = require('./postModel');

const reviewSchema = new mongoose.Schema({
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Review must belong to a post.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
     type: Number,
     default: 0,
   },
 
 }, {
    timestamps: true
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reviewSchema.index({ post: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcVotes = async function(postId) {
    const stats = await this.aggregate([
      {
        $match: { post: postId }
      },
      {
        $group: {
          _id: '$tour',
          upVotes: { $sum: '$upVotes' },
          downVotes: { $sum: '$downVotes' }
        }
      }
    ]);
    
    if (stats.length > 0) {
      await Post.findByIdAndUpdate(postId, {
        upVotes: stats[0].upVotes,
        downVotes: stats[0].downVotes
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        upVotes: 0,
        downVotes: 0
      });
    }
  };
  
  reviewSchema.post('save', function() {
    this.constructor.calcVotes(this.post);
  });
  reviewSchema.post('remove', function() {
    this.constructor.calcVotes(this.post);
  });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
