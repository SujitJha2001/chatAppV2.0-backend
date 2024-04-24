const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const File = require("../models/fileModal");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const isFile = (req.files)?(req.files.file):undefined;
  if (!chatId || chatId.length<=0 || (isFile==undefined && content.length<=0)) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  let newMessage

  if(isFile) {
    const {name, data, mimetype, size} = req.files.file
    newMessage = {
      sender: req.user._id,
      content: content,
      file: {name, data, mimetype, size},
      chat: chatId,
    }
  } else {
    newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    }
  }

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
