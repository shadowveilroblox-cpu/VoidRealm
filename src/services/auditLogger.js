import { AuditLogEvent } from 'discord.js';
import { db } from './database.js';

export async function logEvent(guild, eventType, details) {
    const res = await db.query('SELECT audit_channel_id FROM guild_settings WHERE guild_id = $1', [guild.id]);
    if (!res.rows[0]?.audit_channel_id) return;

    const channel = guild.channels.cache.get(res.rows[0].audit_channel_id);
    if (!channel) return;

    // Check bot perms to read audit logs
    if (!guild.members.me.permissions.has('ViewAuditLog')) {
        return channel.send("I have no perms to see the audit logs ❌");
    }

    const embed = {
        title: `📜 Audit Log: ${eventType}`,
        description: details,
        color: 0x2b2d31,
        timestamp: new Date()
    };
    
    channel.send({ embeds: [embed] }).catch(() => {});
                                            }
