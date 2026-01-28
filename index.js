#!/usr/bin/env node

// >> $ tree . -L 2 | ./index.js
// >> $ tree . -L 2 | ./index.js --base "."
// >> $ tree . -L 2 | ./index.js --base "./src"

// >> $ npx treee ./example/ | ./index.js
// >> $ npx treee ./example/ | ./index.js --base "."
// >> $ npx treee ./example/ | ./index.js --base "./src"

import { stdin, minimist } from "zx";

const args = minimist(process.argv.slice(2));
const baseDir = args.base;

let inputData = "";
try {
	if (!process.stdin.isTTY) {
		inputData = await stdin();
	}

	if (!inputData) {
		console.error("Error: No input data provided.");
		process.exit(1);
	}

	const allLines = inputData.split("\n");
	const parsedNodes = [];
	let footerLines = [];
	let isTreeSection = true;

	for (const line of allLines) {
		const cleanLine = line.replace(/\r$/, "");

		if (isTreeSection && cleanLine.trim() === "" && parsedNodes.length > 0) {
			isTreeSection = false;
			continue;
		}

		if (isTreeSection) {
			const match = cleanLine.match(/^(.*[─-]{2}\s)(.*)$/);
			if (match) {
				const symbols = match[1];
				const name = match[2].trim();
				parsedNodes.push({
					depth: Math.floor(symbols.length / 4) + 1,
					symbols,
					name,
				});
			} else if (cleanLine.trim() !== "") {
				parsedNodes.push({
					depth: 0,
					symbols: "",
					name: cleanLine.trim(),
					isRoot: true,
				});
			}
		} else {
			footerLines.push(cleanLine);
		}
	}

	let pathStack = [];
	const treeHtml = parsedNodes
		.map((node) => {
			pathStack = pathStack.slice(0, node.depth);

			const nameForLink = node.name.replace(/\/$/, "");

			if (node.isRoot && baseDir !== undefined) {
				pathStack[node.depth] = baseDir;
			} else {
				pathStack[node.depth] = nameForLink;
			}

			let fullPath = pathStack.filter((p) => p !== undefined && p !== null).join("/");

			if (fullPath === "") fullPath = ".";

			const formattedSymbols = node.symbols.replace(/ /g, "&nbsp;");

			return (
				`<div class="tree-line">` +
				`<span>${formattedSymbols}</span>` +
				`<a href="${fullPath}">${node.name}</a>` +
				`</div>`
			);
		})
		.join("\n");

	const footerHtml = footerLines.map((line) => `<div>${line.replace(/ /g, "&nbsp;")}</div>`).join("\n");

	const finalHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>treelink</title>
  <style>
    body { font-family: monospace; }
    .tree-line { display: inline-block; min-width: 100%; white-space: nowrap; }
    .footer { margin-top: 1em; }
  </style>
</head>
<body>
  <div class="tree-container">${treeHtml}</div>
  <div class="footer">${footerHtml}</div>
</body>
</html>`;

	console.log(finalHtml);
} catch (err) {
	console.error(`Error: ${err.message}`);
	process.exit(1);
}
