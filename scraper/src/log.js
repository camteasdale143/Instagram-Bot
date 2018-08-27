const fs = require('fs');
const util = require('util');

const logFile = fs.createWriteStream(`${__dirname}/debug.log`, { flags: 'w' });
const logStdout = process.stdout;

module.exports = function logData(data) {
  logFile.write(`${util.format(data)}\n`);
  logStdout.write(`${util.format(data)}\n`);
};
