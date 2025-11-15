/**
 * Parses a date from a filename based on a format string
 * Supported format tokens: YYYY, MM, DD
 * Examples:
 *   - "YYYY-MM-DD" matches "2024-01-15"
 *   - "DD.MM.YYYY" matches "15.01.2024"
 */
export function parseDateFromFilename(filename: string, format: string): string | null {
	// Remove file extension
	const nameWithoutExt = filename.replace(/\.md$/, '');

	// Build regex pattern by escaping special chars but preserving our tokens
	let pattern = format;

	// Temporarily replace tokens with placeholders
	pattern = pattern.replace(/YYYY/g, '__YEAR__');
	pattern = pattern.replace(/MM/g, '__MONTH__');
	pattern = pattern.replace(/DD/g, '__DAY__');

	// Escape regex special characters
	pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// Replace placeholders with capture groups
	pattern = pattern.replace(/__YEAR__/g, '(\\d{4})');
	pattern = pattern.replace(/__MONTH__/g, '(\\d{2})');
	pattern = pattern.replace(/__DAY__/g, '(\\d{2})');

	const regex = new RegExp(pattern);
	const match = nameWithoutExt.match(regex);

	if (!match) {
		return null;
	}

	// Determine which capture group is which based on format order
	const tokens = [];
	let formatCopy = format;
	while (formatCopy.length > 0) {
		if (formatCopy.startsWith('YYYY')) {
			tokens.push('YYYY');
			formatCopy = formatCopy.slice(4);
		} else if (formatCopy.startsWith('MM')) {
			tokens.push('MM');
			formatCopy = formatCopy.slice(2);
		} else if (formatCopy.startsWith('DD')) {
			tokens.push('DD');
			formatCopy = formatCopy.slice(2);
		} else {
			formatCopy = formatCopy.slice(1);
		}
	}

	let year = '';
	let month = '';
	let day = '';

	tokens.forEach((token, index) => {
		if (token === 'YYYY') year = match[index + 1];
		if (token === 'MM') month = match[index + 1];
		if (token === 'DD') day = match[index + 1];
	});

	if (!year || !month || !day) {
		return null;
	}

	// Return in ISO format (YYYY-MM-DD)
	return `${year}-${month}-${day}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
	const today = new Date();
	const year = today.getFullYear();
	const month = ('0' + (today.getMonth() + 1)).slice(-2);
	const day = ('0' + today.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
}
