import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { db } from '../../services/database.js'; // Assuming you have a DB service
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName("auditlog")
        .setDescription("Configure the audit log channel")
        .addSubcommand(sub => sub
            .setName("setup")
            .setDescription("Set the channel for audit logs")
            .addChannelOption(o => o.setName("channel").setDescription("Select the log channel").setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const guildId = interaction.guild.id;

        // Check if bot has permission in that channel
        if (!channel.permissionsFor(interaction.client.user).has('SendMessages')) {
            return await InteractionHelper.universalReply(interaction, "I have no perms to send messages in that channel ❌", true);
        }

        // Save to Database (adjust this to your specific DB structure)
        await db.query('UPDATE guild_settings SET audit_channel_id = $1 WHERE guild_id = $2', [channel.id, guildId]);

        await InteractionHelper.universalReply(interaction, "Audit Logs Successfully Setted Up ✅");
    }
};
