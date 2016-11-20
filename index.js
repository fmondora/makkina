var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('file_shared', (bot, file ) => {

  console.log(JSON.stringify(file));
  //bot.reply(message, 'zizze（。 ㅅ  。）');
  bot.api.im.open({
          user: file.user_id
      }, (err, res) => {
          if (err) {
              bot.botkit.log('Failed to open IM with user', err)
          }
          console.log(res);

          bot.startConversation({
              user: file.user_id,
              channel: res.channel.id,
              text: 'WOWZA... 1....2'
          }, (err, convo) => {
              if (err) { bot.botkit.log("Failed to do something again")}
              convo.say('File accepted!')
          });
      })


/*  bot.say({
            text: 'file arrivato: ',
            //username: 'U0280SJ6E'
            channel: 'C2VDGNAG5'
        });

        */
});

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['tits'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, '（。 ㅅ  。）');
});

controller.hears(['boobs'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, '（。 Y  。）');
});

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears('.*', ['direct_message'], function (bot, message) {
  bot.reply(message, 'You really do care about makkina. :heart::heart::heart::heart::heart:')
})


controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
