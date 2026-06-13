import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

// Temporary memory store (Use a database for production persistence)
export const jailedUsers = new Map(); 

export default {
    data: new SlashCommandBuilder()
        .setName("jail")
        .setDescription("Jail a user")
        .addUserOption(option => option.setName("target").setDescription("User to jail").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    category: "moderation",

    async execute(interaction) {
        const target = interaction.options.getMember("target");
        const jailRoleId = "1505300194147696800";

        try {
            // Save current roles (excluding @everyone)
            const roles = target.roles.cache.filter(r => r.id !== interaction.guild.id && r.id !== jailRoleId);
            jailedUsers.set(target.id, Array.from(roles.keys()));

            // Remove all roles and add jail role
            await target.roles.set([jailRoleId]);

            await InteractionHelper.universalReply(interaction, {
                embeds: [successEmbed(`🔒 **Jailed** ${target.user.tag}`, `Roles saved and removed.`)]
            });
        } catch (error) {
            await handleInteractionError(interaction, error, { subtype: 'jail_failed' });
        }
    },
};
                                                  
