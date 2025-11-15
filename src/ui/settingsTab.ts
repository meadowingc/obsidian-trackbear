import { App, PluginSettingTab, Setting } from 'obsidian';
import TrackBearPlugin from '../main';

export class TrackBearSettingTab extends PluginSettingTab {
	plugin: TrackBearPlugin;

	constructor(app: App, plugin: TrackBearPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'TrackBear Settings' });

		// API Key
		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Your TrackBear API key. Get it from the TrackBear website.')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}))
			.then(setting => {
				setting.controlEl.querySelector('input')?.setAttribute('type', 'password');
			});

		// Journal Tracking Section
		containerEl.createEl('h3', { text: 'Journal/Daily Notes Tracking' });

		new Setting(containerEl)
			.setName('Enable Journal Tracking')
			.setDesc('Track journal/daily notes automatically')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableJournalTracking)
				.onChange(async (value) => {
					this.plugin.settings.enableJournalTracking = value;
					await this.plugin.saveSettings();
					this.display(); // Refresh to show/hide related settings
				}));

		if (this.plugin.settings.enableJournalTracking) {
			new Setting(containerEl)
				.setName('Morning Pages Project ID')
				.setDesc('The TrackBear project ID for your journal/morning pages')
				.addText(text => text
					.setPlaceholder('e.g., 123')
					.setValue(this.plugin.settings.journalProjectId?.toString() || '')
					.onChange(async (value) => {
						const id = parseInt(value, 10);
						this.plugin.settings.journalProjectId = isNaN(id) ? null : id;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Journal Folder Path')
				.setDesc('Path to your journal notes folder (e.g., "Journal")')
				.addText(text => text
					.setPlaceholder('Journal')
					.setValue(this.plugin.settings.journalFolderPath)
					.onChange(async (value) => {
						this.plugin.settings.journalFolderPath = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Journal Date Format')
				.setDesc('Date format in your journal filenames. Supported: YYYY, MM, DD (e.g., "YYYY-MM-DD" for "2024-01-15.md")')
				.addText(text => text
					.setPlaceholder('YYYY-MM-DD')
					.setValue(this.plugin.settings.journalDateFormat)
					.onChange(async (value) => {
						this.plugin.settings.journalDateFormat = value;
						await this.plugin.saveSettings();
					}));
		}
	}
}
