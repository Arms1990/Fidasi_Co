const winston = require('winston');

process.umask(0);


const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.logstash()
  ),
  exitOnError: false,
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'exceptions.log',
      dirname: './storage/logs'
    })
  ],
  transports: [
    new winston.transports.File({
      filename: 'emerg.log',
      level: 'emerg',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'alert.log',
      level: 'alert',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'crit.log',
      level: 'crit',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'warning.log',
      level: 'warning',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'notice.log',
      level: 'notice',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      dirname: './storage/logs'
    }),
    new winston.transports.File({
      filename: 'debug.log',
      level: 'debug',
      dirname: './storage/logs'
    })
  ],
});

module.exports = {
    logger
};