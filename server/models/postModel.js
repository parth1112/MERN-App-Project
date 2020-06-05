const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  discription: {
      type: String,
      required: [true, 'A post must have a discription'],
      trim: true,
      maxlength: [100, 'A post must have less or equal to 100 characters'],
      minlength: [1, 'A post must have more or equal to 1 characters'],
   },
  likes: {
     type: Number,
     default: 0,
   },
   dislikes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: String,
    trim: true
   },
   user:{ 
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to a User!']
},

}, {
    timestamps: true
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// postSchema.pre(/^find/, function(next) {
//     this.populate({
//      path: 'user',
//      select: 'name'
//     });
//     next();
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;