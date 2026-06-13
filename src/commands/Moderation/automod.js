import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// We store these in a simple object for now (or use your DB)
const filters = {
    words: [],
    links: []
};

export default {
    data: new SlashCommandBuilder()
        .setName("automod")
        .setDescription("Configure auto-moderation")
        .addSubcommand(sub => sub
            .setName("words")
            .setDescription("Set banned words (comma separated)")
            .addStringOption(o => o.setName("list").setDescription("e.g. fuck,shit,nigga").setRequired(true)))
        .addSubcommand(sub => sub
            .setName("links")
            .setDescription("Set banned links (comma separated)")
            .addStringOption(o => o.setName("list").setDescription("e.g. discord.gg,roblox.com").setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const type = interaction.options.getSubcommand();
        const list = interaction.options.getString("list").split(',');

        if (type === 'words') filters.words = list;
        if (type === 'links') filters.links = list;

        await InteractionHelper.universalReply(interaction, {
            embeds: [successEmbed(`✅ **Automod ${type}**`, `Successfully updated: ${list.join(', ')}`)]
        });
    }
};
