const {ticketModel, chatModel } = require('../bd')
const {logging} = require('../logging')
const {TelegramApi, tocen, bot} = require('../TelegramAPI')

function deleteBotMessage (chatid) {
    chatModel.findOne({where: {chatid: `${chatid}`}, raw: true})
        .then(user=>{
            if(!user) {
                return log = `Не найдено сообщений для удаления`;
                logging(log);
            }
            const cid = user.chatid;
            const mid = user.messageid;
            bot.deleteMessage(cid, mid)
            console.log(`Удалили сообщение ${user.chatid}, ${user.messageid}`);
            chatModel.destroy({
                where: {
                    chatid: chatid
                }
            }).then((res) => {
                console.log(`Удалили данные из бд${res}`);
            });
        }).catch(err=>console.log(err));
} // Удаляет предыдущее сообщение

function createChatDB(chatid, messid) {
    chatModel.create({
        chatid: `${chatid}`,
        messageid: `${messid}`
    }).then(res=>{
        const user = {id: res.id, chatid: res.chatid, messageid: res.messageid}
        console.log(user);
    }).catch(err=>console.log(err));
} // Создает запись с сообщением для удаления

module.exports.deleteBotMessage = deleteBotMessage;
module.exports.createChatDB = createChatDB;