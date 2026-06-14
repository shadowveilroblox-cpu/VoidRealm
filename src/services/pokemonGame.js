export async function runRound(channel, players, pokemonList) {
    let currentPlayerIndex = 0;

    for (let player of players) {
        // 1. Pick a random Pokemon
        const target = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        
        // 2. Alert the specific player
        await channel.send(`<@${player.id}>, guess this Pokémon: ${target.emojis}`);

        // 3. Collect only from this specific player, delete others
        const filter = (m) => true; // Catch everything
        const collector = channel.createMessageCollector({ filter, time: 5000 });

        let guessedCorrectly = false;

        collector.on('collect', async (m) => {
            if (m.author.id === player.id) {
                if (m.content.toLowerCase() === target.name.toLowerCase()) {
                    guessedCorrectly = true;
                    await m.reply("Correct! ✅");
                    collector.stop();
                } else {
                    await m.reply("Incorrect! ❌");
                }
            } else {
                // Delete answers from anyone else
                await m.delete().catch(() => {});
            }
        });

        // 4. Handle End of Round
        await new Promise(resolve => collector.on('end', resolve));
        if (!guessedCorrectly) await channel.send("Time's up!");
    }
            }
              
