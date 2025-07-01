import util from 'util';
import 'winston-mongodb';
import { createLogger, format, transports } from 'winston';
import config from '../config/config.js';
import { EApplicationEnvironment } from '../constant/application.js';
import path from 'path';
import { red, blue, yellow, green, magenta } from 'colorette';
import * as sourceMapSupport from 'source-map-support';

// Linking Trace Support
sourceMapSupport.install();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const colorizeLevel = (level) => {
    switch (level) {
        case 'ERROR':
            return red(level);
        case 'INFO':
            return blue(level);
        case 'WARN':
            return yellow(level);
        default:
            return level;
    }
};

const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;

    const customLevel = colorizeLevel(level.toUpperCase());
    const customTimestamp = green(timestamp);
    const customMessage = message;
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true,
    });

    return `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`;
});

const consoleTransport = () => {
    if (config.env === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat),
            }),
        ];
    }
    return [];
};

const fileLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;
    const logMeta = {};

    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || '',
            };
        } else {
            logMeta[key] = value;
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta,
    };

    return JSON.stringify(logData, null, 4);
});

const fileTransport = () => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileLogFormat),
        }),
    ];
};

const mongodbTransport = () => {
    return [
        new transports.MongoDB({
            level: 'info',
            db: config.database.url,
            metaKey: 'meta',
            expireAfterSeconds: 3600 * 24 * 30,
            collection: 'application-logs',
        }),
    ];
};

export default createLogger({
    defaultMeta: {
        meta: {},
    },
    transports: [...fileTransport(), ...mongodbTransport(), ...consoleTransport()],
});
