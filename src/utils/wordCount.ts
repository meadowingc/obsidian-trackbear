/**
 * Counts words in the given text, excluding frontmatter and code blocks
 */
export function countWords(text: string): number {
	// Remove YAML frontmatter
	let content = text.replace(/^---\n[\s\S]*?\n---\n/m, '');

	// Remove code blocks
	content = content.replace(/```[\s\S]*?```/g, '');

	// Remove inline code
	content = content.replace(/`[^`]*`/g, '');

	// Remove HTML tags
	content = content.replace(/<[^>]*>/g, '');

	// Remove markdown links but keep the text
	content = content.replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1');

	// Remove images
	content = content.replace(/!\[([^\]]*)\]\([^\)]*\)/g, '');

	// Remove markdown formatting characters
	content = content.replace(/[*_~`#]/g, '');

	// Split by whitespace and filter out empty strings
	const words = content.trim().split(/\s+/).filter(word => word.length > 0);

	return words.length;
}
