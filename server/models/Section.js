const mongoose = require("mongoose");
const SubSection = require("../models/SubSection")

const sectionSchema = new mongoose.Schema({
  sectionName:{
    type:String
  },
  subSection:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        required:true
    }
  ]
});

sectionSchema.pre('remove', async function(next) {
  try {
    await SubSection.deleteMany({ _id: { $in: this.subSection } });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Section", sectionSchema);
