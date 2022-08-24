const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "help",
  description: "It helps you to get information about bot and commands.",
  permissions: "0x0000000000000800",
  options: [],
  showHelp: false,
  run: async (client, interaction) => {
    if (interaction.member.id !== 421196790394519562)
      return interaction.reply({
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    const commands = client.commands.filter((x) => x.showHelp !== false);

    const embed = new EmbedBuilder()
      .setColor("007fff")
      .setTitle(client.user.username)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields([
        {
          name: `Bot Commands`,
          value: commands.map((x) => `\`/${x.name}\``).join(" | "),
        },
      ])
      .setTimestamp()
      .setFooter({ text: `For support contact your server owner.` });
    interaction.reply({ embeds: [embed] }).catch((e) => {});
  },
};
