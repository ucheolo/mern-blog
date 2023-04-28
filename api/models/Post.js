const mongoose = require('mongoose');
const {Schema, model} = mongoose; 

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: {type: Schema.Types.ObjectId, ref:'User'},
}, {
  //timestamps 속성을 설정하여 created_at 및 updated_at 필드를 자동으로 생성하도록 한다.
  timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;