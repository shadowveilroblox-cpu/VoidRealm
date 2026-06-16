export class PokemonGame {
    constructor(channel, participants, prize) {
        this.channel = channel;
        this.players = participants;
        this.prize = prize;
        this.currentIndex = 0;
        this.guessTime = 10000; // 10 seconds
        this.pokemonList = [
            { name: "Pikachu", emojis: "⚡+🐱" }, { name: "Squirtle", emojis: "💧+🐢" },
            { name: "Charmander", emojis: "🔥+🦎" }, { name: "Bulbasaur", emojis: "🌿+🐸" },
            { name: "Jigglypuff", emojis: "🎤+🎈" }, { name: "Meowth", emojis: "🐱+💰" },
            { name: "Psyduck", emojis: "🦆+🧠" }, { name: "Machop", emojis: "💪+🥋" },
            { name: "Gengar", emojis: "👻+😈" }, { name: "Eevee", emojis: "🦊+🧬" },
            { name: "Snorlax", emojis: "😴+🍔" }, { name: "Mewtwo", emojis: "🧬+🧠" },
            { name: "Magikarp", emojis: "🐟+👑" }, { name: "Ditto", emojis: "🟣+🎭" },
            { name: "Chikorita", emojis: "🌿+🍂" }, { name: "Cyndaquil", emojis: "🔥+🦔" },
            { name: "Totodile", emojis: "💧+🐊" }, { name: "Pichu", emojis: "⚡+👶" },
            { name: "Togepi", emojis: "🥚+✨" }, { name: "Mareep", emojis: "⚡+🐑" },
            { name: "Wooper", emojis: "💧+🤠" }, { name: "Umbreon", emojis: "🌑+🦊" },
            { name: "Larvitar", emojis: "🦖+⛰️" }, { name: "Treecko", emojis: "🌿+🦎" },
            { name: "Torchic", emojis: "🔥+🐣" }, { name: "Mudkip", emojis: "💧+🐟" },
            { name: "Ralts", emojis: "🧚+🧠" }, { name: "Slakoth", emojis: "😴+🦥" },
            { name: "Absol", emojis: "🌑+🔮" }, { name: "Bagon", emojis: "🐲+🥚" },
            { name: "Rayquaza", emojis: "🐉+☁️" }, { name: "Lucario", emojis: "🥊+🐕" }
        ];
    }

    async start() {
        await this.channel.send(`🎮 **Game Started!** Winner Prize: ${this.prize}`);
        this.playTurn();
    }

    async playTurn() {
        if (this.currentIndex >= this.players.length) {
            return this.channel.send(`🏆 **Game Over!** Everyone has finished. The prize goes to the top guesser!`);
        }

        const player = this.players[this.currentIndex];
        const pkm = this.pokemonList[Math.floor(Math.random() * this.pokemonList.length)];

        await this.channel.send(`<@${player.id}>, guess this Pokémon: **${pkm.emojis}**`);

        const collector = this.channel.createMessageCollector({ time: this.guessTime });

        collector.on('collect', async (m) => {
            if (m.author.id === player.id) {
                if (m.content.toLowerCase() === pkm.name.toLowerCase()) {
                    await m.reply("✅ Correct!");
                    this.currentIndex++;
                    collector.stop();
                } else {
                    await m.reply("❌ Incorrect!");
                }
            } else {
                await m.delete().catch(() => {});
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') this.channel.send(`⏰ Time's up! The answer was **${pkm.name}**.`);
            this.currentIndex++;
            this.playTurn();
        });
    }
}
