import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { PokemonGame } from '../../services/pokemonGame.js'; // Ensure this path is correct

export default {
    data: new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("Start a turn-based Pokémon guessing game.")
        .addStringOption(option => 
            option.setName("prize")
                .setDescription("What the winner will get!")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        // 1. Acknowledge command and start the lobby
        const msg = await interaction.reply({ 
            content: "🎮 **Pokémon Guessing Game!**\nReact with ✅ to join. The game starts in 30 seconds.", 
            fetchReply: true 
        });
        
        await msg.react('✅');

        // 2. Setup the collector for the 30s lobby
        const collector = msg.createReactionCollector({ 
            time: 30000, 
            filter: (reaction, user) => reaction.emoji.name === '✅' && !user.bot 
        });

        collector.on('end', async (collected) => {
            const reaction = collected.get('✅');
            const participants = reaction ? Array.from(reaction.users.cache.values()).filter(u => !u.bot) : [];
            
            if (participants.length === 0) {
                return interaction.followUp("❌ No one joined the game! Ending lobby.");
            }

            // 3. Start the game service
            const game = new PokemonGame(
                interaction.channel, 
                participants, 
                interaction.options.getString("prize")
            );
            
            game.start();
        });
    }
};
