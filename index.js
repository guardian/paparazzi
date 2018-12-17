#!/usr/bin/env node

const { Cluster } = require('puppeteer-cluster');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { config } = {
	config: '.paparazzirc',
	...require('minimist')(process.argv.slice(2)),
};

const fetchConfigFile = file => {
	try {
		return require(file);
	} catch (error) {
		try {
			return JSON.parse(readFileSync(resolve(process.cwd(), config), 'utf8'));
		} catch (error) {
			console.error(chalk.red(`error!   ${error}`));
			return {};
		}
	}
};

const getConfigOrFail = () => {
	const conf = {
		...fetchConfigFile(resolve(__dirname, '.defaultpaparazzirc')),
		...fetchConfigFile(resolve(process.cwd(), config)),
	};

	if (!conf.prefix || !conf.routes || !conf.out) {
		console.error(
			chalk.red(`error!   Could not find ${config} in the current folder`)
		);
		process.exit(1);
	}
	conf.out = resolve(process.cwd(), conf.out);
	mkdirp.sync(conf.out);
	return conf;
};

(async () => {
	const { prefix, sizes, routes, screenshot, out } = getConfigOrFail();

	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: require('os').cpus().length || 2,
	});

	await cluster.task(async ({ page, data }) => {
		const { route } = data;
		console.log(`started  ${route}`);
		await page.goto([prefix, route].join('/'));

		for (let size in sizes) {
			try {
				await page.setViewport(sizes[size]);
				await page.screenshot({
					path: `${out}/${size}-${route.replace(/\//gi, '-')}.png`,
					...screenshot,
				});
				console.log(chalk.blue(`done     ${route} – ${size}`));
			} catch (error) {
				console.error(chalk.red(`error!   ${error}`));
			}
		}
		console.log(chalk.green(`done     ${route} – ALL`));
	});

	await Promise.all(routes.map(route => cluster.queue({ route, prefix })));
	await cluster.idle();
	await cluster.close();
})();
