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
            
            const content = fs.readFileSync(path.join(hoursDesPath, file), 'utf-8');
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
