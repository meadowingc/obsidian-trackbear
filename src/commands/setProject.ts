import { App, Modal, Notice } from 'obsidian';
import { TrackBearSettings } from '../settings';
import { TrackBearClient } from '../api/trackbear';
import { Project, TRACKBEAR_SCHEMA_VERSION, TrackBearFrontmatter } from '../api/types';
import { setTrackBearInFrontmatter, generateFileId, getTrackBearFromFrontmatter } from '../utils/frontmatter';

export async function setProjectForCurrentNote(
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

	// Don't allow setting project for journal notes
	if (settings.enableJournalTracking &&
		activeFile.path.startsWith(settings.journalFolderPath)) {
		new Notice('Journal notes use the Morning Pages project from settings');
		return;
	}

	// Check if project is already set
	const existingTrackBear = await getTrackBearFromFrontmatter(app, activeFile);

	// Fetch projects
	const client = new TrackBearClient(settings.apiKey);
	try {
		const projects = await client.listProjects();
		if (projects.length === 0) {
			new Notice('No projects found. Please create a project in TrackBear first.');
			return;
		}

		// If project already exists, show confirmation dialog first
		if (existingTrackBear) {
			const currentProject = projects.find(p => p.id === existingTrackBear.projectId);
			const currentProjectName = currentProject?.title || 'Unknown Project';

			new ConfirmProjectChangeModal(app, currentProjectName, () => {
				// User confirmed - show project picker
				new ProjectPickerModal(app, projects, async (selectedProject) => {
					const trackbearData: TrackBearFrontmatter = {
						version: TRACKBEAR_SCHEMA_VERSION,
						projectId: selectedProject.id,
						fileId: existingTrackBear.fileId, // Keep existing fileId
						lastWords: existingTrackBear.lastWords,
						lastDate: existingTrackBear.lastDate,
					};
					await setTrackBearInFrontmatter(app, activeFile, trackbearData);
					new Notice(`Changed TrackBear project to: ${selectedProject.title}`);
				}).open();
			}).open();
		} else {
			// No existing project - show project picker directly
			new ProjectPickerModal(app, projects, async (selectedProject) => {
				const trackbearData: TrackBearFrontmatter = {
					version: TRACKBEAR_SCHEMA_VERSION,
					projectId: selectedProject.id,
					fileId: generateFileId(),
				};
				await setTrackBearInFrontmatter(app, activeFile, trackbearData);
				new Notice(`Set TrackBear project: ${selectedProject.title}`);
			}).open();
		}
	} catch (error) {
		new Notice(`Failed to fetch projects: ${error.message}`);
		console.error('TrackBear fetch projects error:', error);
	}
}

class ProjectPickerModal extends Modal {
	projects: Project[];
	onSelect: (project: Project) => void;

	constructor(app: App, projects: Project[], onSelect: (project: Project) => void) {
		super(app);
		this.projects = projects;
		this.onSelect = onSelect;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Select TrackBear Project' });

		const projectList = contentEl.createDiv({ cls: 'trackbear-project-list' });

		this.projects.forEach(project => {
			const projectItem = projectList.createDiv({ cls: 'trackbear-project-item' });
			projectItem.createEl('div', {
				text: project.title,
				cls: 'trackbear-project-title'
			});

			if (project.description) {
				projectItem.createEl('div', {
					text: project.description,
					cls: 'trackbear-project-description'
				});
			}

			projectItem.addEventListener('click', () => {
				this.onSelect(project);
				this.close();
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class ConfirmProjectChangeModal extends Modal {
	currentProjectName: string;
	onConfirm: () => void;

	constructor(app: App, currentProjectName: string, onConfirm: () => void) {
		super(app);
		this.currentProjectName = currentProjectName;
		this.onConfirm = onConfirm;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Change TrackBear Project?' });

		contentEl.createEl('p', {
			text: `This note is already assigned to project: ${this.currentProjectName}`
		});

		contentEl.createEl('p', {
			text: 'Changing the project will preserve your word count tracking data, but the note will be associated with a different project.'
		});

		const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

		const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelButton.addEventListener('click', () => {
			this.close();
		});

		const confirmButton = buttonContainer.createEl('button', {
			text: 'Change Project',
			cls: 'mod-cta'
		});
		confirmButton.addEventListener('click', () => {
			this.close();
			this.onConfirm();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
