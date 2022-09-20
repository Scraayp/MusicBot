const CaseModel = require('../db/Case.js');
const createCaseID = require('../util/CaseGenerator.js')
const {ApplicationCommandOptionType} = require('discord.js')

module.exports = {
    name: "kick",
    description: "Kick someone from the guild. Create case",
    permissions: "0x0000000000000800",
    options: [
        {
            name: "user",
            description: "User you want to kick",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "The reason for the kick",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, interaction) => {
      if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content:`You're not allowed to use this command.`, ephemeral: true});
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');

      // Checks if the user is kickable!
      if(user.permissions.has("Administrator") 
      || user.id === client.user.id 
      || user.id === interaction.member.id 
      || user.id === interaction.guild.owner.user.id 
      || !user.kickable){
        interaction.reply({content:`I'm not allowed to kick that user.`, ephemeral: true});
        return;
      }

      // Creates a case in the database
      const Case = new CaseModel({
        userID: user.id,
        caseID: createCaseID,
        caseReason: reason,
        caseMod: interaction.member.id,
        caseDate: new Date(),
      });
      
      // Don't forget to save the case!
      Case.save();

      // Kicks the user
      user.kick(`Case ID: ${Case.caseID} | Case Mod: ${interaction.member.tag}`).catch(err => {
        if(err){
            interaction.reply({content:`Something went wrong. Please contact the bot administrator!`, ephemeral: true})
            return console.error(err);
        }
      })

      // Sends a message back
      interaction.reply({content:`**${user.tag}** *(${user.id})* has been kicked! Case ID: ${Case.caseID}`, ephemeral: true})

      // Maybe, logs *
    },
  };
  