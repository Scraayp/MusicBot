const CaseModel = require('../../db/Case.js');
const { createCaseID} = require('../../util/CaseGenerator.js')
const {ApplicationCommandOptionType} = require('discord.js');

module.exports = {
    name: "ban",
    description: "Ban someone from the guild.",
    permissions: "0x0000000000000800",
    options: [
        {
            name: "user",
            description: "User you want to ban",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "The reason for the ban",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "remove_messages",
            description: "If the bot should remove the messages of the user. (7 days)",
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ],
    run: async (client, interaction) => {
      // Checks if the user has Administrator permission
      if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content:`You're not allowed to use this command.`, ephemeral: true});
      
      // Gets the user and reason variable
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      const removeMsgs = interaction.options.getBoolean('remove_messages');


        // Create variable for msg remove period
      let removeMsgsSec;

      // Set the seconds to remove the messages for
      if(removeMsgs == true){
        removeMsgsSec = 604800
      }else {
        removeMsgsSec = 0
      }

      // Checks if the user is banable!
      if(user.id === client.user.id 
      || user.id === interaction.member.id 
      || user.id === interaction.guild.ownerId){
        interaction.reply({content:`I'm not allowed to ban that user.`, ephemeral: true});
        return;
      }

      // Setup caseID variable
      let caseID = await createCaseID();

      // Setup date variable
      let caseFullDate = new Date();
      let caseHours = await caseFullDate.getHours();
      let caseMinutes = await caseFullDate.getMinutes();
      let caseDay = await caseFullDate.getDate();
      let caseMonth = await caseFullDate.getMonth() + 1;
      let caseYear = await caseFullDate.getFullYear();
      let caseDate = caseHours+":"+caseMinutes + " | " + caseDay+"/"+caseMonth+"/"+caseYear;

      // Creates a case in the database
      const Case = new CaseModel({
        _id: caseID,
        caseID: caseID,
        caseGuild: interaction.guild.id,
        userID: user.id,
        caseMod: interaction.member.id,
        caseAction: "Ban",
        caseReason: reason,
        caseDate: caseDate,
      });
      
      // Don't forget to save the case!
      Case.save();


      try {
        // Fetch the member from discord
        let userMember = await interaction.guild.members.fetch(user.id);
        
        // Ban the fetched member snowflake
        userMember.ban({reason:`Case ID: ${Case.caseID} | Case Mod: ${interaction.member.user.tag}`, deleteMessageSeconds: removeMsgsSec}).catch(err => {
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
  