const { QueryType } = require("discord-player");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "play",
  description: "Play a track.",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "musics",
      description: "Type the name of the track you want to play.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  voiceChannel: true,
  run: async (client, interaction) => {
    if (interaction.member.id !== 421196790394519562)
      return interaction.reply({
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    const name = interaction.options.getString("musics");
    const playlist = interaction.options.getBoolean("playlist");
    if (playlist) {
    } else {
      if (!name)
        return interaction
          .reply({
            content: `Write the name of the track you want to search. ❌`,
            ephemeral: true,
          })
          .catch((e) => {});

      const res = await client.player.search(name, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO,
      });
      if (!res || !res.tracks.length)
        return interaction
          .reply({ content: `No results found! ❌`, ephemeral: true })
          .catch((e) => {});

      const queue = await client.player.createQueue(interaction.guild, {
        leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
        autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
        metadata: interaction.channel,
        leaveOnEmpty: false,
      });

      try {
        if (!queue.playing)
          await queue.connect(interaction.member.voice.channelId);
      } catch {
        await client.player.deleteQueue(interaction.guild.id);
        return interaction
          .reply({
            content: `I can't join your voice channel. ❌`,
            ephemeral: true,
          })
          .catch((e) => {});
      }

      await interaction
        .reply({
          content: `<@${interaction.member.id}>, Loading music(s)... 🎧`,
        })
        .catch((e) => {});
      res.playlist
        ? queue.addTracks(res.tracks)
        : queue.addTrack(res.tracks[0]);
      if (!queue.playing) await queue.play();
    }
  },
};
