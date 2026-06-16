import { SlashCommandBuilder } from 'discord.js';
import { dbManager } from '../../services/dbManager.js';
import { CodeInterpreter } from '../../services/codeInterpreter.js';

export default {
    data: new SlashCommandBuilder().setName("execute")
        .addStringOption(o => o.setName("name").setRequired(true)),
    async execute(interaction) {
        const item = await dbManager.get(interaction.options.getString("name"));
        if (!item) return interaction.reply("Not found.");
        
        const result = await CodeInterpreter.execute(item.content);
        await interaction.reply(result);
    }
};
