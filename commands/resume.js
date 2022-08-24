module.exports = {
  name: "resume",
  description: "Restarts paused music.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    if (interaction.author.id !== 421196790394519562)
      return interaction.reply({
        content: "You are not allowed to use this command.",
      });
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction
        .reply({
          content: `There is no music currently playing!. ❌`,
          ephemeral: true,
        })
        .catch((e) => {});

    const success = queue.setPaused(false);

    return interaction
      .reply({
        content: success
          ? `**${queue.current.title}**, Track resumed! ✅`
          : `Something went wrong. ❌ It's like you haven't stopped the music before.`,
      })
      .catch((e) => {});
  },
};
