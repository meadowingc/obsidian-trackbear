import { Plugin } from 'obsidian';
import { TrackBearSettings, DEFAULT_SETTINGS } from './settings';
import { TrackBearSettingTab } from './ui/settingsTab';
import { syncCurrentNote } from './commands/sync';
import { setProjectForCurrentNote } from './commands/setProject';

export default class TrackBearPlugin extends Plugin {
	settings: TrackBearSettings;

	async onload() {
		await this.loadSettings();

		// Add sync command
		this.addCommand({
			id: 'trackbear-sync',
			name: 'Sync current note',
			callback: async () => {
				await syncCurrentNote(this.app, this.settings);
			}
		});

		// Add set project command
		this.addCommand({
			id: 'trackbear-set-project',
			name: 'Set TrackBear project',
			callback: async () => {
				await setProjectForCurrentNote(this.app, this.settings);
			}
		});

		// Add settings tab
		this.addSettingTab(new TrackBearSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup if needed
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
