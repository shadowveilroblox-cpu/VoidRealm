import { SlashCommandBuilder } from 'discord.js';
import { dbManager } from '../../services/dbManager.js';

export default {
    data: new SlashCommandBuilder().setName("scripts"),
    async execute(interaction) {
        const list = await dbManager.list();
        const msg = list.map(s => `${s.type === 'file' ? '📁' : '📜'} ${s.name}`).join('\n');
        await interaction.reply(msg || "No scripts found.");
    }
};
