const console = require('console');
var fs = require('fs');
const format = require('node.date-time');


async function logging (log){
    return fs.appendFile(`./logs/${new Date().format("Y-M-d")}.log`, `${new Date().format("Y-M-d H:M:S")} ${log} \r\n`, function(){})
}
logging()

module.exports.logging = logging;