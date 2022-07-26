const { Sequelize } = require('sequelize')
const {DataTypes} = require('sequelize')

sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'main.db'
})

const ticket = sequelize.define('tickets', {
    chatid: {type: DataTypes.INTEGER, }, //unique: true
    username: {type: DataTypes.STRING},
    family: {type: DataTypes.STRING},
    returnchatid: {type: DataTypes.STRING}
})


module.exports.ticketModel = ticket;

const chat = sequelize.define('chats', {
    chatid: {type: DataTypes.INTEGER},
    messageid: {type: DataTypes.INTEGER}
})



module.exports.chatModel = chat;

const biguser = sequelize.define('bigusers', {
    chatid: {type: DataTypes.INTEGER},
    username: {type: DataTypes.STRING}
})

module.exports.bigusersModel = biguser

const admins = sequelize.define('admins', {
    chatid: {type: DataTypes.INTEGER, unique: true}, 
    username: {type: DataTypes.STRING}
})

module.exports.adminsModel = admins

try {
    sequelize.authenticate()
    console.log('К ticketБД подключился')
} catch (e) {
    console.log('Не удалось подлключиться к БД')
}
