import { App, TFile } from 'obsidian';

/**
 * Gets the TrackBear project ID from a file's frontmatter
 */
export function getProjectIdFromFrontmatter(content: string): number | null {
	const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
	if (!frontmatterMatch) {
		return null;
	}

	const frontmatter = frontmatterMatch[1];
	const projectIdMatch = frontmatter.match(/trackbear-project-id:\s*(\d+)/);
	if (!projectIdMatch) {
		return null;
	}

	return parseInt(projectIdMatch[1], 10);
}

/**
 * Sets the TrackBear project ID in a file's frontmatter
 */
export async function setProjectIdInFrontmatter(
	app: App,
	file: TFile,
	projectId: number
): Promise<void> {
	const content = await app.vault.read(file);
	const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

	let newContent: string;

	if (frontmatterMatch) {
		// Frontmatter exists, update or add the project ID
		const frontmatter = frontmatterMatch[1];
		const hasProjectId = frontmatter.match(/trackbear-project-id:/);

		if (hasProjectId) {
			// Update existing project ID
			const updatedFrontmatter = frontmatter.replace(
				/trackbear-project-id:\s*\d+/,
				`trackbear-project-id: ${projectId}`
			);
			newContent = content.replace(
				/^---\n[\s\S]*?\n---/,
				`---\n${updatedFrontmatter}\n---`
			);
		} else {
			// Add project ID to existing frontmatter
			const updatedFrontmatter = frontmatter + `\ntrackbear-project-id: ${projectId}`;
			newContent = content.replace(
				/^---\n[\s\S]*?\n---/,
				`---\n${updatedFrontmatter}\n---`
			);
		}
	} else {
		// No frontmatter exists, create it
		newContent = `---\ntrackbear-project-id: ${projectId}\n---\n${content}`;
	}

	await app.vault.modify(file, newContent);
}
