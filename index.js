#!/usr/bin/env node

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { resolve } = require('path');
const { readFileSync, mkdirSync } = require('fs');

const takeShot = async (route, { prefix, sizes, path }) => {
	console.log(`started ${route}`);
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(`${prefix}${route}`);

	for (let size in sizes) {
		await page.setViewport(sizes[size]);
		await page.screenshot({
			path: `${path}/${size}-${route.replace(/\//gi, '-')}.png`,
		});
		console.log(chalk.blue(`done    ${route} – ${size}`));
	}
	console.log(chalk.green(`done    ${route} – ALL`));

	return browser.close();
};

(async () => {
	const { prefix, sizes, routes, out } = JSON.parse(
		readFileSync(resolve(process.cwd(), '.paparazzirc'), 'utf8')
	);
	const path = resolve(process.cwd(), out);
	mkdirSync(path);
	if (!prefix || !sizes || !routes) {
		console.error(
			chalk.red('Could not find .paparazzirc in the project folder')
		);
		process.exit(1);
	}
	await Promise.all(routes.map(r => takeShot(r, { prefix, sizes, path })));
})();
