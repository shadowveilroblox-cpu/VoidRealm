// A simple map to store active AI channels
export const aiChannels = new Map();

export const activateAI = (channelId) => aiChannels.set(channelId, true);
export const deactivateAI = (channelId) => aiChannels.delete(channelId);
export const isAIEnabled = (channelId) => aiChannels.has(channelId);
