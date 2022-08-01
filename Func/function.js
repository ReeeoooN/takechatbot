const { ticketModel, chatModel, bigusersModel} = require("../bd")
const { back, taketickbtn, nectaketickbtn} = require("../botBtn")
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

function notificator(cid, uName) {
    bigusersModel.findOne({where: {chatid: cid}, raw: true}).then( async user =>{
        if (!user) {
            bigusersModel.create({
                chatid: cid,
                username: uName
            })
            deleteBotMessage(cid)
            let mess = await bot.sendMessage(cid, `Мы сообщим тебе если кто-то захочет вернуть чат мы тебе сообщим`)
            createChatDB(cid, mess.message_id)
            ticketModel.findAll({raw:true}).then(async res =>{
                if (res.length < 1) {
                    deleteBotMessage(cid)
                    let mess = await bot.sendMessage(cid, 'Пока заявок нет, вернемся в главное меню?', back)
                    createChatDB(cid, mess.message_id)
                } else {
                    for(let i = 0; i<res.length; i++) {
                        deleteBotMessage(cid)
                        let mess = await bot.sendMessage(cid, `Есть запрос на возврат чата, возьмешь?`, nectaketickbtn)
                        createChatDB(cid, mess.message_id)
                    }
                }
            })
        } else {
            ticketModel.findAll({raw:true}).then( async res =>{
                if (res.length < 1) {
                    deleteBotMessage(cid)
                    let mess = await bot.sendMessage(cid, 'Пока заявок нет, вернемся в главное меню?', back)
                    createChatDB(cid, mess.message_id)
                } else {
                    for(let i = 0; i<res.length; i++) {
                        deleteBotMessage(cid)
                        let mess = await bot.sendMessage(cid, `Есть запрос на возврат чата, возьмешь?`, nectaketickbtn)
                        createChatDB(cid, mess.message_id)
                    }
                }
            })
        }
    })
}

function taker (cid, uName) {
    deleteBotMessage(cid)
    ticketModel.findAll({raw: true}).then(res=>{
        for (let i = 0; i<res.length; i++) {
            bot.sendMessage(cid, `@${res[i].username} просит вернуть чат\n ID чата - ${res[i].returnchatid} \n Админка - https://mon.kontur.ru/livechat-admin/issue-search`)
            bot.sendMessage(res[i].chatid, `${uName} возвращает тебе чаты.`)
            ticketModel.destroy({
                where: {
                    chatid: res[i].chatid
                }
            })
        }
    })
}

async function delnot(cid) {
    bigusersModel.destroy({
        where: {
            chatid: cid
        }
    }).then((res) => {
        log = `${cid} отписался от уведомлений ${res}`;
        logging(log);
    });
    deleteBotMessage(cid)
    let mess = await bot.sendMessage(cid, 'Больше я не отправлю сообшения, если кто-то захочет вернуть чат', back)
    createChatDB(cid, mess.message_id)
}

module.exports.delnot = delnot
module.exports.taker = taker
module.exports.returnchat = returnchat
module.exports.notificator = notificator