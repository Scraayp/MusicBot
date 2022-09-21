const CaseModel = require('../db/Case.js');
const { createCaseID} = require('../util/CaseGenerator.js')
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
      // Checks if the user has Administrator permission
      if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content:`You're not allowed to use this command.`, ephemeral: true});
      
      // Gets the user and reason variable
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');

      // Checks if the user is kickable!
      if(user.id === client.user.id 
      || user.id === interaction.member.id 
      || user.id === interaction.guild.ownerId){
        interaction.reply({content:`I'm not allowed to kick that user.`, ephemeral: true});
        return;
      }

      // Setup caseID variable
      let caseID = await createCaseID();

      // Setup date variable
      let caseFullDate = new Date();
      let caseDate = `${caseFullDate.getHours}:${caseFullDate.getMinutes} | ${caseFullDate.getDay}/${caseFullDate.getMonth}/${caseFullDate.getFullYear}`

      // Creates a case in the database
      const Case = new CaseModel({
        userID: user.id,
        caseID: caseID,
        caseReason: reason,
        caseMod: interaction.member.id,
        caseDate: caseDate,
      });
      
      // Don't forget to save the case!
      Case.save();


      try {
        // Fetch the member from discord
        let userMember = await interaction.guild.members.fetch(user.id);
        
        // Kick the fetched member snowflake
        userMember.kick(`Case ID: ${Case.caseID} | Case Mod: ${interaction.member.tag}`).catch(err => {
          if(err){
              interaction.reply({content:`Something went wrong. Please contact the bot administrator!`, ephemeral: true})
              return console.error(err);
          }
        })
      }catch (e) {
        if (e){
          interaction.reply({content:`Something went wrong. Please contact the bot administrator!`, ephemeral: true})
          return console.error(e);
        }
      }

      // Sends a message back
      interaction.reply({content:`**${user.tag}** *(${user.id})* has been kicked! Case ID: ${Case.caseID}`, ephemeral: true})
    },
  };
  