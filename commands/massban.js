const CaseModel = require("../db/Case.js");
const { createCaseID } = require("../util/CaseGenerator.js");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "massban",
  description: "Ban multiple people from the guild.",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "role",
      description: "Role you want to ban.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the ban",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    // Checks if the user has Administrator permission
    if (!interaction.member.permissions.has("Administrator"))
      return interaction.reply({
        content: `You're not allowed to use this command.`,
        ephemeral: true,
      });

    // Gets the user and reason variable
    const role = interaction.options.getRole("role");
    const reason = interaction.options.getString("reason");

    // Checks if the user is banable!
    if (
      role.permissions.has("Administrator") ||
      role.position >
        interaction.guild.members.resolve(interaction.client.user).roles.highest
          .position
    ) {
      interaction.reply({
        content: `I'm not allowed to ban that role.`,
        ephemeral: true,
      });
      return;
    }

    // Setup caseID variable
    let caseID = await createCaseID();

    // Setup date variable
    let caseFullDate = new Date();
    let caseHours = await caseFullDate.getHours();
    let caseMinutes = await caseFullDate.getMinutes();
    let caseDay = await caseFullDate.getDate();
    let caseMonth = (await caseFullDate.getMonth()) + 1;
    let caseYear = await caseFullDate.getFullYear();
    let caseDate =
      caseHours +
      ":" +
      caseMinutes +
      " | " +
      caseDay +
      "/" +
      caseMonth +
      "/" +
      caseYear;

    // Creates a case in the database
    const Case = new CaseModel({
      _id: caseID,
      caseID: caseID,
      caseGuild: interaction.guild.id,
      roleID: role.id,
      caseMod: interaction.member.id,
      caseAction: "Mass Ban",
      caseReason: reason,
      caseDate: caseDate,
    });

    // Don't forget to save the case!
    Case.save();

    try {
      await interaction.guild.members.fetch();

      role.members.forEach((member) => {
        member.ban(
          `Case ID: ${Case.caseID} | Case Mod: ${interaction.member.user.tag}`
        );
      });
    } catch (e) {
      if (e) {
        interaction.reply({
          content: `Something went wrong. Please contact the bot administrator!`,
          ephemeral: true,
        });
        return console.error(e);
      }
    }

    // Sends a message back
    interaction.reply({
      content: `Banned **${role.members.size}** people with reason **${reason}**! Case ID: ${Case.caseID}`,
      ephemeral: true,
    });
  },
};
