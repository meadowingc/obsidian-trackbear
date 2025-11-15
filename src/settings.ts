export interface TrackBearSettings {
	apiKey: string;

	// Journal/Daily Notes Settings
	enableJournalTracking: boolean;
	journalProjectId: number | null;
	journalFolderPath: string;
	journalDateFormat: string;
}

export const DEFAULT_SETTINGS: TrackBearSettings = {
	apiKey: '',
	enableJournalTracking: true,
	journalProjectId: null,
	journalFolderPath: 'Journal',
	journalDateFormat: 'YYYY-MM-DD'
};
