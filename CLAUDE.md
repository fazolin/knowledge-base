# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Purpose

Personal knowledge base for storing and organizing links and references — both professional and personal. Links are categorized with hashtags and stored in `links.json`. The `index.html` renders them visually with filtering, search and timeline grouped by year/month.

## Adding a Link

When the user pastes a URL (or batch of URLs):

1. **Research** — Search or fetch the page to infer title, description and tags. Never ask if the user wants to add it — if they sent it, they want it added.
2. **Append** to `links.json` following the schema below.
3. **Commit** with message: `add: <title>`.
4. **Push** to `main`.

## JSON Schema

All links live in `links.json` at the root:

```json
{
  "id": "unique-slug",
  "title": "Human-readable title",
  "url": "https://...",
  "description": "Breve descrição em português.",
  "tags": ["#tag1", "#tag2"],
  "addedAt": "2026-04-22T15:30:00"
}
```

### Field rules

| Field | Rule |
|---|---|
| `id` | kebab-case slug, unique, derived from title or repo name |
| `title` | Original name of the tool/project/resource |
| `description` | 1–2 sentences in **Portuguese**, what it is and why it matters |
| `thumbnail` | See thumbnail rules below — optional field |
| `tags` | Array of `#hashtag` strings. Use existing tags when possible |
| `addedAt` | Date and time of insertion in `YYYY-MM-DDTHH:MM:SS` format (e.g. `2026-04-22T15:30:00`). Always use the current date and time. |

### Thumbnail rules

- **YouTube videos** → `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`
- **Any other link** → omit the `thumbnail` field entirely; the UI generates a unique gradient per card automatically
- Never use LoremFlickr, Unsplash source, or GitHub avatars — they are slow or return duplicates

### Tags convention

Tags use `#hashtag` format. Derive from content, not from the URL. Some common tags already in use:

`#ai` `#open-source` `#self-hosted` `#tools` `#design` `#ux` `#ui` `#frontend` `#developer-tools` `#automation` `#workflow` `#claude-plugin` `#claude-code` `#touchdesigner` `#creative-coding` `#tutorial` `#reference` `#3d` `#motion-graphics` `#interactive`

Add new tags freely when they make sense. No limit per entry.

## Updating an Existing Link

Edit the relevant entry in `links.json` directly, then commit with message: `update: <title>`.

## Removing a Link

Delete the entry from `links.json`, then commit with message: `remove: <title>`.

## Instagram Links

The environment cannot fetch Instagram pages. Ask the user to paste a description or screenshot so the entry can be created with accurate metadata.

## Network Constraints

External HTTP fetches are blocked in this environment. Use `WebSearch` to research URLs instead of `fetch`/`curl`.
