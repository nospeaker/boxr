---
title: "Regex for Beginners: A Practical Survival Guide"
description: "Master the basics of regular expressions with practical examples. From matching emails to validating dates, this guide covers what you'll actually use."
publishedAt: 2026-07-08
category: "Tutorials"
readingTime: 8
---

Regular expressions look like someone smashed their keyboard. But once you crack the syntax, they're one of the most useful tools in a developer's belt.

This is a **practical** guide: no theory, just examples you can copy-paste and adapt.

## The 30-second mental model

A regex is a **pattern** that matches strings. Think of it as a search on steroids.

The simplest pattern is just literal text: `cat` matches the word "cat" inside any string.

Special characters let you write more complex patterns:

| Character | Meaning |
|-----------|---------|
| `.` | Any single character |
| `\d` | A digit (0-9) |
| `\w` | A word character (a-z, A-Z, 0-9, _) |
| `\s` | Whitespace (space, tab, newline) |
| `^` | Start of string |
| `$` | End of string |
| `+` | One or more |
| `*` | Zero or more |
| `?` | Optional (zero or one) |
| `[abc]` | Character class — any of a, b, c |
| `(...)` | Capture group |
| `\|` | Alternation (or) |

Test these interactively in our [Regex Tester](/tools/regex-tester).

## Practical example 1: Validate an email

A common beginner regex:

```
^[\w.-]+@[\w.-]+\.\w+$
```

Let's break it down:

- `^` — start
- `[\w.-]+` — one or more word chars, dots, or hyphens
- `@` — literal @ symbol
- `[\w.-]+` — domain part
- `\.` — literal dot
- `\w+` — TLD (com, org, etc.)
- `$` — end

This is **good enough for client-side validation** but NOT sufficient as a single source of truth — email RFC 5321 allows surprising things. For real-world validation, *send a confirmation email*.

Test it with the [Regex Tester](/tools/regex-tester).

## Practical example 2: Match a URL

```
https?:\/\/[\w.-]+(?:\.\w{2,})+(?:\/[\w./?=&%-]*)?$
```

- `https?` — http or https (the `s?` makes the s optional)
- `:\/\/` — literal `://`
- `[\w.-]+` — domain name
- `(?:\.\w{2,})+` — one or more `.tld`-like parts
- `(?:\/[\w./?=&%-]*)?` — optional path/query string

This handles most real-world URLs. For edge cases (Unicode domains, very long TLDs), you'll need a parser.

## Practical example 3: Match dates (YYYY-MM-DD)

```
^\d{4}-\d{2}-\d{2}$
```

- `^\d{4}` — 4 digits at the start
- `-` — literal dash
- `\d{2}` — 2 digits
- `-` — dash
- `\d{2}$` — 2 digits at the end

Note: this validates *format* but not whether the date is real (e.g., 2026-02-31 matches but isn't a valid date). For that, use a dedicated date library.

## Capture groups: the killer feature

Parens create **capture groups**. They let you extract parts of a match:

```
^(\d{4})-(\d{2})-(\d{2})$
```

For input `2026-07-08`:
- group 1: `2026`
- group 2: `07`
- group 3: `08`

In JavaScript:

```js
const m = "2026-07-08".match(/^(\d{4})-(\d{2})-(\d{2})$/);
console.log(m[1]); // "2026"
console.log(m[2]); // "07"
console.log(m[3]); // "08"
```

### Named groups (more readable)

```
(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})
```

Access them as `m.groups.year` etc.

## Greedy vs lazy matching

By default, `+` and `*` are **greedy** — they match as much as possible.

For input `<b>foo</b><b>bar</b>`, pattern `<.+>` would match the entire string `<b>foo</b><b>bar</b>` instead of `<b>foo</b>`.

Add `?` to make it **lazy**:

```
<.+?>
```

Now it matches `<b>foo</b>` (the shortest match).

## Useful flags

In JavaScript regex literals:

- `g` — global (find all matches, not just the first)
- `i` — case-insensitive
- `m` — multiline (`^` and `$` match line breaks)
- `s` — dotall (`.` matches newlines)
- `u` — unicode

Example: `/\bword\b/gi` finds all case-insensitive occurrences of "word" as whole words.

## Common pitfalls

1. **Forgetting to escape**: a literal dot is `\.`, not `.`
2. **HTML is not a regular language**: don't try to parse HTML with regex. Use a parser.
3. **Backtracking catastrophic regexes**: `(a+)+b` on `"aaaaaaaac"` can hang your process. Avoid nested quantifiers.

## Where to next?

- Test your regex in our interactive [Regex Tester](/tools/regex-tester)
- Convert captured groups to JSON with our [JSON Formatter](/tools/json-formatter)
- Read the [MDN Regex Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for the full reference

Regex becomes intuitive with practice. The more you use them, the faster you'll be able to write the right pattern from memory.
