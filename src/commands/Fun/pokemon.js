import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { PokemonGame } from '../../services/pokemonGame.js';

export default {
    data: new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("Start a Pokémon turn-based game")
        .addStringOption(o => o.setName("prize").setDescription("Winner's prize").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const msg = await interaction.reply({ content: "Game starting in 30s! React ✅ to participate.", fetchReply: true });
        await msg.react('✅');

        const collector = msg.createReactionCollector({ time: 30000 });
        collector.on('end', async () => {
            const reaction = msg.reactions.cache.get('✅');
            const users = (await reaction.users.fetch()).filter(u => !u.bot);
            
            if (users.size === 0) return interaction.followUp("No players joined!");

            const game = new PokemonGame(interaction.channel, Array.from(users.values()), interaction.options.getString("prize"));
            game.start();
        });
    }
};
    });
          }
              
