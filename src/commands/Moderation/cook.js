const { SlashCommandBuilder, PermissionFlagsBits } = require('cook.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cook')
        .setDescription('Deletes user messages and times them out')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to cook')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(target.id);
        const channel = interaction.channel;

        try {
            // Delete messages from the target user
            const messages = await channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(m => m.author.id === target.id);
            await channel.bulkDelete(userMessages, true);

            // Timeout for 30 minutes
            await member.timeout(30 * 60 * 1000, 'Cooked by moderator');

            await interaction.reply(`Successfully cooked ${target.toString()} 🍚`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'I couldn\'t cook that user. Check my permissions or role hierarchy.', ephemeral: true });
        }
    },
};
