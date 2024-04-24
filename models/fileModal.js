const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    name: { type: String },
    mimetype: { type: String },
    data: { type: Buffer },
    size: { type: Number }
  }
);


const File = mongoose.model("File", fileSchema);
module.exports = File;
