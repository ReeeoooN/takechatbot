const { Sequelize } = require('sequelize')
const {DataTypes} = require('sequelize')

sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'main.db'
})

const ticket = sequelize.define('tickets', {
    chatid: {type: DataTypes.INTEGER, }, //unique: true
    username: {type: DataTypes.STRING},
    returnchatid: {type: DataTypes.STRING}
})


module.exports.ticketModel = ticket;

const chat = sequelize.define('chats', {
    chatid: {type: DataTypes.INTEGER},
    messageid: {type: DataTypes.INTEGER}
})

const bigusers = sequelize.define('bigusers', {
    chatid: {type: DataTypes.INTEGER},
    username: {type: DataTypes.STRING}
})

module.exports.chatModel = chat;

try {
    sequelize.authenticate()
    console.log('К ticketБД подключился')
} catch (e) {
    console.log('Не удалось подлключиться к БД')
}
