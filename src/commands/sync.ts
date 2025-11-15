import { App, Notice, TFile } from 'obsidian';
import { TrackBearSettings } from '../settings';
import { TrackBearClient } from '../api/trackbear';
import { getWordCount } from '../utils/wordCount';
import { parseDateFromFilename, getTodayDate } from '../utils/dateUtils';
import { getProjectIdFromFrontmatter } from '../utils/frontmatter';

export async function syncCurrentNote(
	app: App,
	settings: TrackBearSettings
): Promise<void> {
	// Validate API key
	if (!settings.apiKey) {
		new Notice('Please set your TrackBear API key in settings');
		return;
	}

	// Get active file
	const activeFile = app.workspace.getActiveFile();
	if (!activeFile) {
		new Notice('No active file');
		return;
	}

	// Get file content and count words
	const content = await app.vault.read(activeFile);
	const wordCount = getWordCount(app, activeFile);

	// Determine if it's a journal note or story note
	const isJournalNote = settings.enableJournalTracking &&
		activeFile.path.startsWith(settings.journalFolderPath);

	const client = new TrackBearClient(settings.apiKey);

	try {
		if (isJournalNote) {
			await syncJournalNote(client, settings, activeFile, wordCount);
		} else {
			await syncStoryNote(client, activeFile, content, wordCount);
		}
	} catch (error) {
		new Notice(`Failed to sync: ${error.message}`);
		console.error('TrackBear sync error:', error);
	}
}

async function syncJournalNote(
	client: TrackBearClient,
	settings: TrackBearSettings,
	file: TFile,
	wordCount: number
): Promise<void> {
	// Validate journal project ID
	if (!settings.journalProjectId) {
		new Notice('Please set your Morning Pages project ID in settings');
		return;
	}

	// Parse date from filename
	const date = parseDateFromFilename(file.name, settings.journalDateFormat);
	if (!date) {
		new Notice(`Could not parse date from filename using format: ${settings.journalDateFormat}`);
		return;
	}

	// Check if a tally already exists for this date
	const existingTallies = await client.listTallies(settings.journalProjectId, date);
	const existingTally = existingTallies.find(t => t.date === date && t.measure === 'word');

	if (existingTally) {
		// Update existing tally - set the absolute count for this date
		await client.updateTally(existingTally.id, {
			measure: 'word',
			count: wordCount,
			workId: settings.journalProjectId,
			setTotal: false,
		});
		new Notice(`✓ Updated journal: ${wordCount.toLocaleString()} words`);
	} else {
		// Create new tally - add to cumulative total
		await client.createTally({
			date,
			measure: 'word',
			count: wordCount,
			note: '',
			workId: settings.journalProjectId,
			setTotal: false,
			tags: [],
		});
		new Notice(`✓ Synced journal: ${wordCount.toLocaleString()} words`);
	}
}

async function syncStoryNote(
	client: TrackBearClient,
	file: TFile,
	content: string,
	wordCount: number
): Promise<void> {
	// Get project ID from frontmatter
	const projectId = getProjectIdFromFrontmatter(content);
	if (!projectId) {
		new Notice('No TrackBear project set. Use "Set TrackBear Project" command first');
		return;
	}

	// Create tally with today's date
	const date = getTodayDate();
	await client.createTally({
		date,
		measure: 'word',
		count: wordCount,
		note: '',
		workId: projectId,
		setTotal: true,
		tags: [],
	});

	new Notice(`✓ Synced ${file.basename}: ${wordCount.toLocaleString()} words`);
}
