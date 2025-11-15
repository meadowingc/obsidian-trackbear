import { App, TFile } from 'obsidian';
import { TrackBearFrontmatter, TRACKBEAR_SCHEMA_VERSION } from '../api/types';

/**
 * Gets the TrackBear configuration from a file's frontmatter
 */
export async function getTrackBearFromFrontmatter(
	app: App,
	file: TFile
): Promise<TrackBearFrontmatter | null> {
	const metadata = app.metadataCache.getFileCache(file);
	if (!metadata?.frontmatter?.trackbear) {
		return null;
	}

	const tb = metadata.frontmatter.trackbear;

	// Validate required fields
	if (typeof tb.projectId !== 'number' ||
		typeof tb.fileId !== 'string') {
		return null;
	}

	return {
		version: tb.version || 1,
		projectId: tb.projectId,
		fileId: tb.fileId,
		lastWords: tb.lastWords,
		lastDate: tb.lastDate,
	};
}

/**
 * Sets the TrackBear configuration in a file's frontmatter
 */
export async function setTrackBearInFrontmatter(
	app: App,
	file: TFile,
	trackbearData: TrackBearFrontmatter
): Promise<void> {
	await app.fileManager.processFrontMatter(file, (frontmatter) => {
		frontmatter.trackbear = {
			version: TRACKBEAR_SCHEMA_VERSION,
			projectId: trackbearData.projectId,
			fileId: trackbearData.fileId,
			...(trackbearData.lastWords !== undefined && { lastWords: trackbearData.lastWords }),
			...(trackbearData.lastDate !== undefined && { lastDate: trackbearData.lastDate }),
		};
	});
}

/**
 * Generates a unique file ID (UUID v4)
 */
export function generateFileId(): string {
	return crypto.randomUUID();
}
