var Botkit = require('botkit')
var request = require('request');

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

var controller = Botkit.slackbot()
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }
})

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears(['420blazeit'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'blazeit.')
})

controller.hears(['Tell Ivan to fuck off, please!'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Right away!')
  request("https://maker.ifttt.com/trigger/email_request/with/key/dbUpwEFGIaKw9rnOyLsRqJ", function(error, response, body) {
    bot.reply('All done!');
  });
})

controller.hears(['Bluetooth on!'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'On it!')
  request("https://maker.ifttt.com/trigger/phone_bluetooth_on/with/key/dbUpwEFGIaKw9rnOyLsRqJ", function(error, response, body) {
  });
})

controller.hears(['Bluetooth off!'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Switching that shit right off, Captain!')
  request("https://maker.ifttt.com/trigger/phone_bluetooth_off/with/key/dbUpwEFGIaKw9rnOyLsRqJ", function(error, response, body) {
  });
})

controller.hears(['^Message Ivan: '], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'On it!');
  var options = {
  method: 'post',
  body: {"value1": message.text.substring(message.text.indexOf(":")+2, message.text.length)},
  json: true,
  url: "https://maker.ifttt.com/trigger/sms_ivan/with/key/dbUpwEFGIaKw9rnOyLsRqJ"
}
  request(options, function(error, response, body) {console.log(response)});
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
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
