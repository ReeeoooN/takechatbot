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

noFam = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Не указывать', callback_data: 'noFamily'}],
        ]
    })
}

notOn = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Хочу помочь', callback_data: 'notificationOn'}, {text: 'Назад', callback_data: 'start'}],
            [{text: 'Удалить заявку', callback_data: 'delticket'}]
        ]
    })
}

notOff = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Отписаться от уведомлений', callback_data: 'notificationOff'}, {text: 'Назад', callback_data: 'start'}],
            [{text: 'Удалить заявку', callback_data: 'delticket'}]
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

module.exports.noFam = noFam;
module.exports.notOn = notOn;
module.exports.notOff = notOff;
module.exports.startchoise = startchoise;
module.exports.back=back;
module.exports.taketickbtn=taketickbtn;
module.exports.nectaketickbtn=nectaketickbtn