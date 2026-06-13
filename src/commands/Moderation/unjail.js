import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { jailedUsers } from './jail.js'; // Import the storage

export default {
    data: new SlashCommandBuilder()
        .setName("unjail")
        .setDescription("Unjail a user and restore roles")
        .addUserOption(option => option.setName("target").setDescription("User to unjail").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    category: "moderation",

    async execute(interaction) {
        const target = interaction.options.getMember("target");
        const jailRoleId = "1505300194147696800";

        try {
            const oldRoles = jailedUsers.get(target.id) || [];
            
            // Set roles back to saved ones
            await target.roles.set(oldRoles);
            jailedUsers.delete(target.id);

            await InteractionHelper.universalReply(interaction, {
                embeds: [successEmbed(`🔓 **Unjailed** ${target.user.tag}`, `Roles restored.`)]
            });
        } catch (error) {
            await handleInteractionError(interaction, error, { subtype: 'unjail_failed' });
        }
    },
};
