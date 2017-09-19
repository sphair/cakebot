#!/usr/bin/env node

/* eslint no-console: off */

import winston from 'winston';
import chalk from 'chalk';
import cakebot from './cakebot';
import pkg from '../package.json';

if (['help', '--help', '-h', 'version', '--version', '-v'].includes(process.argv[2])) {
  console.log(`
    ${chalk.bgMagenta(`cakebot v${pkg.version}`)}

    Usage:

    ${chalk.cyan('cakebot')}

    Configuration through environment variables:

    ${chalk.cyan('CAKEBOT_TOKEN')}         - ${chalk.grey('(Mandatory)')} The Slack Bot User OAuth Access Token for your organisation/team
    ${chalk.cyan('CAKEBOT_TRIGGERS')}      - ${chalk.grey('(Optional)')} A comma separated list of words that triggers the bot to reply (${chalk.grey('Default')}: "kake,cakebot")
    ${chalk.cyan('CAKEBOT_MESSAGE_COLOR')} - ${chalk.grey('(Optional)')} The hex color used by the bot to mark it's messages (${chalk.grey('Default')}: "#590088")
  `);
  process.exit(0);
}

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      timestamp() {
        return (new Date()).toISOString();
      },
    }),
  ],
});

logger.cli();

if (!process.env.CAKEBOT_TOKEN) {
  logger.error('You must setup the CAKEBOT_TOKEN environment variable before running the bot');
  process.exit(1);
}

const options = { logger };
if (process.env.CAKEBOT_TRIGGERS) {
  options.triggerOnWords = process.env.CAKEBOT_TRIGGERS.split(',');
}
if (process.env.CAKEBOT_MESSAGE_COLOR) {
  options.messageColor = process.env.CAKEBOT_MESSAGE_COLOR;
}

const bot = cakebot(process.env.CAKEBOT_TOKEN, options);
bot.start();
