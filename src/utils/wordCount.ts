import { App, TFile, MarkdownView, Notice } from 'obsidian';

/**
 * Gets the word count for the active file.
 * Requires the file to be open in an editor.
 */
export function getWordCount(app: App, file: TFile): number {
	// Get the active markdown view
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);

	if (!activeView || activeView.file?.path !== file.path || !activeView.editor) {
		new Notice('Please open the file in an editor to count words');
		throw new Error('File must be open in an editor to count words');
	}

	// Use the editor's content
	const content = activeView.editor.getValue();
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
