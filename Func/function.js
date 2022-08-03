const { ticketModel, chatModel, bigusersModel} = require("../bd")
const { back, taketickbtn, nectaketickbtn, notOn, notOff, noFam} = require("../botBtn")
const { logging } = require("../logging")
const { bot } = require("../TelegramAPI")
const { createChatDB, deleteBotMessage } = require("./messDelF")



async function returnchat(chatid) { //создание заявки на возврат чата
    const rChat = new Promise( async (resolve, reject)=>{
        let mess = await bot.sendMessage(chatid, 'Введи ID чата')
        createChatDB(chatid, mess.message_id)
        function setRes (chatid) {
            let result = {
                text: 'timeOut',
                chatId: chatid,
                uName: 'timeOut'
            }
            resolve(result)
        }
        setTimeout(setRes, 120000, chatid) //таймер закрывает промис, в случае если не ответили 
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
        if(res.text.length == 36) { //Проверка указал ли пользователь ID чата
            let log = `${res.uName} хочет вернуть чат ${res.text}`
            logging(log)
            ticketModel.create({
                chatid: res.chatId,
                username: res.uName,
                returnchatid: res.text
            })
            const rChatF = new Promise(async(resolve, reject)=>{
                deleteBotMessage(chatid)
                let mess = await bot.sendMessage(chatid, `Для создания заявки так же укажи свою фамилию`, noFam)
                createChatDB(chatid, mess.message_id)
                function setResF (chatid) {
                    let result = {
                        text: null,
                        id: chatid
                    }
                    resolve(result)
                }
                setTimeout(setResF, 120000, chatid) 
                bot.on('message', async msg=>{
                    let fam = msg.text;
                    let result = {
                        text: fam,
                        id: chatid
                    }
                    resolve(result)
                })
                bot.on('callback_query', async msg =>{ //В случае если пользователь не указал фамилию и нажал кнопку, промис закрывается
                    let result = {
                        text: null,
                        id: chatid
                    }
                    resolve(result)
                })
            }) .then(async res=>{
                if(res.text !== null) {
                    ticketModel.update({family: res.text}, {where: {chatid: res.id}})
                    deleteBotMessage(res.id)
                    await bot.sendMessage (res.id, 'Отлично, как кто-то вернет чат тебе придет уведомление, если тебе не ответят за 5 минут, заявка удалится')
                    let mess = await bot.sendMessage(res.id, 'Вернемся в главное меню?',back)
                    createChatDB(res.id, mess.message_id)
                    bigusersModel.findAll({raw:true}).then(users=>{
                        if (users.chatid !== chatid) {
                            for(let i = 0; i<users.length; i++) {
                                bot.sendMessage(users[i].chatid, `Есть запрос на возврат чата, возьмешь?`, taketickbtn)
                                let log = `рассылка на ${users[i].username}`
                                logging(log)
                            }
                        }                    
                    })
                    setTimeout(autoTicketDeleter, 300000, chatid) //Автоудаление заявки через 5 минут
                } else {
                    ticketModel.update({family: 'Пользователь не указал фамилию'}, {where: {chatid: res.id}})
                    deleteBotMessage(res.id)
                    await bot.sendMessage(res.id, 'Ты не указал фамилию, либо за 2 минуты не поступило ответа. Заявка отправлена без нее, как кто-то вернет чат тебе придет уведомление. Если тебе не ответят за 5 минут, заявка удалится')
                    let mess = await bot.sendMessage(res.id, 'Вернемся в главное меню?',back)
                    createChatDB(res.id, mess.message_id)
                    bigusersModel.findAll({raw:true}).then(users=>{
                        for(let i = 0; i<users.length; i++) {
                            if(users[i].chatid !== chatid) {
                                bot.sendMessage(users[i].chatid, `Есть запрос на возврат чата, возьмешь?`, taketickbtn)
                                let log = `рассылка на ${users[i].username}`
                                logging(log)
                            }
                        }
                    })
                    setTimeout(autoTicketDeleter, 300000, chatid)
                }
            })
        } else if (res.text === 'timeOut') {
            deleteBotMessage(res.chatId)
            let mess = await bot.sendMessage (res.chatId, `Ты не ввел id чата`, back)
            createChatDB(res.chatId, mess.message_id)
        }else {
            let log = `${res.uName} отправил не ID чата ${res.text}`
            logging(log) 
            deleteBotMessage(res.chatId)
            let mess = await bot.sendMessage (res.chatId, `Ты ввел не id чата`, back)
            createChatDB(res.chatId, mess.message_id)
        }
    })
}

async function lkcheck(cid) {
    let log = `${cid} Решил зайти в лк`
    logging(log)
    bigusersModel.findOne({where: {chatid: cid}, raw: true}).then(user=>{
        if (!user) {
            ticketModel.findAll({where: {chatid: cid}, raw: true}).then( async res=>{
                deleteBotMessage(cid)
                let mess = await bot.sendMessage(cid, `Колличество твоих активных заявок на возврат чата: ${res.length}\n Ты не состоишь в списке людей, которые помогают возвращать чаты`, notOn)
                createChatDB(cid, mess.message_id)
            })
        } else {
            ticketModel.findAll({where: {chatid: cid}, raw: true}).then(async res=>{
                deleteBotMessage(cid)
                let mess = await bot.sendMessage(cid, `Колличество твоих активных заявок на возврат чата: ${res.length}\n Ты состоишь в списке людей, которые помогают возвращать чаты`, notOff)
                createChatDB(cid, mess.message_id)
            })
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
            ticketModel.findAll({raw:true}).then(async res =>{
                let amount = 1;
                for (let i = 0; i<res.length; i++){
                    if(res[i].chatid === cid) {
                        amount++;
                    }
                }
                if (res.length < amount) {
                    deleteBotMessage(cid)
                    let mess = await bot.sendMessage(cid, 'Ты подписался на уведомления. Пока заявок нет, вернемся в главное меню?', back)
                    createChatDB(cid, mess.message_id)
                } else {
                    for(let i = 0; i<res.length; i++) {
                        if (res[i].chatId !== cid) {
                            deleteBotMessage(cid)
                            let mess = await bot.sendMessage(cid, `Ты подписался на уведомления. Есть запрос на возврат чата, возьмешь?`, nectaketickbtn)
                            createChatDB(cid, mess.message_id)
                        }
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
    ticketModel.findAll({raw: true}).then(async res=>{
        if (res.length > 0) {
            for (let i = 0; i<res.length; i++) {
                bot.sendMessage(cid, `@${res[i].username} просит вернуть чат\n ID чата - <code>${res[i].returnchatid}</code> \n Фамилия - "${res[i].family}"\n <a href="https://mon.kontur.ru/livechat-admin/issue-search">Админка</a>`, {parse_mode: 'HTML'})
                bot.sendMessage(res[i].chatid, `${uName} возвращает тебе чаты.`)
                let log = `${uName} скушал заявку от ${res[i].username}`
                logging(log)
                ticketModel.destroy({
                    where: {
                        chatid: res[i].chatid
                    }
                })
            }
        } else {
            deleteBotMessage(cid)
            let log = `${uName} не успел скушать заявку`
            logging(log)
            let mess = await bot.sendMessage(cid, `Заявки уже нет, возможно ее закрыл твой коллега, но все равно спасибо:)`, back)
            createChatDB(cid, mess.message_id)
        }
    })
}

function ticketDeleter (cid) {
    ticketModel.findOne({where: {chatid:cid}}).then(async user=>{
        if(!user) {
            deleteBotMessage(cid)
            let mess = await bot.sendMessage(cid, `Твоей заявки нет, либо ты ее не оставлял, либо ее забрали`,back)
            createChatDB(cid, mess.message_id)
        } else {
            ticketModel.destroy({where: {chatid: cid}}).then( async res=>{
                let log = `${cid} удалил свою заявку ${res}`
                logging(log)
                deleteBotMessage(cid)
                let mess = await bot.sendMessage(cid, "Твоя заявка была удалена", back)
                createChatDB(cid, mess.message_id)
            })
        }
    })
}

function autoTicketDeleter (cid) {
    ticketModel.findOne({where: {chatid:cid}}).then(async user=>{
        if(!user) {
            let log = 'Сработало автоудаление но заявки нет'
            logging(log)
        } else {
            ticketModel.destroy({where: {chatid: cid}}).then( async res=>{
                let log = `${cid} Сработало автоудаление ${res}`
                logging(log)
                deleteBotMessage(cid)
                let mess = await bot.sendMessage(cid, "Твоя заявка была удалена, так как на нее не поступило ответа", back)
                createChatDB(cid, mess.message_id)
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

module.exports.ticketDeleter = ticketDeleter
module.exports.lkcheck = lkcheck
module.exports.delnot = delnot
module.exports.taker = taker
module.exports.returnchat = returnchat
module.exports.notificator = notificator