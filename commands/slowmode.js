const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "slowmode",
  description: "Set slowmode for a channel.",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "channel",
      description: "The channel you want to set the slowmode for.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "time",
      description: "The time you want to set the slowmode for. In seconds",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "You are not allowed to use this command.",
        ephemeral: true,
      });
    }
    const channel = interaction.options.getChannel("channel");
    const time = interaction.options.getInteger("time");

    if (time > 21600) {
      return interaction.reply({
        content: "You can't set the slowmode for more than 6 hours.",
        ephemeral: true,
      });
    }
    if (time < 0) {
      return interaction.reply({
        content: "You can't set the slowmode for less than 0 second.",
        ephemeral: true,
      });
    }
    channel.setRateLimitPerUser(
      time,
      "Slowmode set by " + interaction.user.tag
    );
    return interaction.reply({
      content: `Slowmode for ${channel} has been set to ${time} seconds.`,
      ephemeral: true,
    });
  },
};
