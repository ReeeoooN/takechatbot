startchoise = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Хочу вернуть чат', callback_data: 'wantreturn'}],
            [{text: 'Хочу помочь коллегам и вернуть их чаты', callback_data: 'wantnot'}]
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
        ]
    })
} 

module.exports.startchoise = startchoise;
module.exports.back=back;
module.exports.taketickbtn=taketickbtn