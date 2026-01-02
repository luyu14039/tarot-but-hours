const fs = require('fs');
const path = require('path');

const hoursDesPath = path.join(__dirname, '../hours_des');
const outputPath = path.join(__dirname, 'src/data/wiki_content.ts');

// Manual mapping for mismatches (File Name -> Hour Name in hours.ts)
const nameMapping = {
    '丝毧': '丝绒',
    // Add others if found
};

try {
    if (!fs.existsSync(hoursDesPath)) {
        console.error(`Directory not found: ${hoursDesPath}`);
        process.exit(1);
    }

    const files = fs.readdirSync(hoursDesPath);
    const wikiData = {};

    files.forEach(file => {
        if (file.endsWith('.md')) {
            let name = file.replace('.md', '');
            // Apply mapping if exists
            if (nameMapping[name]) {
                name = nameMapping[name];
            }
            
            let content = fs.readFileSync(path.join(hoursDesPath, file), 'utf-8');

            // --- Content Cleaning ---
            
            // 1. Remove the metadata table at the top (lines starting with |)
            content = content.replace(/^\|.*$/gm, '');

            // 2. Remove specific sections we don't need for the LLM context
            // Sections to remove: "现实原型", "杂项", "司辰画廊"
            // We use a regex that matches "## SectionName" and everything until the next "## " or end of string
            const sectionsToRemove = ['现实原型', '杂项', '司辰画廊'];
            sectionsToRemove.forEach(section => {
                const regex = new RegExp(`## ${section}[\\s\\S]*?(?=## |$)`, 'g');
                content = content.replace(regex, '');
            });

            // 3. Clean up multiple newlines created by removals
            content = content.replace(/\n{3,}/g, '\n\n').trim();

            // ------------------------

            wikiData[name] = content;
        }
    });

    const fileContent = `export const wikiContent: Record<string, string> = ${JSON.stringify(wikiData, null, 2)};`;

    fs.writeFileSync(outputPath, fileContent);
    console.log('Wiki content generated at ' + outputPath);
    console.log(`Processed ${Object.keys(wikiData).length} files.`);

} catch (error) {
    console.error('Error generating wiki content:', error);
    process.exit(1);
}
