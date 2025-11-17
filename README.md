# TrackBear for Obsidian

Connect your Obsidian writing to [TrackBear](https://trackbear.app) and track your progress without leaving your vault. Great for morning pages, blog posts, or any writing project you want to keep tabs on.

Here's an example of me tracking a brand new file, synching it, and then showing how the number of words shows up on the TrackBear dashboard.

<video src="https://github.com/user-attachments/assets/36a50915-d1da-466d-ad5c-7200d630c222" controls width="100%"></video>


## What it does

The plugin handles two types of writing:

**Daily journaling** - If you do morning pages or daily notes, it can automatically sync your word counts to a dedicated TrackBear project. Just write in your journal folder and sync when you're done.

**Writing projects** - Working on a novel, essay, or blog post? Link any note (or group of notes) to a TrackBear project and track your progress over time.


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

1. Open Obsidian Settings → *Unofficial TrackBear Sync*
2. Paste in your API key
3. That's it for basic use!

**Optional - For journal tracking:**
- Select your Morning Pages project in the dropdown (this assumes you've already created such a project on TrackBear)
- Tell the plugin where your journal notes live (e.g., "Journal")
- Set your date format (how dates appear in filenames, like "YYYY-MM-DD" which is the default for Journal pages)

## How to use it

### Tracking a writing project

(Note: the video above shows this scenario, where you have multiple files contributing to a single project)

First time with a note:
1. Open the note
2. Run command: **TrackBear: Set TrackBear Project**
3. Pick your project from the list

This will add a new frontmatter entry to the note that tells the plugin which project it belongs to, what's the id of the file, how many words it had the last time you synced, etc. In general you don't really need to interact or worry about this.

Then whenever you're done with your writing session:
1. Run command: **TrackBear: Sync Current Note**
2. Done - the change gets added to your project in TrackBear

**Example:** You're writing a novel across chapter files. First time you sync chapter-1.md (1000 words), TrackBear shows 1000 total. Next day you sync chapter-2.md (800 words), now it shows 1800. Then you go back and edit chapter-1 to 1100 words - it only adds the 100 word difference. Your project total stays accurate.

### Tracking daily notes

If you've set up journal tracking:
1. Open today's journal note
2. Run command: **TrackBear: Sync Current Note**
3. It figures out the date from your filename and updates that day's count

The plugin can figure out if your note is for daily journaling or another writing project by looking at the folder the note is in as well as the file name. You don't need to *setup project* for daily notes because this is already done *vault-wide* in the extension settings.

<img width="100%" height="auto" alt="image" src="https://github.com/user-attachments/assets/93d6c11b-3ad8-4a7e-90fa-52ae00b51ad4" />

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

I understand having an unwanted entry in the frontmatter is not really that nice, but it's the only way I could think of to make this whole setup work even when _synching_ across multiple devices! Since the _sync state_ is stored in the note then this is also synched with the note, and syncing from other devices _just works_.

## Common issues

**"Please set your TrackBear API key"**  
Add your API key in Settings → TrackBear

**"No TrackBear project set"**  
Run "Set TrackBear Project" command first (journal notes use the Morning Pages ID from settings instead)

**"Could not parse date from filename"**  
Your journal date format setting needs to match your filename format. If your files are named "2024-01-15.md", use format "YYYY-MM-DD"

**Project total seems off**  
The first sync adds all existing words. After that, only changes get added/subtracted. If something looks wrong, check the TrackBear web app to see the individual tallies. If it still doesn't make sense then please [open an issue](https://github.com/meadowingc/obsidian-trackbear/issues/new).

## Privacy stuff

Your API key stays local in Obsidian. The plugin only sends word counts and metadata to TrackBear - never your actual writing.

## Support

- Plugin issues: [GitHub Issues](https://github.com/meadowingc/obsidian-trackbear/issues)
- TrackBear Getting Started docs: https://help.trackbear.app/getting-started/make-a-project
- TrackBear API docs: https://help.trackbear.app/api/

## License

MIT
