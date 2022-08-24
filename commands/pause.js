module.exports = {
  name: "pause",
  description: "Stops playing the currently playing music.",
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

    const success = queue.setPaused(true);

    return interaction
      .reply({
        content: success
          ? `**${queue.current.title}** - music paused! ✅`
          : `Something went wrong. ❌`,
      })
      .catch((e) => {});
  },
};
