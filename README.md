# Paparazzi
Automated manual visual regression testing


Sometimes you are working in a project with a couple of GRT routes and you are changing an element that's quite global and you want to make sure you aren't accidentally breaking some obscure part of the site sitting elsewhere. If this is you please keep reading!

<img width="1552" alt="screenshot 2018-12-17 at 10 31 45 am" src="https://user-images.githubusercontent.com/11539094/50081816-4a789380-01e7-11e9-896e-b3d8174dd396.png">

Paparazzi spins up a ton of browsers using <a href="https://github.com/GoogleChrome/puppeteer">puppeteer</a> and takes screenshots of all paths you specify at any sizes you specify.

## Install and setup

Clone this repo and run `npm i` to install all dependencies (it's just puppeteer and chalk to make logs colourful. Very important.). Then run `npm link` to get a global `paparazzi` command(1). Let this sit wherever.

Now let's create a blank folder for our tests, in it we need to create a `.paparazzirc` config file, it's JSON and here's an example:

```
{
  // Name of the folder where screenshots will go to
  "out": "screenies",
  
  // List of routes you wanna screenshot
	"routes": [
		"uk",
		"showcase",
		"uk/subscribe",
		"uk/subscribe/paper",
		"uk/subscribe/digital",
		"uk/subscribe/weekly",
		"uk/contribute",
		"uk/contribute/recurring",
		"paypal/return"
	],
  
  // Domain you want to test the routes against
	"prefix": "https://support.thegulocal.com/",
  
  // Screen size pairs
	"sizes": {
		"desktop": {
			"width": 1440,
			"height": 900
		},
		"phone": {
			"width": 375,
			"height": 1100
		},
		"tablet": {
			"height": 1024,
			"width": 768
		}
	}
}
```
Now run `paparazzi` and watch the screenshots appear in front of your eyes.

### Can I set this up as a CI step?
Maybe? If you do please let me know, i'd love to get this thing commenting with screenshots on PRs

### (1) Can I use this locally?

Sure thing pal! Just run `./index.js` or `node index.js` in the `paparazzi folder`. You will have to put your `.paparazzirc` file in there.
