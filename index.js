#!/usr/bin/env node

// >> $ tree ./example/ > ./tree.txt
// >> $ npx treee ./example/ > ./treee.txt

// >> $ node ./index.js --input ./tree.txt --output ./output.html
// >> $ node ./index.js --input ./tree.txt --output ./output.html --base "."

// >> $ node ./index.js --input ./treee.txt --output ./output.html
// >> $ node ./index.js --input ./treee.txt --output ./output.html --base "."

// >> $ cat ./tree.txt | ./index.js
// >> $ cat ./treee.txt | ./index.js

import { fs, stdin, minimist } from "zx";

const args = minimist(process.argv.slice(2));
const inputPath = args._[0] || args.input;
const outputPath = args.output;
const baseDir = args.base;

let inputData = "";
try {
	// inputData = await fs.readFile(inputPath, "utf8");

	if (inputPath) {
		inputData = await fs.readFile(inputPath, "utf8");
	} else if (!process.stdin.isTTY) {
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

	if (outputPath) {
		await fs.writeFile(outputPath, finalHtml);
		console.error(`Success: ${outputPath}`);
	} else {
		process.stdout.write(finalHtml);
	}

	// await fs.writeFile(outputPath, finalHtml);
	// console.log(chalk.green(`Success: ${outputPath}`));
} catch (err) {
	console.error(`Error: ${err.message}`);
	process.exit(1);
}
