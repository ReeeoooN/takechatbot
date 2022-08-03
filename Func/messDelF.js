const {ticketModel, chatModel } = require('../bd')
const {logging} = require('../logging')
const {TelegramApi, tocen, bot} = require('../TelegramAPI')

function deleteBotMessage (chatid) {
    chatModel.findOne({where: {chatid: `${chatid}`}, raw: true})
        .then(user=>{
            if(!user) {
                let log = `Не найдено сообщений для удаления`;
                logging(log);
                return
            }
            const cid = user.chatid;
            const mid = user.messageid;
            bot.deleteMessage(cid, mid)
            chatModel.destroy({
                where: {
                    chatid: chatid
                }
            })
        }).catch(err=>console.log(err));
} // Удаляет предыдущее сообщение

function createChatDB(chatid, messid) {
    chatModel.create({
        chatid: `${chatid}`,
        messageid: `${messid}`
    }).catch(err=>console.log(err));
} // Создает запись с сообщением для удаления

module.exports.deleteBotMessage = deleteBotMessage;
module.exports.createChatDB = createChatDB;