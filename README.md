# TrackBear for Obsidian

Connect your Obsidian writing to [TrackBear](https://trackbear.app) and track your progress without leaving your vault. Great for morning pages, novels, blog posts, or any writing project you want to keep tabs on.

## What it does

The plugin handles two types of writing:

**Daily journaling** - If you do morning pages or daily notes, it can automatically sync your word counts to a dedicated TrackBear project. Just write in your journal folder and sync when you're done.

**Writing projects** - Working on a novel, essay, or blog post? Link any note (or group of notes) to a TrackBear project and track your progress over time.

The cool part: it tracks *changes*, not just totals. Write 500 more words? It adds 500. Delete a paragraph? It subtracts those words. Rename a file? It still knows what project it belongs to. This means you can track a single long document or split your novel across multiple chapter files - either way works.

## Installation

Easiest way: Install through [BRAT](https://github.com/TfTHacker/obsidian42-brat).

Or manually:
1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/meadowingc/obsidian-trackbear/releases)
2. Create folder: `<vault>/.obsidian/plugins/obsidian-trackbear/`
3. Drop the files in there
4. Restart Obsidian
5. Enable the plugin in Settings → Community plugins

## Setup

You'll need your TrackBear API key first. Grab it from [trackbear.app](https://trackbear.app), then:

1. Open Obsidian Settings → TrackBear
2. Paste in your API key
3. That's it for basic use!

**Optional - For journal tracking:**
- Add your Morning Pages project ID from TrackBear
- Tell the plugin where your journal notes live (e.g., "Journal")
- Set your date format (how dates appear in filenames, like "YYYY-MM-DD")

## How to use it

### Tracking a writing project

First time with a note:
1. Open the note
2. Run command: **TrackBear: Set TrackBear Project**
3. Pick your project from the list

Then whenever you write:
1. Run command: **TrackBear: Sync Current Note**
2. Done - the change gets added to your project

**Example:** You're writing a novel across chapter files. First time you sync chapter-1.md (1000 words), TrackBear shows 1000 total. Next day you sync chapter-2.md (800 words), now it shows 1800. Then you go back and edit chapter-1 to 1100 words - it only adds the 100 word difference. Your project total stays accurate.

### Tracking daily notes

If you've set up journal tracking:
1. Open today's journal note
2. Run command: **TrackBear: Sync Current Note**
3. It figures out the date from your filename and updates that day's count

## Under the hood

The plugin stores a bit of info in your note's frontmatter to make the tracking work:

```yaml
---
trackbear:
  projectId: 123
  fileId: abc-123-def
  lastWords: 1500
  lastDate: 2025-11-15
---
```

This tracks which project the note belongs to, gives it a unique ID (survives renames), and remembers the last word count so it can calculate changes. Your actual note content never gets sent anywhere - only word counts.

## Common issues

**"Please set your TrackBear API key"**  
Add your API key in Settings → TrackBear

**"No TrackBear project set"**  
Run "Set TrackBear Project" command first (journal notes use the Morning Pages ID from settings instead)

**"Could not parse date from filename"**  
Your journal date format setting needs to match your filename format. If your files are named "2024-01-15.md", use format "YYYY-MM-DD"

**Project total seems off**  
The first sync adds all existing words. After that, only changes get added/subtracted. If something looks wrong, check the TrackBear web app to see the individual tallies.

## Privacy stuff

Your API key stays local in Obsidian. The plugin only sends word counts and metadata to TrackBear - never your actual writing. It's open source, so you can check the code yourself.

## Support

- Plugin issues: [GitHub Issues](https://github.com/meadowingc/obsidian-trackbear/issues)
- TrackBear API docs: https://help.trackbear.app/api/

## License

MIT
