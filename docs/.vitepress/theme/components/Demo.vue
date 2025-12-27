<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const languages = [
	'js', 'ts', 'py', 'rs', 'go', 'java', 'c', 'css', 'html', 'json',
	'bash', 'sql', 'yaml', 'toml', 'md', 'diff', 'docker', 'make'
];

const themes = ['default', 'github-dark', 'github-light', 'github-dim', 'atom-dark', 'visual-studio-dark'];

const samples = {
	js: `function greet(name) {
  // Template literal
  return \`Hello, \${name}!\`;
}

const result = greet('World');
console.log(result);`,
	ts: `interface User {
  id: number;
  name: string;
  email?: string;
}

function createUser(data: Partial<User>): User {
  return { id: Date.now(), name: 'Anonymous', ...data };
}`,
	py: `def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]`,
	rs: `fn main() {
    let numbers: Vec<i32> = (1..=10).collect();
    
    let sum: i32 = numbers.iter()
        .filter(|&n| n % 2 == 0)
        .sum();
    
    println!("Sum of evens: {}", sum);
}`,
	go: `package main

import "fmt"

func main() {
    messages := make(chan string)
    
    go func() {
        messages <- "Hello, Go!"
    }()
    
    msg := <-messages
    fmt.Println(msg)
}`,
	java: `public class Main {
    public static void main(String[] args) {
        var list = List.of("Hello", "World");
        
        list.stream()
            .map(String::toUpperCase)
            .forEach(System.out::println);
    }
}`,
	c: `#include <stdio.h>

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    
    printf("Sum: %d\\n", sum);
    return 0;
}`,
	css: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}`,
	html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello World</title>
</head>
<body>
  <main>
    <h1>Welcome</h1>
    <p>Hello, World!</p>
  </main>
</body>
</html>`,
	json: `{
  "name": "@speed-highlight/core",
  "version": "1.2.13",
  "dependencies": {},
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}`,
	bash: `#!/bin/bash

# Find and count files
find . -name "*.js" -type f | while read file; do
    lines=$(wc -l < "$file")
    echo "$file: $lines lines"
done`,
	sql: `SELECT 
    users.name,
    COUNT(orders.id) as order_count,
    SUM(orders.total) as total_spent
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2024-01-01'
GROUP BY users.id
HAVING order_count > 5
ORDER BY total_spent DESC;`,
	yaml: `name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build`,
	toml: `[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }`,
	md: `# Markdown Example

This is **bold** and *italic* text.

## Code Block

\`\`\`js
console.log('hello');
\`\`\`

- List item 1
- List item 2`,
	diff: `--- a/file.js
+++ b/file.js
@@ -1,4 +1,4 @@
 function greet(name) {
-  return 'Hello, ' + name;
+  return \`Hello, \${name}!\`;
 }`,
	docker: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]`,
	make: `CC = gcc
CFLAGS = -Wall -O2

all: main

main: main.o utils.o
\t$(CC) $(CFLAGS) -o $@ $^

clean:
\trm -f *.o main`
};

const selectedLang = ref('js');
const selectedTheme = ref('default');
const hideLineNumbers = ref(false);
const showHeader = ref(false);
const code = ref('');
const highlightedCode = ref('');
const highlightTime = ref(0);
const copied = ref('');

const themeUrl = computed(() => 
	`https://unpkg.com/@speed-highlight/core/dist/themes/${selectedTheme.value}.css`
);

const cdnSnippet = computed(() => 
`<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/${selectedTheme.value}.css">

<div class="shj-lang-${selectedLang.value}">
your code here
</div>

<script type="module">
  import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
  highlightAll();
<\/script>`
);

const npmSnippet = computed(() => 
`import { highlightAll } from '@speed-highlight/core';
import '@speed-highlight/core/dist/themes/${selectedTheme.value}.css';

// In your HTML: <div class="shj-lang-${selectedLang.value}">code</div>
highlightAll();`
);

const terminalSnippet = computed(() => {
	const isTerminalTheme = ['default', 'atom-dark'].includes(selectedTheme.value);
	const themeName = isTerminalTheme ? selectedTheme.value : 'default';
	return `import { setTheme, printHighlight } from '@speed-highlight/core/terminal';

setTheme('${themeName}');
printHighlight(code, '${selectedLang.value}');`;
});

async function copy(text) {
	await navigator.clipboard.writeText(text);
	copied.value = text === cdnSnippet.value ? 'cdn' : text === npmSnippet.value ? 'npm' : 'terminal';
	setTimeout(() => copied.value = '', 2000);
}

onMounted(async () => {
	code.value = samples[selectedLang.value];
	await highlight();
});

watch([selectedLang, selectedTheme, hideLineNumbers, showHeader], async () => {
	code.value = samples[selectedLang.value] || samples.js;
	await highlight();
});

async function highlight() {
	const start = performance.now();
	
	const { highlightText } = await import('../../../../dist/index.js');
	highlightedCode.value = await highlightText(
		code.value,
		selectedLang.value,
		true,
		{ hideLineNumbers: hideLineNumbers.value }
	);
	
	highlightTime.value = (performance.now() - start).toFixed(2);
}
</script>

<template>
	<div class="demo-container">
		<div class="demo-controls">
			<div class="control-group">
				<label>Language</label>
				<select v-model="selectedLang">
					<option v-for="lang in languages" :key="lang" :value="lang">
						{{ lang }}
					</option>
				</select>
			</div>
			
			<div class="control-group">
				<label>Theme</label>
				<select v-model="selectedTheme">
					<option v-for="theme in themes" :key="theme" :value="theme">
						{{ theme }}
					</option>
				</select>
			</div>
			
			<div class="control-group checkbox">
				<label>
					<input type="checkbox" v-model="hideLineNumbers">
					Hide line numbers
				</label>
			</div>
			
			<div class="control-group checkbox">
				<label>
					<input type="checkbox" v-model="showHeader">
					Show header
				</label>
			</div>
		</div>
		
		<div class="demo-stats">
			Highlighted in {{ highlightTime }}ms
		</div>
		
		<link :href="themeUrl" rel="stylesheet">
		
		<div 
			class="demo-output shj-multiline"
			:class="[`shj-lang-${selectedLang}`, { 'shj-mode-header': showHeader }]"
			:data-lang="selectedLang"
			v-html="highlightedCode"
		></div>

		<div class="snippets">
			<h3>Use this configuration</h3>
			
			<div class="snippet">
				<div class="snippet-header">
					<span>CDN (HTML)</span>
					<button @click="copy(cdnSnippet)">{{ copied === 'cdn' ? 'Copied!' : 'Copy' }}</button>
				</div>
				<pre><code>{{ cdnSnippet }}</code></pre>
			</div>
			
			<div class="snippet">
				<div class="snippet-header">
					<span>npm / Bundler</span>
					<button @click="copy(npmSnippet)">{{ copied === 'npm' ? 'Copied!' : 'Copy' }}</button>
				</div>
				<pre><code>{{ npmSnippet }}</code></pre>
			</div>
			
			<div class="snippet">
				<div class="snippet-header">
					<span>Terminal (Node.js)</span>
					<button @click="copy(terminalSnippet)">{{ copied === 'terminal' ? 'Copied!' : 'Copy' }}</button>
				</div>
				<pre><code>{{ terminalSnippet }}</code></pre>
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo-container {
	margin: 2rem 0;
}

.demo-controls {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-bottom: 1rem;
	padding: 1rem;
	background: var(--vp-c-bg-soft);
	border-radius: 8px;
}

.control-group {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.control-group label {
	font-size: 0.875rem;
	color: var(--vp-c-text-2);
}

.control-group.checkbox {
	flex-direction: row;
	align-items: center;
}

.control-group.checkbox label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
}

select {
	padding: 0.5rem;
	border-radius: 4px;
	border: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
	font-size: 0.875rem;
	min-width: 140px;
}

select:focus {
	outline: none;
	border-color: var(--vp-c-brand-1);
}

.demo-stats {
	font-size: 0.75rem;
	color: var(--vp-c-text-3);
	margin-bottom: 0.5rem;
}

.demo-output {
	font-family: 'Fira Code', ui-monospace, monospace;
	font-size: 14px;
	line-height: 1.6;
	border-radius: 8px;
	overflow-x: auto;
}

.demo-output.shj-mode-header::before {
	content: attr(data-lang);
	display: block;
	padding: 8px 16px;
	margin-bottom: 12px;
	background: var(--vp-c-bg-mute);
	border-radius: 4px;
	color: var(--vp-c-brand-1);
	font-size: 12px;
	text-transform: uppercase;
	font-family: var(--vp-font-family-base);
}
</style>
