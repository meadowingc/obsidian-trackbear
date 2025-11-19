import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import TrackBearPlugin from '../main';
import { TrackBearClient } from '../api/trackbear';
import { Project } from '../api/types';

export class TrackBearSettingTab extends PluginSettingTab {
	plugin: TrackBearPlugin;
	private projects: Project[] = [];
	private projectsLoading = false;
	private projectsError: string | null = null;

	constructor(app: App, plugin: TrackBearPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private async loadProjects(): Promise<void> {
		if (!this.plugin.settings.apiKey) {
			this.projectsError = 'API key not configured';
			return;
		}

		this.projectsLoading = true;
		this.projectsError = null;

		try {
			const client = new TrackBearClient(this.plugin.settings.apiKey);
			this.projects = await client.listProjects();
		} catch (error) {
			console.error('Failed to load projects:', error);
			this.projectsError = error.message || 'Failed to load projects';
			this.projects = [];
		} finally {
			this.projectsLoading = false;
		}
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// API Key
		new Setting(containerEl)
			.setName('API key')
			.setDesc('Your TrackBear API key. Get it from the TrackBear website.')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange((value) => {
					this.plugin.settings.apiKey = value;
					void this.plugin.saveSettings().then(() => {
						// Reload projects when API key changes
						return this.loadProjects();
					}).then(() => {
						this.display(); // Refresh display
					});
				}))
			.then(setting => {
				setting.controlEl.querySelector('input')?.setAttribute('type', 'password');
			});

		// Journal Tracking Section
		new Setting(containerEl)
			.setName('Journal/daily notes')
			.setHeading();

		new Setting(containerEl)
			.setName('Enable journal tracking')
			.setDesc('Track journal/daily notes automatically')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableJournalTracking)
				.onChange((value) => {
					this.plugin.settings.enableJournalTracking = value;
					void this.plugin.saveSettings().then(() => {
						this.display(); // Refresh to show/hide related settings
					});
				})); if (this.plugin.settings.enableJournalTracking) {
					// Load projects if not already loaded
					if (this.projects.length === 0 && !this.projectsLoading && !this.projectsError) {
						void this.loadProjects();
					}

					// Project selection
					const projectSetting = new Setting(containerEl)
						.setName('Morning pages project')
						.setDesc('Select the TrackBear project for your journal/morning pages');

					if (this.projectsLoading) {
						projectSetting.setDesc('Loading projects...');
						projectSetting.addButton(button => button
							.setButtonText('Loading...')
							.setDisabled(true));
					} else if (this.projectsError) {
						projectSetting.setDesc(`Error loading projects: ${this.projectsError}. Check your API key.`);
						projectSetting.addButton(button => button
							.setButtonText('Retry')
							.onClick(() => {
								void this.loadProjects().then(() => {
									this.display();
								});
							}));
					} else if (this.projects.length === 0) {
						projectSetting.setDesc('No projects found. Create a project in TrackBear first.');
						projectSetting.addButton(button => button
							.setButtonText('Refresh')
							.onClick(() => {
								void this.loadProjects().then(() => {
									this.display();
								});
							}));
					} else {
						projectSetting.addDropdown(dropdown => {
							// Add empty option
							dropdown.addOption('', '-- Select a project --');

							// Add all projects
							this.projects.forEach(project => {
								dropdown.addOption(project.id.toString(), project.title);
							});

							// Set current value
							const currentValue = this.plugin.settings.journalProjectId?.toString() || '';
							dropdown.setValue(currentValue);

							dropdown.onChange(async (value) => {
								if (value === '') {
									this.plugin.settings.journalProjectId = null;
								} else {
									this.plugin.settings.journalProjectId = parseInt(value, 10);
								}
								await this.plugin.saveSettings();
							});
						});

						// Add refresh button
						projectSetting.addButton(button => button
							.setButtonText('↻')
							.setTooltip('Refresh project list')
							.onClick(() => {
								new Notice('Refreshing projects...');
								void this.loadProjects().then(() => {
									this.display();
									new Notice('Projects refreshed');
								});
							}));
					}

					new Setting(containerEl)
						.setName('Journal folder path')
						.setDesc('Path to your journal notes folder (e.g., "Journal")')
						.addText(text => text
							.setPlaceholder('Journal')
							.setValue(this.plugin.settings.journalFolderPath)
							.onChange((value) => {
								this.plugin.settings.journalFolderPath = value;
								void this.plugin.saveSettings();
							})); new Setting(containerEl)
								.setName('Journal date format')
								.setDesc('Date format in your journal filenames. Supported: YYYY, MM, DD (e.g., "YYYY-MM-DD" for "2024-01-15.md")')
								.addText(text => text
									.setPlaceholder('YYYY-MM-DD')
									.setValue(this.plugin.settings.journalDateFormat)
									.onChange((value) => {
										this.plugin.settings.journalDateFormat = value;
										void this.plugin.saveSettings();
									}));
				}
	}
}
