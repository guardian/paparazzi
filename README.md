# Paparazzi

📸 Automated manual visual regression testing

Sometimes you are working in a project with a couple of `GET` routes and you are changing an element that's quite global and you want to make sure you aren't accidentally breaking some obscure part of the site sitting elsewhere. If this is you please keep reading!

<img width="1552" alt="screenshot 2018-12-17 at 10 31 45 am" src="https://user-images.githubusercontent.com/11539094/50081816-4a789380-01e7-11e9-896e-b3d8174dd396.png">

Paparazzi spins up a ton of chrome instances using <a href="https://github.com/GoogleChrome/puppeteer">puppeteer</a> and takes screenshots of all paths you specify at all sizes you specify.

## Install and setup

```
npm i -g @guardian/paparazzi
```

This will install the `paparazzi` cli tool. You can also use `npx` instead.

Then in the folder you want to run tests for (this could be your project folder, for instance), create a `.paparazzirc` config file, it's JSON and here's an example:

```
{
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

  // [optional] Name of the folder where screenshots will go to
  "out": "screenies",

  // [optional] Extra options for puppeteer's page.screenshot
  "screenshot": {
    "omitBackground": true,
    "fullPage": true
  },

  // [optional] Screen size pairs
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

Now run `paparazzi` or `npx @guardian/paparazzi` and watch the screenshots appear in front of your eyes.

### Can I set this up as a CI step?

That would be awesome! If you do please let us know and we'll add it to the docs. A great use case would be to automatically add screenshots on your PRs as a comment.

### How can I make full length screenshots?

Use the `"screenshot": { "fullPage": true }` config param. The heights on your size list will be used as the minimum viewport height in this case.
