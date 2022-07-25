const { ticketModel } = require("../bd")
const { back } = require("../botBtn")
const { logging } = require("../logging")
const { bot } = require("../TelegramAPI")
const { createChatDB, deleteBotMessage } = require("./messDelF")



async function returnchat(chatid) {
    const rChat = new Promise( async (resolve, reject)=>{
        let mess = await bot.sendMessage(chatid, 'Введи ID чата')
        createChatDB(chatid, mess.message_id)
        bot.on("message", async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;
            const uName = msg.from.username;
            let result = {
                text: text,
                chatId: chatId,
                uName: uName
            }
            resolve(result)
        })
    }).then( async res =>{
        if(res.text.length == 36) {
        
            let log = `${res.uName} хочет вернуть чат ${res.text}`
            logging(log)
            deleteBotMessage(res.chatId)
            ticketModel.create({
                chatid: res.chatId,
                username: res.uName,
                returnchatid: res.text
            })
            let mess = await bot.sendMessage (res.chatId, 'Отлично, как кто-то вернет чат тебе придет уведомление', back)
            createChatDB(res.chatId, mess.message_id)
        } else {
            let log = `${res.uName} отправил не ID чата ${res.text}`
            logging(log) 
            deleteBotMessage(res.chatId)
            let mess = await bot.sendMessage (res.chatId, `Ты ввел не id чата`, back)
            createChatDB(res.chatId, mess.message_id)
        }
    })
}

function notificator(cid) {
    ticketModel.findOne({where: {chatId: cid}, raw: true}).then(user)
}

module.exports.returnchat = returnchat