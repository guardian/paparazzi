#!/usr/bin/env node

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { config } = {
	config: '.paparazzirc',
	...require('minimist')(process.argv.slice(2)),
};

const takeShot = async (route, { prefix, sizes, path, screenshot }) => {
	console.log(`started ${route}`);
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(`${prefix}${route}`);

	for (let size in sizes) {
		await page.setViewport(sizes[size]);
		await page.screenshot({
			path: `${path}/${size}-${route.replace(/\//gi, '-')}.png`,
			...screenshot,
		});
		console.log(chalk.blue(`done    ${route} – ${size}`));
	}
	console.log(chalk.green(`done    ${route} – ALL`));

	return browser.close();
};

const getConfig = () => {
	const defaultConfig = {
		sizes: {
			phone: {
				width: 375,
				height: 1100,
			},
		},
		out: 'screenshots',
		screenshot: {},
	};
	try {
		const handle = readFileSync(resolve(process.cwd(), config), 'utf8');
		return {
			...defaultConfig,
			...JSON.parse(handle),
		};
	} catch (error) {
		console.error(chalk.red(`Error! ${error}`));
		return defaultConfig;
	}
};

(async () => {
	const { prefix, sizes, routes, out, screenshot } = getConfig();
	if (!prefix || !routes || !out) {
		console.error(chalk.red('Could not find ${config} in the project folder'));
		process.exit(1);
	}
	const path = resolve(process.cwd(), out);
	mkdirp.sync(path);
	await Promise.all(
		routes.map(r => takeShot(r, { prefix, sizes, path, screenshot }))
	);
})();
