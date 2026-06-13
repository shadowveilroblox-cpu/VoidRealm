import { SlashCommandBuilder } from 'discord.js';
import { activateAI, deactivateAI } from '../../services/aiService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("Activate AI mode in this channel"),
    
    async execute(interaction) {
        activateAI(interaction.channelId);
        await InteractionHelper.universalReply(interaction, "AI mode activated! I'm listening... 🤖");
    }
};

// Create a separate file or add this to a commands folder as deactivateai.js
export const deactivateCommand = {
    data: new SlashCommandBuilder()
        .setName("deactivateai")
        .setDescription("Turn off AI mode"),
    async execute(interaction) {
        deactivateAI(interaction.channelId);
        await InteractionHelper.universalReply(interaction, "AI mode deactivated. Goodbye! 💤");
    }
};
