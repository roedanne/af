//const winston = require('winston')
import * as winston from 'winston';
//import dailyRotateFile from 'winston-daily-rotate-file';

const colorizer = winston.format.colorize();

// Setup a console log and a file log
/*
const rollingFileAppender = new dailyRotateFile({
  filename: 'logs/log-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'warn',
});
*/
const consoleAppender = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(

    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf((info:any) => {
        if (info.level == 'error' && info.code) {
            return colorizer.colorize(info.level,`[${[info.timestamp]}] ${info.level}\t Error code: "${info.code}" See log files for more details`)
        } else
        if (info.originalStack) {
            return colorizer.colorize(info.level,`[${[info.timestamp]}] ${info.level}\t ${info.originalStack}`)
        }
        return colorizer.colorize(info.level,`[${[info.timestamp]}] ${info.level}\t ${info.message}`)
      }
    )
  )
})

export default winston.createLogger({
  transports: [
    //rollingFileAppender,
    consoleAppender
  ]
});
