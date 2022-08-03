const {TelegramApi, tocen, bot} = require('./TelegramAPI')
const {logging} = require('./logging')
const {startchoise, back} = require('./botBtn')
const {ticketModel, chatModel, bigusersModel, adminsModel} = require('./bd')
const {deleteBotMessage, createChatDB} = require('./Func/messDelF')
const {returnchat, notificator, taker, delnot, lkcheck, ticketDeleter} = require('./Func/function')
const { adminStart } = require('./admin/adminbtn')
const {showAllTick, showAllBu, dellTick, dellBu, adminCreate, showAllAdmin, dellAdmins, giveLogFile} = require('./admin/adminFnc')

bot.setMyCommands( [
    {command: '/start', description: 'Начать'}
]) // Стандартные команды

bot.on('message', async msg =>{ //Обработчик текстовых событий
   const text = msg.text;
   const cid = msg.chat.id;
   const uName = msg.from.username;
   const fName = msg.from.first_name;
   let log = `Написал ${uName} c чата ${cid}. Текст сообщения "${text}"`;  
   logging(log); 
   if (text === '/start') {
    chatModel.destroy({ // удаление всех записей сообщений из базы данных
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
   if (text === '/admin') { //Проход в админку с проверкой
        adminsModel.findAll({raw:true}).then(async users=>{
            for(let i=0; i<users.length; i++){
                if(users[i].chatid === cid) {
                    deleteBotMessage(cid)
                    let mess = await bot.sendMessage(cid, `Добро пожаловать администратор`, adminStart)
                    createChatDB(cid, mess.message_id)
                    break
                }
            }
        })
   }
})

bot.on('callback_query', async msg =>{ //Обработчик callback_query событий (кнопки)
   const data = msg.data;
   const cid = msg.message.chat.id;
   const uName = msg.from.username;
   const fName = msg.from.first_name;

   if (data === 'wantreturn') {  //Блок, отвечающий за отправку заявки на возврат чата
    let log = `${uName} Хочет вернуть чат`
    logging(log)
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
   if (data === 'lk'){ //Блок, отвечающий за вход в лк
    lkcheck(cid)
   }
   if (data === 'notificationOn') { 
    let log = `${uName} Подписался на уведомления`
    logging(log)
    notificator(cid, uName)
   }

   if (data === 'notificationOff') {
    let log = `${uName} Отписался от уведомлений`
    logging(log)
    delnot(cid)
   }
   if (data === 'delticket') { //Блок, отвечающий заудаление заявки
    ticketDeleter(cid)
   }

   if (data === 'taketick') { //Блок, отвечающий за забор заявки
    let log = `${uName} Поймал заявку`
    logging(log)
    taker(cid, uName)
   }
   if (data === 'delnot') { 
    
    delnot(cid)
   }
   if (data === 'start') {
    deleteBotMessage(cid)
    let mess = await bot.sendMessage(cid, `${fName}, ты вернулся в главное меню. Хочешь вернуть чат?`, startchoise)
    createChatDB(cid, mess.message_id);
   }
// Админские фичи 
   if (data === 'adminTick'){
    showAllTick(cid)
   }
   if (data === 'adminBu'){
    showAllBu(cid)    
   }
   if (data === 'adminTickDel'){
    dellTick(cid)
   }
   if (data === 'adminBuDel'){
    dellBu(cid)
   }
   if (data === 'adminStartMenu') {
    deleteBotMessage(cid)
    let mess = await bot.sendMessage(cid, `Добро пожаловать, администратор`, adminStart)
    createChatDB(cid, mess.message_id)
   }
   if (data === 'adminShowAdmin'){
    showAllAdmin(cid)
   }
   if (data === 'adminGiveAdmin'){
    adminCreate(cid)
   }
   if (data=== 'adminRemAdmin'){
    dellAdmins(cid)
   }
   if (data === 'adminGiveLog'){
    giveLogFile(cid)
   }
})