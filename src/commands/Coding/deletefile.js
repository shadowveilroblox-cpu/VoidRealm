import { SlashCommandBuilder } from 'discord.js';
import { dbManager } from '../../services/dbManager.js';

export default {
    data: new SlashCommandBuilder().setName("deletefile")
        .addStringOption(o => o.setName("name").setRequired(true)),
    async execute(interaction) {
        await dbManager.delete(interaction.options.getString("name"));
        await interaction.reply("Deleted.");
    }
};
