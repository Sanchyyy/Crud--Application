const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, label, printf, colorize } = format;

// Define the custom format
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Configure the daily rotate file transport
const rotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE% .log',
  datePattern: 'YYYY-MM-DD-HH-mm-ss',
  zippedArchive: true, //older file into zipped
  maxSize: '1k',
  maxFiles: '14d',
});

// Create the logger with the desired settings
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'smms-logs' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    customFormat
  ),
  transports: [
    rotateFileTransport,
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' })
  ]
});

module.exports = logger;
