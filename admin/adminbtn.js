adminStart = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Tickets', callback_data: 'adminTick'}, {text: 'Tickets DEL', callback_data: 'adminTickDel'}],
            [{text: 'bigUsers', callback_data: 'adminBu'}, {text: 'bigUsers DEL', callback_data: 'adminBuDel'}],
            [{text: 'Показать админов', callback_data: 'adminShowAdmin'}, {text: 'Забрать админку', callback_data: 'adminRemAdmin'}],
            [{text: 'Дать админку', callback_data: 'adminGiveAdmin'}],
            [{text: 'Выгрузить лог', callback_data: 'adminGiveLog'}],
            [{text: 'Назад', callback_data: 'start'}]
        ]
    })
}

adminBack = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [{text: 'Back', callback_data: 'adminStartMenu'}],
        ]
    })
}

module.exports.adminStart =adminStart
module.exports.adminBack = adminBack