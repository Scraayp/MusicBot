const CaseModel = require('../db/Case.js');
const { createCaseID} = require('../util/CaseGenerator.js')
const {ApplicationCommandOptionType} = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');

const { User } = require('discord.js');

module.exports = {
    name: "getcase",
    description: "Give information about a case.",
    permissions: "0x0000000000000800",
    options: [
        {
            name: "id",
            description: "The case id you want to look into",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        // Check if the user is allowed to use this command.
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content:`You're not allowed to use this command.`, ephemeral: true});
        
        // Get the id from the interaction options.
        const id = interaction.options.getString('id');

        // Find the case by id in the database
        let doc = await CaseModel.findOne({caseID: id});

        // Send message when cant find the case
        if(!doc) return interaction.reply({content:`I couldn't find any cases with that id`, ephemeral: true});

        // Get the right variables for the user and mod
        let caseModUser = await client.users.fetch(doc.caseMod) || await client.users.cache.get(doc.caseMod) || null;
        let caseUser = await client.users.fetch(doc.userID) || await client.users.cache.get(doc.userID) || null;

        // Create embed with the case information.
        const embed = new EmbedBuilder()
        .setAuthor({name: caseModUser.tag, iconURL:caseModUser.displayAvatarURL()})
        // .setColor("#fff00")
        .setFooter({text:'For any questions, please contact server admin.'})
        .setFields(
            {
                name: "Case User",
                value: caseUser.toString() || caseUser.id,
                inline: true
            },
            {
                name: "Case Mod",
                value: caseModUser.toString() || caseModUser.id,
                inline: true
            },
            {
                name: "Case Action",
                value: doc.caseAction,
                inline: true,
            },
            {
                name: "Case Reason",
                value: doc.caseReason,
                inline: true
            },
            {
                name: "Case Date",
                value: doc.caseDate,
                inline: false,
            }
        );

        // Send the embed to the user.
        interaction.reply({embeds: [embed], ephemeral: true})

    },
};
  