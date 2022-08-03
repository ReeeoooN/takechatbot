const { bigusersModel, ticketModel, adminsModel } = require("../bd");
const { back } = require("../botBtn");
const { deleteBotMessage, createChatDB } = require("../Func/messDelF");
const { bot } = require("../TelegramAPI");
const { adminBack } = require("./adminbtn");

async function showAllTick (cid) { //Показать заявки
    deleteBotMessage(cid)
    ticketModel.findAll({raw:true}).then(async res=>{
        for (let i=0; i<res.length; i++){
            bot.sendMessage(cid, `Заявка №${i+1}:\n ID - ${res[i].id}\n chatID - ${res[i].chatid}\n username - ${res[i].username}\n family - ${res[i].family}\n returnchatid - ${res[i].returnchatid}`)
        }
        let mess = await bot.sendMessage(cid, `Вот и все`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}
 async function showAllBu (cid) { //Показать пользователей с уведомлениями
    deleteBotMessage(cid)
    bigusersModel.findAll({raw:true}).then(async res=>{
        for (let i=0; i<res.length; i++){
            bot.sendMessage(cid, `Пользователь №${i+1}:\n ID - ${res[i].id}\n chatID - ${res[i].chatid}\n username - ${res[i].username}`)
        }
        let mess = await bot.sendMessage(cid, `Вот и все`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}
async function dellTick (cid) {// удалить заявку
    const del = new Promise( async (resolve, reject)=>{
        bot.sendMessage(cid, 'Введи id')
        bot.on ('message', async msg=>{
            const text = msg.text;
            resolve(text)
        })
    }).then(async res=>{
        ticketModel.destroy({where: {id: res}})
        deleteBotMessage(cid)
        let mess = await bot.sendMessage(cid, `Пользователь удален`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}
async function dellBu (cid) {// удалить пользователя
    const del = new Promise( async (resolve, reject)=>{
        bot.sendMessage(cid, 'Введи id')
        bot.on ('message', async msg=>{
            const text = msg.text;
            resolve(text)
        })
    }).then(async res=>{
        bigusersModel.destroy({where: {id: res}})
        deleteBotMessage(cid)
        let mess = await bot.sendMessage(cid, `Пользователь удален`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}

function adminCreate(cid){ //Дать права админа
    const admCrCid = new Promise( async (resolve, reject)=>{
        bot.sendMessage(cid, `Введи id чата`)
        bot.on ('message', async msg=>{
            const text = msg.text;
            resolve(text)
        })
    }).then(async res=>{
        adminsModel.create({
            chatid: res
        }).then(user=>{
            const admCrUn = new Promise( async (resolve, reject)=>{
                bot.sendMessage(cid, `ChatID ${user.chatid} добавлен, введи username без "@"`)
                bot.on ('message', async msg=>{
                    const text = msg.text;
                    let result = {
                        username: text,
                        id: user.chatid
                    }
                    resolve(result)
                })
            }).then(res=>{
                adminsModel.update({username: res.username}, {where: {chatid: res.id}}).then(async res=>{
                    console.log(res);
                    deleteBotMessage(cid)
                    let mess = await bot.sendMessage(cid, `Администратор добавлен`, adminBack)
                    createChatDB(cid, mess.message_id)
                })
            })
        })
    })
}

async function showAllAdmin (cid) { //показать админов
    deleteBotMessage(cid)
    adminsModel.findAll({raw:true}).then(async res=>{
        for (let i=0; i<res.length; i++){
            bot.sendMessage(cid, `Админ №${i+1}:\n ID - ${res[i].id}\n chatID - ${res[i].chatid}\n username - ${res[i].username}`)
        }
        let mess = await bot.sendMessage(cid, `Вот и все`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}

async function dellAdmins (cid) { //Удалить админа
    const del = new Promise( async (resolve, reject)=>{
        bot.sendMessage(cid, 'Введи id')
        bot.on ('message', async msg=>{
            const text = msg.text;
            resolve(text)
        })
    }).then(async res=>{
        adminsModel.destroy({where: {id: res}})
        deleteBotMessage(cid)
        let mess = await bot.sendMessage(cid, `Админ удален`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}

async function giveLogFile (cid) { //отправить в чат файл лог
    deleteBotMessage(cid)
    let mess = await bot.sendMessage(cid, `Не реализовано`, adminBack)
    createChatDB(cid, mess.message_id)
}

module.exports.giveLogFile = giveLogFile
module.exports.dellAdmins =dellAdmins
module.exports.showAllAdmin = showAllAdmin
module.exports.showAllTick =showAllTick
module.exports.showAllBu= showAllBu
module.exports.dellTick =dellTick 
module.exports.dellBu = dellBu
module.exports.adminCreate = adminCreate
