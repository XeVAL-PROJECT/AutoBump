/* jshint esversion: 6 */

var config =  {
  tokens      : {
    discord   : "тут ваш токен Дискорд-бота | ОБЯЗАТЕЛЬНО ПОЛЬЗОВАТЕЛЯ, А НЕ БОТА | На GitHub вышла ошибка :D",
    rucaptcha:  "тут ваш токен Рукапчи"
  },
  bumpch      : "тут ID канала, где будет прописываться команда",
  bumpbot     : "315926021457051650",
  bumpcommand : "!bump",
  sdhas       : "Ставьте 0, если нету бота Server-Discord.com. Иначе 1",
  sdbot       : "464272403766444044",
  sdcommand   : "s.up"
};

var Discord      = require('discord.js');
var client       = new Discord.Client();
var Image        = require('image-binary');
var rucaptcha    = require('rucaptcha-client').create(config.tokens.rucaptcha);

function bump(bumpch, bumpcommand) {
  if(config.sdhas === "1") client.channels.get(bumpch).send(config.sdcommand);
  client.channels.get(bumpch).send(bumpcommand);
}

client.on('ready', async () => {
  console.log('Бот запущен.')
  bump(config.bumpch, config.bumpcommand);
});

client.on('error', (err) => console.error(err));

client.on('message', async (message) => {
  if(message.author.id === config.bumpbot && message.channel.id === config.bumpch) {
    const answer = await rucaptcha.solve({
      image: await (Image.create(message.attachments.first().url)),
      language: 0,
      phrase: 0,
      regsense: 0,
      numeric: 1,
      calc: 1
    });

    message.channel.send(`!${answer.text}`)
    return setInterval(bump(config.bumpch, config.bumpcommand), 18000000);
  }
});

client.login(config.tokens.discord);
