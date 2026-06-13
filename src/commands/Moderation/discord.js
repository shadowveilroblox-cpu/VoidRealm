const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cook')
        .setDescription('Deletes user messages and times them out')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to cook')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Ensures only mods can use this

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(target.id);
        const channel = interaction.channel;

        try {
            // 1. Delete the user's messages in the current channel
            const messages = await channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(m => m.author.id === target.id);
            await channel.bulkDelete(userMessages, true);

            // 2. Timeout the user for 30 minutes (in milliseconds)
            const duration = 30 * 60 * 1000; 
            await member.timeout(duration, 'Cooked by a moderator');

            // 3. Respond to the command
            await interaction.reply(`Successfully cooked ${target.toString()} 🍚`);
            
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'Failed to cook the user. Please check my permissions.', 
                ephemeral: true 
            });
        }
    },
};
      
