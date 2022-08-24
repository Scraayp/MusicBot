const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: "time",
  description: "Indicates which minute of the music you are playing.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    if (interaction.member.id !== 421196790394519562)
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

    const progress = queue.createProgressBar();
    const timestamp = queue.getPlayerTimestamp();

    if (timestamp.progress == "Infinity")
      return interaction
        .reply({
          content: `This song is live streaming, no duration data to display. 🎧`,
          ephemeral: true,
        })
        .catch((e) => {});

    const saveButton = new ButtonBuilder();
    saveButton.setLabel("Update");
    saveButton.setCustomId("time");
    saveButton.setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(saveButton);

    const embed = new EmbedBuilder()
      .setColor("007fff")
      .setTitle(queue.current.title)
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      .setDescription(`${progress} (**${timestamp.progress}**%)`)
      .setFooter({ text: `For support contact your server owner.` });
    interaction.reply({ embeds: [embed], components: [row] }).catch((e) => {});
  },
};
