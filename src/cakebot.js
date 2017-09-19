import { RtmClient, WebClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client';
import { isMessage, isMessageToChannel, isFromUser, messageContainsText } from './utils';

const defaultOptions = {
  triggerOnWords: ['kake', 'cakebot'],
  messageColor: '#590088',
  logger: console,
  rtmOptions: {},
};

const cakebot = (botToken, options = {}) => {
  let botId;

  const opt = Object.assign({}, defaultOptions, options);
  const rtm = new RtmClient(botToken, opt.rtmOptions);
  const web = new WebClient(botToken);

  rtm.on(RTM_EVENTS.MESSAGE, (event) => {
        if (
      isMessage(event) &&
      isMessageToChannel(event) &&
      !isFromUser(event, botId) &&
      messageContainsText(event, opt.triggerOnWords)
    ) {
      const msgOptions = {
        as_user: true,
        attachments: [
          {
            color: opt.messageColor,
            title: "joke.text",
          },
        ],
      };

      web.chat.postMessage(event.channel, '', msgOptions);
      opt.logger.info(`Posting message to ${event.channel}`, msgOptions);
    }
  });

  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    botId = rtmStartData.self.id;
    opt.logger.info(`Logged in as ${rtmStartData.self.name} (id: ${botId}) of team ${rtmStartData.team.name}`);
  });

  return {
    rtm,
    web,
    start() { rtm.start(); },
  };
};

export default cakebot;
