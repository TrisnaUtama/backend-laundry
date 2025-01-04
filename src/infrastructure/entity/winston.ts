import winston from "winston";

const { combine, timestamp, json, prettyPrint, errors } = winston.format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  level: "info",
  levels: customLevels.levels,
  format: combine(errors({ stack: true }), timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "logfile.log" }),
  ],
});

export default logger;
