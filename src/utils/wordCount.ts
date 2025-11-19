import { App, TFile } from 'obsidian';

/**
 * Gets the word count for the active file.
 * Reads content directly from the file to ensure consistency.
 */
export async function getWordCount(app: App, file: TFile): Promise<number> {
	const content = await app.vault.read(file);
	return countWords(content);
}


/**
 * Counts words in markdown text, excluding code blocks and formatting.
 * Note: Does NOT strip frontmatter, as --- is commonly used in document body.
 */
export function countWords(text: string): number {
	let content = text;

	// Remove code blocks
	content = content.replace(/```[\s\S]*?```/g, '');

	// Remove inline code
	content = content.replace(/`[^`]*`/g, '');

	// Remove HTML tags
	content = content.replace(/<[^>]*>/g, '');

	// Remove images (do this before links to avoid issues)
	content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');

	// Remove markdown links but keep the text
	content = content.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

	// Remove horizontal rules
	content = content.replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '');

	// Remove list markers (-, *, +, numbered lists)
	content = content.replace(/^\s*[-*+]\s+/gm, '');
	content = content.replace(/^\s*\d+\.\s+/gm, '');

	// Remove blockquote markers
	content = content.replace(/^\s*>\s?/gm, '');

	// Remove markdown formatting characters
	content = content.replace(/[*_~`#]/g, '');

	// Split by whitespace and filter out empty strings
	const words = content.trim().split(/\s+/).filter(word => word.length > 0);

	return words.length;
}
