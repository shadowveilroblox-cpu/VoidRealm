// This is a helper function to get the log channel ID
export async function getAuditLogChannel(guildId) {
    const res = await db.query('SELECT audit_channel_id FROM guild_settings WHERE guild_id = $1', [guildId]);
    return res.rows[0]?.audit_channel_id;
}
