const mongoose = require("mongoose");

const subsectionSchema = new mongoose.Schema({
  title:{
    type:String
  },
  timeDuration:{
    type:String
  },
  description:{
    type:String
  },
  videoURL:{
    type:String
  },
  //to delete the video on updating
  videoPublicId:{
    type:String
  },
  notesPdfUrl:{
    type:String
  },
  notesPdfName:{
    type:String
  },
  notesPdfPublicId:{
    type:String
  }
});
module.exports = mongoose.model("SubSection", subsectionSchema);
