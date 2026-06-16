import { SlashCommandBuilder } from 'discord.js';
import { dbManager } from '../../services/dbManager.js';

export default {
    data: new SlashCommandBuilder().setName("createfile")
        .addStringOption(o => o.setName("filename").setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString("filename");
        await dbManager.save(name, "", "file");
        await interaction.reply(`File **${name}** created.`);
    }
};
