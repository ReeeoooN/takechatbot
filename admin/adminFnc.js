const { bigusersModel, ticketModel, adminsModel } = require("../bd");
const { back } = require("../botBtn");
const { deleteBotMessage, createChatDB } = require("../Func/messDelF");
const { bot } = require("../TelegramAPI");
const { adminBack } = require("./adminbtn");
var fs = require('fs');
const format = require('node.date-time');
const { logging } = require("../logging");

async function showAllTick (cid, uName) { //Показать заявки
    let log = `${uName} хочет посмотреть тикеты`
    logging(log)
    deleteBotMessage(cid)
    ticketModel.findAll({raw:true}).then(async res=>{
        for (let i=0; i<res.length; i++){
            bot.sendMessage(cid, `Заявка №${i+1}:\n ID - ${res[i].id}\n chatID - ${res[i].chatid}\n username - ${res[i].username}\n family - ${res[i].family}\n returnchatid - ${res[i].returnchatid}`)
        }
        let mess = await bot.sendMessage(cid, `Вот и все`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}
 async function showAllBu (cid, uName) { //Показать пользователей с уведомлениями
    let log = `${uName} хочет посмотреть пользователей`
    logging(log)
    deleteBotMessage(cid)
    bigusersModel.findAll({raw:true}).then(async res=>{
        for (let i=0; i<res.length; i++){
            bot.sendMessage(cid, `Пользователь №${i+1}:\n ID - ${res[i].id}\n chatID - ${res[i].chatid}\n username - ${res[i].username}`)
        }
        let mess = await bot.sendMessage(cid, `Вот и все`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}
async function dellTick (cid, uName) {// удалить заявку
    let log = `${uName} хочет удалить тикет`
    logging(log)
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
        let log = `${uName} удалил тикет id${res}`
        logging(log)
        createChatDB(cid, mess.message_id)
    })
}
async function dellBu (cid, uName) {// удалить пользователя
    let log = `${uName} хочет удалить пользователя`
    logging(log)
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
        let log = `${uName} удалил пользователя id${res}`
        logging(log)
        createChatDB(cid, mess.message_id)
    })
}

function adminCreate(cid, uName){ //Дать права админа
    let log = `${uName} дать админку`
    logging(log)
    const admCrCid = new Promise( async (resolve, reject)=>{
        deleteBotMessage(cid)
        let mess = await bot.sendMessage(cid, `Введи id чата`)
        createChatDB(cid, mess.message_id)
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
                adminsModel.findOne({where:{chatid: res.id}, raw:true}).then(user=>{
                    let log = `${uName} дал админку @${user.username}`
                    logging(log)
                })
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

async function showAllAdmin (cid, uName) { //показать админов
    let log = `${uName} хочет посмотреть админов`
    logging(log)
    deleteBotMessage(cid)
    adminsModel.findAll({raw:true}).then(async res=>{
        for (let i=0; i<res.length; i++){
            bot.sendMessage(cid, `Админ №${i+1}:\n ID - ${res[i].id}\n chatID - ${res[i].chatid}\n username - ${res[i].username}`)
        }
        let mess = await bot.sendMessage(cid, `Вот и все`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}

async function dellAdmins (cid, uName) { //Удалить админа
    let log = `${uName} хочет удалить админа`
    logging(log)
    const del = new Promise( async (resolve, reject)=>{
        bot.sendMessage(cid, 'Введи id')
        bot.on ('message', async msg=>{
            const text = msg.text;
            resolve(text)
        })
    }).then(async res=>{
        await adminsModel.findOne({where:{id: res}, raw:true}).then(user=>{
            let log = `${uName} забрал права у ${user.username}`
            logging(log)
        })
        adminsModel.destroy({where: {id: res}})
        deleteBotMessage(cid)
        let mess = await bot.sendMessage(cid, `Админ удален`, adminBack)
        createChatDB(cid, mess.message_id)
    })
}

async function giveLogFile (cid, uName) { //отправить в чат файл лог
    let log = `${uName} хочет выгрузил логи`
    logging(log)
    const testName = 'test'
    fs.readFile(`./logs/${new Date().format("Y-M-d")}.log`, "utf8", 
            function(error,data){
                console.log("Асинхронное чтение файла");
                if(error) throw error; // если возникла ошибка
                bot.sendMessage(cid, data);  // выводим считанные данные
});
    deleteBotMessage(cid)
    let mess = await bot.sendMessage(cid, `Лог был выслан`, adminBack)
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
