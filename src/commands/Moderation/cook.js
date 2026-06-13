import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName("cook")
        .setDescription("Delete user messages and timeout the user")
        .addUserOption((option) =>
            option.setName("target")
                .setDescription("The user to cook")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    category: "moderation",

    async execute(interaction, config, client) {
        try {
            const target = interaction.options.getMember("target");
            const channel = interaction.channel;

            if (!target) {
                throw new Error("Could not find that member.");
            }

            // 1. Delete the user's messages
            const messages = await channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(m => m.author.id === target.id);
            await channel.bulkDelete(userMessages, true);

            // 2. Timeout for 30 minutes (in milliseconds)
            await target.timeout(30 * 60 * 1000, 'Cooked by moderator');

            // 3. Respond using your bot's helper
            await InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        `🍚 **Successfully cooked** ${target.user.tag}`,
                        `Messages cleared and user timed out for 30 minutes.`
                    ),
                ],
            });
        } catch (error) {
            console.error('Cook command error:', error);
            await handleInteractionError(interaction, error, { subtype: 'cook_failed' });
        }
    },
};
