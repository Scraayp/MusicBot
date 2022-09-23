const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "nowplaying",
  description: "Provides information about the music being played.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    if (interaction.member.id !== "421196790394519562")
      return interaction.reply({
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction
        .reply({
          content: `There is no music currently playing!. ❌`,
          ephemeral: true,
        })
        .catch((e) => {});

    const track = queue.current;

    const embed = new EmbedBuilder();
    embed.setColor("007fff");
    embed.setThumbnail(track.thumbnail);
    embed.setTitle(track.title);

    const methods = ["disabled", "track", "queue"];

    const timestamp = queue.getPlayerTimestamp();
    const trackDuration =
      timestamp.progress == "Forever" ? "Endless (Live)" : track.duration;

    embed.setDescription(
      `Audio **%${queue.volume}**\nDuration **${trackDuration}**\nURL: ${
        track.url
      }\nLoop Mode **${methods[queue.repeatMode]}**\n${track.requestedBy}`
    );

    embed.setTimestamp();
    embed.setFooter({ text: `For support contact your server owner.` });

    const saveButton = new ButtonBuilder();
    saveButton.setLabel("Save Song");
    saveButton.setCustomId("saveTrack");
    saveButton.setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(saveButton);

    interaction.reply({ embeds: [embed], components: [row] }).catch((e) => {});
  },
};
