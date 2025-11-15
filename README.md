# TrackBear for Obsidian

Track your writing progress with [TrackBear](https://trackbear.app) directly from Obsidian.

## Features

- **Sync Journal Notes**: Automatically track your daily writing in a dedicated morning pages/journal project
- **Sync Notes**: Track individual story/project word counts
- **Smart Updates**: For journal notes, updates existing tallies instead of creating duplicates
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
4. Configure journal tracking settings:
   - **Morning Pages Project ID**: The project ID from TrackBear for your daily journal entries
   - **Journal Folder Path**: Path to your journal notes (e.g., "Journal")
   - **Journal Date Format**: How dates appear in your journal filenames (e.g., "YYYY-MM-DD")

## Usage

### Syncing Journal Notes

1. Open a journal note in your configured journal folder
2. Open the command palette (Ctrl/Cmd + P)
3. Run: **TrackBear: Sync Current Note**
4. The plugin will:
   - Parse the date from the filename
   - Count words in the note
   - Update or create a tally in your Morning Pages project

### Syncing Story Notes

1. Open a story note
2. First time: Run **TrackBear: Set TrackBear Project** to link the note to a TrackBear project
3. Run **TrackBear: Sync Current Note** to sync word count
4. The project association is stored in the note's frontmatter and survives file renames

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

## How It Works

### Journal Notes

For notes in your journal folder:
1. The plugin parses the date from the filename
2. Counts words (excluding frontmatter, code blocks, etc.)
3. Checks if a tally exists for that date
4. Updates existing tally or creates a new one

### Story Notes

For all other notes:
1. Reads the TrackBear project ID from frontmatter (`trackbear-project-id: 123`)
2. Counts words
3. Creates a new tally with today's date using `setTotal: true` (sets the project total to this count)

## Privacy & Security

- Your API key is stored locally in Obsidian
- All API requests go directly to TrackBear's servers
- Your actual note content is never sent to TrackBear or any third party
- The plugin is open source and can be audited

## Troubleshooting

**"Please set your TrackBear API key in settings"**
- Open Settings → TrackBear and enter your API key

**"Could not parse date from filename"**
- Check that your journal date format setting matches your filename format
- Ensure your filenames contain a complete date (year, month, day)

**"No TrackBear project set"**
- Run the "Set TrackBear Project" command first for story notes
- Journal notes don't need this - they use the Morning Pages project ID from settings

**"Please set your Morning Pages project ID in settings"**
- Enter the numeric project ID from TrackBear in the settings
- You can find this in the TrackBear web app URL when viewing the project

## Support

- For TrackBear API documentation: https://help.trackbear.app/api/
- For plugin issues: [GitHub Issues](https://github.com/meadowingc/obsidian-trackbear/issues)

## License

MIT
