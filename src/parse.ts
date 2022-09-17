/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

const puppeteer = require("puppeteer");

const LUCKY_GUESS = "crate".split("");

function sleep(ms: number) {
  return new Promise<void>((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

export async function fetchWordleOfTheDay(): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://www.nytimes.com/games/wordle/index.html");

  await sleep(500);
  // @ts-ignore
  await page.$eval('[data-testid="modal-overlay"]', (elem) => elem.click());

  for (let i = 0; i < 6; i++) {
    for (const letter of LUCKY_GUESS) {
      page.keyboard.press(letter);
      await sleep(5);
    }
    page.keyboard.press("Enter");
    await sleep(2000);
  }

  // @ts-ignore
  const source = await page.$eval("#wordle-app-game", (el) => el.innerHTML);
  const lastIndex = source.lastIndexOf("Toast-module_toast__");

  let solution = "";
  let seenPre = false;

  for (let i = lastIndex; i < source.length; i++) {
    const char = source[i];
    if (char === ">") {
      seenPre = true;
      continue;
    }
    if (!seenPre) continue;
    if (char === "<") break;
    solution += char;
  }

  solution = solution.toLowerCase();
  await browser.close();

  return solution;
}
