import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("code")
        .setDescription("Execute a specialized bot configuration code")
        .addUserOption(o => o.setName("user").setDescription("The bot user").setRequired(true))
        .addStringOption(o => o.setName("code").setDescription("The code to execute").setRequired(true)),

    async execute(interaction) {
        const code = interaction.options.getString("code");

        // Simple validation to match your exact format
        if (code.includes("Number% = Successfully Setted The Percentage") && code.includes("End Script Ends")) {
            
            // Extracting values using Regex
            const tailsMatch = code.match(/Tails = (\d+)%/);
            const headsMatch = code.match(/Heads = (\d+)%/);

            const tails = tailsMatch ? tailsMatch[1] : "Unknown";
            const heads = headsMatch ? headsMatch[1] : "Unknown";

            await interaction.reply({
                content: `✅ **Script Processed Successfully!**\n` +
                         `Target: ${interaction.options.getUser("user")}\n` +
                         `Configured: Tails (${tails}%), Heads (${heads}%)`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "❌ **Syntax Error:** The provided code is missing required lines or the 'End Script Ends' tag.",
                ephemeral: true
            });
        }
    }
};
            
