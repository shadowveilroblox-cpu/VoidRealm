import { SlashCommandBuilder } from 'discord.js';
import { dbManager } from '../../services/dbManager.js';

export default {
    data: new SlashCommandBuilder().setName("code")
        .addStringOption(o => o.setName("scriptname").setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString("scriptname");
        await dbManager.save(name, "", "script");
        await interaction.reply(`Script **${name}** initialized. Use your IDE to edit.`);
    }
};
