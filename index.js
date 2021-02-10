require('dotenv').config()
const _ = require("lodash");
const axios = require("axios");

const Message = require("./models").Message;

const discordWebhookURL = process.env.DISCARD_WEBHOOK_URL;

const contentType = {
  text: "TdApi$MessageText",
  image: "TdApi$MessagePhoto",
};
const contentTypeArray = _.map(contentType);

exports.handler = async (req, res) => {
  try {
    console.log("handler::req.body::", JSON.stringify({
      body: req.body
    }));

    const messageId = _.get(req, "body.message.id", "0").toString()
    const chatId = _.get(req, "body.chat.id", "0").toString()
    const userId = _.get(req, "body.user.id", "0").toString()
    const replyToMessageId = _.get(req, "body.message.replyToMessageId", "0").toString()
    const groupName = _.get(req, "body.chat.title", "")
    const userName = _.get(req, "body.user.username", "")
    const photoUrl = _.get(req, "body.user.photoUrl", "")
    let entities = _.get(req, "body.message.content.text.entities", [])

    const createdMessage = await Message.create({
      messageId,
      chatId,
      userId,
      replyToMessageId,
      data: req.body || {},
    });

    console.log("handler::createdMessage::", JSON.stringify(createdMessage));
    const type = _.get(req, "body.message.content._type");
    if (type && contentTypeArray.includes(type)) {
      let content = _.get(req, "body.message.content.text.text", "");

      if (type === contentType.image) {
        content = _.get(req, "body.message.content.caption.text", "");
      }

      if(entities.length > 0) {
        entities = _.sortBy(entities, a => a.offset).reverse();  
        entities.map(each => {
          const eachType = _.get(each, "type._type")
          const eachURL = _.get(each, "type.url", "#")
          if(eachType === "TdApi$TextEntityTypeTextUrl"){
            content = content.slice(0, each.offset) + `[${content.slice(each.offset, (each.offset + each.length))}](${eachURL})` + content.slice(each.offset + (each.offset + each.length), content.length)
          }
        })
    }

      const params = {
        username: `New Mention in ${groupName}`,
        avatar_url: _.get(req, "body.user.photoUrl", ""),
        embeds: [{
          fields: [{
            name: `Message: `,
            value: `${content ? content : ""}`,
            inline: true
          }],
          author: {
            name: `${userName}`,
            // url: `https://t.me/${userName}/${messageId}`,
            icon_url: `${photoUrl}`
          },
        }]
      };

      console.log("handler::replyToMessageId::", replyToMessageId);
      if (replyToMessageId !== "0") {
        const replyToMessageData = await Message.findOne({
          where: {
            messageId: replyToMessageId
          }
        });
        console.log("handler::replyToMessageData::", _.get(replyToMessageData, "id", "0"));
        if (replyToMessageData && _.get(replyToMessageData, "id")) {
          const repliedUserName = _.get(replyToMessageData, "data.user.username", "")
          const repliedType = _.get(replyToMessageData, "data.message.content._type");
          let repliedContent = _.get(replyToMessageData, "data.message.content.text.text", "");
          if (repliedType === contentType.image) {
            repliedContent = _.get(replyToMessageData, "data.message.content.caption.text", "");
          }
          params.embeds[0].description = `*${repliedUserName}: ${repliedContent ? repliedContent : ""}*`;
        }
      }

      if (type === contentType.image) {
        params.embeds[0].image = {
          url: _.get(req, "body.fileUrl", "")
        };
      }

      await axios.post(discordWebhookURL, params);
    }

    return res.status(200).json({
      status: 200,
      message: "Data received",
    });
  } catch (error) {
    console.log("handler::catch::", error);
    return res.status(200).json({
      status: 200,
      message: "Error",
      error
    });
  }
};