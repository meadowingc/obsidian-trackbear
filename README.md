# Unofficial TrackBear for Obsidian

Track your writing progress with [TrackBear](https://trackbear.app) directly from Obsidian.

## Features

- **Sync Journal Notes**: Automatically track your daily writing in a dedicated morning pages/journal project
- **Sync Project Notes**: Track word counts across single or multiple files for any project
- **Smart Delta Tracking**: Accurately tracks changes, additions, and deletions
- **File Identification**: Each file gets a unique ID that survives renames
- **Flexible Configuration**: Customize journal folder paths and date formats

## Installation

The recommended way to install this plugin is through [BRAT](https://github.com/TfTHacker/obsidian42-brat).

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create a folder in your vault: `<vault>/.obsidian/plugins/obsidian-trackbear/`
3. Copy the downloaded files into this folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community plugins

## Setup

1. Get your TrackBear API key from the [TrackBear website](https://trackbear.app)
2. Open Obsidian Settings → TrackBear
3. Enter your API key
4. (Optional) Configure journal tracking settings:
   - **Morning Pages Project ID**: The project ID from TrackBear for your daily journal entries
   - **Journal Folder Path**: Path to your journal notes (e.g., "Journal")
   - **Journal Date Format**: How dates appear in your journal filenames (e.g., "YYYY-MM-DD")

## Usage

### Syncing Project Notes

1. Open a note you want to track
2. First time: Run **TrackBear: Set TrackBear Project** to link the note to a TrackBear project
3. Run **TrackBear: Sync Current Note** to sync word count
4. The plugin tracks changes intelligently:
   - First sync: Adds all words to project
   - Subsequent syncs: Only adds/subtracts the difference (delta)
   - Works for both single-file and multi-file projects!

**Example - Single File Project:**
```
Day 1: File has 1000 words → Adds 1000 words → Project: 1000
Day 2: File has 1500 words → Adds 500 words → Project: 1500
Day 3: File has 1450 words → Subtracts 50 words → Project: 1450
```

**Example - Multi-File Project:**
```
Day 1: chapter-1.md (500 words) → Adds 500 → Project: 500
Day 1: chapter-2.md (300 words) → Adds 300 → Project: 800
Day 2: Edit chapter-1.md (550 words) → Adds 50 → Project: 850
```

### Syncing Journal Notes

1. Open a journal note in your configured journal folder
2. Run **TrackBear: Sync Current Note**
3. The plugin will:
   - Parse the date from the filename
   - Count words in the note
   - Update or create a tally in your Morning Pages project

## How It Works

### Project Notes (Delta Tracking)

The plugin uses intelligent delta tracking:
1. Stores the file's last word count in frontmatter
2. Calculates the difference (delta) on each sync
3. Creates a tally with only the change
4. TrackBear accumulates all tallies to show project progress

This means:
- ✅ Works perfectly for single-file projects (novels, essays)
- ✅ Works perfectly for multi-file projects (blog posts, multi-chapter stories)
- ✅ Tracks deletions correctly (negative deltas)
- ✅ Survives file renames (uses unique file IDs)

### Journal Notes

For notes in your journal folder:
1. Parses the date from the filename
2. Counts words (excluding frontmatter, code blocks, etc.)
3. Updates existing tally for that date or creates a new one

## Frontmatter

The plugin stores tracking information in your notes' frontmatter:

```yaml
---
trackbear:
  version: 1
  projectId: 123
  fileId: 550e8400-e29b-41d4-a716-446655440000
  lastWords: 1500
  lastDate: 2025-11-15
---
```

- **version**: Schema version (for future compatibility)
- **projectId**: Your TrackBear project ID
- **fileId**: Unique identifier for this file (survives renames)
- **lastWords**: Word count from last sync (used to calculate delta)
- **lastDate**: Date of last sync

## Settings

### API Key
Your TrackBear API key (required)

### Enable Journal Tracking
Toggle to enable/disable automatic journal note detection

### Morning Pages Project ID
The numeric project ID from TrackBear for your journal entries. You can find this in the TrackBear web app.

### Journal Folder Path
The folder containing your journal notes (e.g., "Journal" or "Daily Notes")

### Journal Date Format
How dates appear in your journal filenames. Supported tokens:
- `YYYY` - 4-digit year
- `MM` - 2-digit month
- `DD` - 2-digit day

Examples:
- `YYYY-MM-DD` matches "2024-01-15.md"
- `DD.MM.YYYY` matches "15.01.2024.md"
- `YYYY_MM_DD` matches "2024_01_15.md"

## Privacy & Security

- Your API key is stored locally in Obsidian
- All API requests go directly to TrackBear's servers
- Your actual note content is never sent to TrackBear or any third party
- Only word counts and file metadata are transmitted
- The plugin is open source and can be audited

## Troubleshooting

**"Please set your TrackBear API key in settings"**
- Open Settings → TrackBear and enter your API key

**"Could not parse date from filename"**
- Check that your journal date format setting matches your filename format
- Ensure your filenames contain a complete date (year, month, day)

**"No TrackBear project set"**
- Run the "Set TrackBear Project" command first for project notes
- Journal notes don't need this - they use the Morning Pages project ID from settings

**"Please set your Morning Pages project ID in settings"**
- Enter the numeric project ID from TrackBear in the settings
- You can find this in the TrackBear web app URL when viewing the project

**Project total seems wrong**
- The plugin uses delta tracking, so it accurately reflects changes
- If you imported existing content, the first sync will add all words
- Subsequent syncs only add/subtract changes

## Support

- For TrackBear API documentation: https://help.trackbear.app/api/
- For plugin issues: [GitHub Issues](https://github.com/meadowingc/obsidian-trackbear/issues)

## License

MIT
