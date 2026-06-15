import { SlashCommandBuilder, PermissionFlagsBits, Events } from 'discord.js';
import { db } from '../../services/database.js'; // Ensure your DB is connected here

// Initialize table if it doesn't exist
db.query(`CREATE TABLE IF NOT EXISTS autoreact_settings (
    channel_id VARCHAR(255) PRIMARY KEY,
    emojis TEXT
)`);

export default {
    data: new SlashCommandBuilder()
        .setName("autoreact")
        .setDescription("Setup auto-reactions for a channel")
        .addChannelOption(o => o.setName("channel").setDescription("Target channel").setRequired(true))
        .addStringOption(o => o.setName("emojis").setDescription("Emojis separated by comma (e.g. 🇼, 🇱)").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    // 1. The Command Logic
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const emojis = interaction.options.getString("emojis").split(',').map(e => e.trim());

        await db.query(
            'INSERT INTO autoreact_settings (channel_id, emojis) VALUES ($1, $2) ON CONFLICT (channel_id) DO UPDATE SET emojis = $2',
            [channel.id, JSON.stringify(emojis)]
        );

        await interaction.reply(`✅ Auto-reactions for ${channel} set to: ${emojis.join(', ')}`);
    },

    // 2. The Listener (This stays inside the file but is registered in your client)
    async handleMessage(message) {
        if (message.author.bot) return;

        const res = await db.query('SELECT emojis FROM autoreact_settings WHERE channel_id = $1', [message.channel.id]);
        if (res.rows.length > 0) {
            const emojis = JSON.parse(res.rows[0].emojis);
            for (const emoji of emojis) {
                await message.react(emoji).catch(() => {});
            }
        }
    }
};
