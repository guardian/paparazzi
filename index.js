#!/usr/bin/env node

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { resolve } = require('path');
const { readFileSync, mkdirSync } = require('fs');

const takeShot = async (path, { prefix, sizes, out }) => {
	console.log(`started ${path}`);
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(`${prefix}${path}`);

	for (let size in sizes) {
		await page.setViewport(sizes[size]);
		await page.screenshot({
			path: `${out}/${size}-${path.replace(/\//gi, '-')}.png`,
		});
		console.log(chalk.blue(`done    ${path} – ${size}`));
	}
	console.log(chalk.green(`done    ${path} – ALL`));

	return browser.close();
};

(async () => {
	const { prefix, sizes, routes, out } = JSON.parse(
		readFileSync(resolve(__dirname, '.paparazzirc'), 'utf8')
	);
	mkdirSync(resolve(__dirname, out));
	if (!prefix || !sizes || !routes) {
		console.error(
			chalk.red('Could not find .paparazzirc in the project folder')
		);
		process.exit(1);
	}
	await Promise.all(routes.map(r => takeShot(r, { prefix, sizes, out })));
})();
