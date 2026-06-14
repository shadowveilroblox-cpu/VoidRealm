// Inside your command execution:
const participants = Array.from(participantsMap.values());

const pokemonList = [
    { name: "Pikachu", emojis: "⚡+🐱" },
    { name: "Squirtle", emojis: "💧+🐢" },
    { name: "Charmander", emojis: "🔥+🦎" }
];

await interaction.followUp("Game Started! Taking turns...");
await runRound(interaction.channel, participants, pokemonList);
await interaction.followUp("Game Over!");
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
              
