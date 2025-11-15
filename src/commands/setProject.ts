import { App, Modal, Notice } from 'obsidian';
import { TrackBearSettings } from '../settings';
import { TrackBearClient } from '../api/trackbear';
import { Project } from '../api/types';
import { setProjectIdInFrontmatter } from '../utils/frontmatter';

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

	// Fetch projects
	const client = new TrackBearClient(settings.apiKey);
	try {
		const projects = await client.listProjects();
		if (projects.length === 0) {
			new Notice('No projects found. Please create a project in TrackBear first.');
			return;
		}

		// Show project picker modal
		new ProjectPickerModal(app, projects, async (selectedProject) => {
			await setProjectIdInFrontmatter(app, activeFile, selectedProject.id);
			new Notice(`Set TrackBear project: ${selectedProject.title}`);
		}).open();
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
