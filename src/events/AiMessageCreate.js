import { isAIEnabled } from '../services/aiService.js';

// Inside your messageCreate event's execute function, after the automod check:
if (isAIEnabled(message.channel.id)) {
    // Prevent the bot from talking to itself
    if (message.author.id === client.user.id) return;
    
    // Call your AI API here (e.g., OpenAI/Gemini/Anthropic)
    const response = await fetchAIResponse(message.content); 
    await message.channel.send(response);
    return;
}
