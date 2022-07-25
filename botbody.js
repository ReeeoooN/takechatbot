const {TelegramApi, tocen, bot} = require('./TelegramAPI')
const {logging} = require('./logging')
const {startchoise, back} = require('./botBtn')
const {ticketModel, chatModel } = require('./bd')
const {deleteBotMessage, createChatDB} = require('./Func/messDelF')
const {returnchat} = require('./Func/function')

bot.setMyCommands( [
    {command: '/start', description: 'Начать'}
]) // Стандартные команды

bot.on('message', async msg =>{
   const text = msg.text;
   const cid = msg.chat.id;
   const uName = msg.from.username;
   const fName = msg.from.first_name;
   let log = `Написал ${uName} c чата ${cid}. Текст сообщения "${text}"`;
   logging(log);
   if (text === '/start') {
    chatModel.destroy({
        where: {
            chatid: cid
        }
    }).then((res) => {
        log = `Удалили данные из бд${res}`;
        logging(log);
    });
    let mess = await bot.sendMessage(cid, `Привет, ${fName}, хочешь вернуть чат?`, startchoise)
    createChatDB(cid, mess.message_id);
   } 
   if (text === 'chat') {
    chatModel.findAll({raw:true}).then(async users =>{
        if (users.length < 1) {
            bot.sendMessage(cid, 'Заявок нет')
        } else {
            for (let i = 0; i < users.length; i++) {
                bot.sendMessage(cid, `Заявка №${i+1} (ID ${users[i].id}):\n Пользователь - @${users[i].chatid}`)
            }
        }
        
   })
   }
   if (text === 'tick') {
    ticketModel.findAll({raw:true}).then(async users =>{
        if (users.length < 1) {
            bot.sendMessage(cid, 'Заявок нет')
        } else {
            for (let i = 0; i < users.length; i++) {
                bot.sendMessage(cid, `Заявка №${i+1} (ID ${users[i].id}):\n Пользователь - @${users[i].username}\n ID чата - ${users[i].returnchatid}`)
            }
        }
        
   })
    }
})

bot.on('callback_query', async msg =>{
   const data = msg.data;
   const cid = msg.message.chat.id;
   const uName = msg.from.username;
   const fName = msg.from.first_name;

   if (data === 'wantreturn') {
    ticketModel.findOne({where: {chatid: cid}, raw: true}).then(async user =>{
        if (!user) {
            deleteBotMessage(cid);
            returnchat(cid)
        } else {
            deleteBotMessage(cid);
            let mess =  await bot.sendMessage(cid, 'Ты уже оставлял заявку', back)
            createChatDB(cid, mess.message_id)
        }
    })
   }
   if (data === 'wantnot'){
    deleteBotMessage(cid)

   }

   if (data === 'start') {
    deleteBotMessage(cid)
    let mess = await bot.sendMessage(cid, `${fName}, ты вернулся в главное меню. Хочешь вернуть чат?`, startchoise)
    createChatDB(cid, mess.message_id);
   }

})