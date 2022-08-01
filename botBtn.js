startchoise = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Хочу вернуть чат', callback_data: 'wantreturn'}],
            [{text: 'Личный кабинет', callback_data: 'lk'}]
        ]
    })
} 
back = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Назад', callback_data: 'start'}],
        ]
    })
}

taketickbtn = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Взять заявку', callback_data: 'taketick'}],
            [{text: 'Отписаться от уведомлений', callback_data: 'delnot'}]
        ]
    })
} 
nectaketickbtn = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Взять заявку', callback_data: 'taketick'}],
        ]
    })
} 

module.exports.startchoise = startchoise;
module.exports.back=back;
module.exports.taketickbtn=taketickbtn;
module.exports.nectaketickbtn=nectaketickbtn