module.exports = {
  name: "stop",
  description: "Plays the previous music again.",
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

    queue.destroy();

    interaction
      .reply({ content: `Music stopped. See you next time! ✅` })
      .catch((e) => {});
  },
};
