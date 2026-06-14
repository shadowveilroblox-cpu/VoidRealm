import { Collection } from 'discord.js';

export class PokemonGame {
    constructor(channel, participants, prize) {
        this.channel = channel;
        this.players = participants; // Array of GuildMember
        this.prize = prize;
        this.currentIndex = 0;
        this.pokemonList = [
            { name: "Pikachu", emojis: "⚡+🐱" },
            { name: "Squirtle", emojis: "💧+🐢" },
            { name: "Charmander", emojis: "🔥+🦎" }
            { name: "Dragon Canelloni", emojis: "🎍+🐉" }
        ];
    }

    async start() {
        await this.channel.send(`🎮 **Game Started!** Prize: ${this.prize}`);
        this.playTurn();
    }

    async playTurn() {
        if (this.currentIndex >= this.players.length) {
            return this.channel.send("🏆 **Game Over!** Thanks for playing.");
        }

        const player = this.players[this.currentIndex];
        const pokemon = this.pokemonList[Math.floor(Math.random() * this.pokemonList.length)];

        await this.channel.send(`<@${player.id}>, guess this Pokémon: ${pokemon.emojis}`);

        const filter = (m) => true; // Listen to everyone to catch cheaters
        const collector = this.channel.createMessageCollector({ filter, time: 10000 });

        collector.on('collect', async (m) => {
            if (m.author.id === player.id) {
                if (m.content.toLowerCase() === pokemon.name.toLowerCase()) {
                    await m.reply("Correct! ✅");
                    this.currentIndex++;
                    collector.stop();
                } else {
                    await m.reply("Incorrect! ❌");
                }
            } else {
                // ANTI-CHEAT: Delete helper messages
                await m.delete().catch(() => {});
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                this.channel.send(`⏰ Time's up! The answer was **${pokemon.name}**.`);
                this.currentIndex++;
                this.playTurn();
            } else {
                this.playTurn();
            }
        });
    }
}
