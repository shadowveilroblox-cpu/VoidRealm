import { SlashCommandBuilder, PermissionFlagsBits, ComponentType } from 'discord.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { successEmbed } from '../../utils/embeds.js';

const activeGames = new Map();

export default {
    data: new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("Start a Pokémon guessing game")
        .addStringOption(o => o.setName("prize").setDescription("The winner's prize").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    category: 'Fun',

    async execute(interaction) {
        const prize = interaction.options.getString("prize");
        const msg = await interaction.reply({ 
            content: "Game Starting in 30s! React ✅ to participate.", 
            fetchReply: true 
        });
        
        await msg.react('✅');
        
        // Wait for participants
        setTimeout(async () => {
            const reaction = msg.reactions.cache.get('✅');
            const participants = (await reaction.users.fetch()).filter(u => !u.bot);
            
            if (participants.size < 1) return interaction.followUp("Not enough players!");

            activeGames.set(interaction.channelId, { 
                participants: participants, 
                prize, 
                index: 0 
            });

            await interaction.followUp(`Game started with ${participants.size} players! Prize: ${prize}`);
            runRound(interaction.channel, participants);
        }, 30000);
    }
};

async function runRound(channel, participants) {
    // Logic to pick a random Pokemon emoji or image
    const pokemon = "PIKACHU ⚡"; // Example
    await channel.send(`Who's that Pokemon? You have 5s! (Hint: ${pokemon})`);
    
    // Create collector for 5 seconds
    const filter = m => participants.has(m.author.id);
    const collector = channel.createMessageCollector({ filter, time: 5000, max: 1 });

    collector.on('collect', m => {
        if (m.content.toLowerCase() === "pikachu") {
            channel.send(`Correct! ${m.author.username} wins this round.`);
            // Trigger next round...
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) channel.send("Time's up! No one guessed it.");
    });
          }
              
