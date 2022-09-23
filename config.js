module.exports = {
  TOKEN:
    "MTAxMTIzNDE4ODQxMTgwNTczNg.GqBCrK.K_1wzJ454MW017_BcyqKhnD4HN3Q-DSceGDDJ4",
  status: "Playing some music...",

  opt: {
    voiceConfig: {
      leaveOnEnd: false,
      autoSelfDeaf: false, //IF YOU WANT TO DEAF THE BOT, set false to true.

      leaveOnTimer: {
        //The leaveOnEnd variable must be "false" to use this system.
        status: false, //If this variable is "true", the bot will leave the channel when the bot is offline.
        time: 20000, //1000 = 1 second
      },
    },

    maxVol: 100, //You can specify the maximum volume level.
    loopMessage: false,

    discordPlayer: {
      ytdlOptions: {
        quality: "highestaudio", //Please don't touch
        highWaterMark: 1 << 25, //Please don't touch
      },
    },
  },
};
