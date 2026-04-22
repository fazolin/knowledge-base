# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Personal knowledge base for storing and organizing links and references — both professional and personal. Links are categorized with hashtags and stored in a structured JSON file. The future goal is to render these links visually in an `index.html` page organized by category.

## Data Structure

All links live in `links.json` at the root. Each entry follows this shape:

```json
{
  "id": "unique-slug",
  "title": "Human-readable title",
  "url": "https://...",
  "description": "Breve descrição em português.",
  "thumbnail": "https://...",
  "tags": ["#professional", "#design", "#reference"],
  "addedAt": "2026-04-22"
}
```

For `thumbnail`:
- GitHub repos: use `https://github.com/<owner>.png`
- Instagram: user must provide a screenshot; store a local path or skip the field
- Other sites: try fetching the `og:image` meta tag from the page

Tags use the `#hashtag` convention. Categories are derived from tags — no separate category field.

## Adding Links

When the user pastes a link or a batch of links, Claude should:
1. Infer `title`, `description`, and `tags` from context (URL structure, user notes, page content if fetchable).
2. Append the new entry/entries to `links.json`.
3. Commit with message: `add: <title>`.

## Future: index.html

A static `index.html` will render `links.json` grouped by tag, with filtering and search. It must be self-contained (no build step, no bundler) — plain HTML + vanilla JS + CSS.
