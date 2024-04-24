const mongoose = require("mongoose");

const FileData = mongoose.Schema(
  {
    name: { type: String },
    mimetype: { type: String },
    data: { type: Buffer },
    size: { type: Number }
  }
);

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    file: { type: FileData, default: undefined },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
