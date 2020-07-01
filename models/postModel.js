const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  discription: {
      type: String,
      required: [true, 'A post must have a discription'],
      trim: true,
      maxlength: [100, 'A post must have less or equal to 100 characters'],
      minlength: [1, 'A post must have more or equal to 1 characters'],
   },
   upVotes: {
     type: Number,
     default: 0,
   },
   downVotes: {
    type: Number,
    default: 0,
  },
  userName: {
    type: String,
    required: [true, 'A Post must belong to a user']
  },
  blackList: {
    type: Boolean,
    default: false
  }
}, {
    timestamps: true
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

postSchema.pre(/^find/, function(next) {
  this.find({ blackList: { $ne: true } });
   next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;