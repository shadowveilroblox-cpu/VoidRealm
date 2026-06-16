export const CodeInterpreter = {
    async execute(content) {
        // Handle RandomizeService
        if (content.includes("RandomizeService.text")) {
            const matches = content.match(/text(\d+) = (\d+)%/g);
            if (!matches) return "Syntax Error in RandomizeService";
            
            const roll = Math.random() * 100;
            let current = 0;
            for (const m of matches) {
                const [_, id, pct] = m.match(/text(\d+) = (\d+)%/);
                current += parseInt(pct);
                if (roll <= current) return `Randomized Output: Option ${id}`;
            }
        }
        return "Script executed with no output.";
    }
};
                  
