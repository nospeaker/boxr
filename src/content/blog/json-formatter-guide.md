---
title: "The Complete Guide to JSON Formatting and Validation"
description: "Learn what JSON is, why formatting matters, common syntax errors, and how to validate JSON data reliably."
publishedAt: 2026-07-08
category: "Guides"
readingTime: 6
---

JSON (JavaScript Object Notation) is the lingua franca of data interchange on the web. Every API you call, every config file you read, every database you export from — almost certainly speaks JSON. But raw JSON is hard to read, and invalid JSON will break your code.

In this guide, you'll learn:

- The JSON syntax rules you must follow
- Why formatting matters (and when it doesn't)
- Common errors and how to spot them
- How to validate JSON programmatically
- Tools and workflow tips

## What is JSON?

JSON is a lightweight **text-based data format** based on JavaScript object syntax, but it's language-independent. Modern languages have built-in support for JSON — Python, Java, Go, Rust, PHP, Ruby, you name it.

A simple JSON document looks like this:

```json
{
  "name": "UtilHub",
  "version": "0.1.0",
  "tags": ["tools", "developer", "online"],
  "active": true
}
```

Notice the strict quoting of keys and string values. That's where most errors come from.

## The Seven JSON Value Types

A JSON document is built from these primitives:

1. **string** — `"hello"`
2. **number** — `42`, `-3.14`, `6.022e23`
3. **boolean** — `true` or `false`
4. **null** — `null`
5. **object** — `{ "key": "value" }`
6. **array** — `[1, 2, 3]`
7. (That's it. No dates. No comments. No functions.)

This minimalism is a feature: you can parse JSON in any language with a single function call.

## Why Format JSON?

JSON is technically allowed to be one big line:

```json
{"name":"Alice","age":30,"address":{"city":"NYC","zip":"10001"},"hobbies":["reading","swimming"]}
```

But humans can't read that. **Formatting** (also called *pretty-printing*) adds newlines and indentation so you can scan it:

```json
{
  "name": "Alice",
  "age": 30,
  "address": {
    "city": "NYC",
    "zip": "10001"
  },
  "hobbies": ["reading", "swimming"]
}
```

The data is identical — JSON formatting is purely cosmetic. Both forms are valid and `JSON.parse` gives the same result.

### When formatting matters

- **Debugging API responses** — formatted JSON is much easier to read in DevTools.
- **Code review** — pull requests with JSON config files are easier when formatted.
- **Documentation** — examples in docs should be formatted for readability.
- **Diff tools** — formatted JSON gives a useful diff; minified JSON only shows total change.

### When formatting doesn't matter

- **Network payload** — minified JSON is smaller and faster to transfer. Use it in production.
- **Database storage** — JSON columns in PostgreSQL / MySQL don't care about whitespace.
- **Storage in object stores** — same as above.

## Common JSON Errors (and how to fix them)

### 1. Trailing commas

```json
{
  "name": "Alice",
  "age": 30,    // ❌ trailing comma — invalid
}
```

Python and JavaScript objects allow trailing commas; JSON does not. The last item in an object or array must NOT have a trailing comma.

### 2. Unquoted keys

```json
{ name: "Alice" }   // ❌ invalid — keys must be quoted
```

### 3. Single quotes

```json
{ 'name': 'Alice' }  // ❌ invalid — only double quotes allowed
```

This trips up Python developers who are used to JS literal syntax.

### 4. Comments

```json
{
  // ❌ invalid — JSON has no comments
  "version": "1.0"
}
```

Note: JSON5 and JSONC allow comments, but standard JSON does not. If your tooling supports comments, it's using a non-standard parser.

### 5. NaN / Infinity / undefined

```json
{ "value": NaN }   // ❌ invalid
{ "value": undefined }   // ❌ invalid
{ "value": Infinity }   // ❌ invalid
```

### 6. Hex / octal / binary numbers

```json
{ "value": 0x1F }   // ❌ invalid — JSON only supports decimal literals
{ "value": 0o17 }   // ❌ invalid
```

## How to Validate JSON

The fastest way: paste it into our [JSON Formatter](/tools/json-formatter). It checks syntax in real time and tells you exactly where the error is.

If you prefer command line:

```bash
# jq validates and pretty-prints
echo '{"a":1}' | jq .

# Python
python3 -m json.tool < input.json

# Node.js
node -e "JSON.parse(require('fs').readFileSync('input.json'))"
```

## Linting JSON in CI

You should validate JSON in your CI pipeline to catch errors before they ship:

```yaml
# .github/workflows/ci.yml
- name: Validate JSON
  run: |
    for f in $(find . -name '*.json'); do
      python3 -m json.tool < "$f" > /dev/null || (echo "Invalid: $f"; exit 1)
    done
```

## JSON vs YAML vs TOML — when to use what

- **JSON** — API responses, config files where strictness helps.
- **YAML** — Kubernetes, Docker Compose, GitHub Actions. More readable, supports comments.
- **TOML** — Python (pyproject.toml), Rust (Cargo.toml). Good middle-ground.

Use our [JSON ↔ YAML converter](/tools/json-to-yaml) when you need to switch between them.

## Wrapping up

JSON is simple but strict. The good news: with a good formatter and validator, you never have to stare at it for long. Bookmark our [JSON Formatter & Validator](/tools/json-formatter) and you'll never lose a Saturday to a missing comma again.
