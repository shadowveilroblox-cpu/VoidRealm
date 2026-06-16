import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { PokemonGame } from '../../services/pokemonGame.js';

export default {
    data: new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("Start a turn-based Pokémon game.")
        .addStringOption(o => o.setName("prize").setDescription("Winner's prize").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const msg = await interaction.reply({ 
            content: "🎮 **Pokémon Guessing Game!**\nReact with ✅ to participate. Starting in 30s.", 
            fetchReply: true 
        });
        
        await msg.react('✅');

        const collector = msg.createReactionCollector({ time: 30000 });
        collector.on('end', async (collected) => {
            const reaction = collected.get('✅');
            const players = reaction ? Array.from(reaction.users.cache.values()).filter(u => !u.bot) : [];
            
            if (players.length === 0) return interaction.followUp("❌ No one joined!");

            const game = new PokemonGame(interaction.channel, players, interaction.options.getString("prize"));
            game.start();
        });
    }
};
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
