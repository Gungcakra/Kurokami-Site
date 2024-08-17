// src/puppeteerHelper.js
const puppeteer = require('puppeteer');

async function fetchEpisodeDetails(url) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const episodeDetails = {};

    try {
        // Mengambil judul episode
        episodeDetails.title = await page.$eval('header.entry-header .entry-title', el => el.innerText.trim());

        // Mengambil deskripsi episode
        episodeDetails.description = await page.$eval('header.entry-header .entry-content.entry-content-single', el => el.innerText.trim());

        // Mengambil nomor episode
        episodeDetails.episodeNumber = await page.$eval('header.entry-header .epx span[itemprop="episodeNumber"]', el => el.innerText.trim());

        // Mengambil waktu posting
        episodeDetails.postTime = await page.$eval('header.entry-header .epx .time-post', el => el.innerText.trim());

        // Mengambil opsi server
        episodeDetails.servers = await page.$$eval('#server ul li', options =>
            options.map(option => ({
                quality: option.innerText.trim(),
                element: option.outerHTML // Store element HTML for click simulation
            }))
        );

        // Klik server pertama untuk mendapatkan link streaming
        if (episodeDetails.servers.length > 0) {
            const firstServer = await page.$(`#server ul li:nth-child(1)`);
            await firstServer.click();
            await page.waitForSelector('#player_embed iframe', { timeout: 60000 });
            const iframeSrc = await page.$eval('#player_embed iframe', el => el.src);
            episodeDetails.servers[0].streamURL = iframeSrc;
        }

    } catch (error) {
        console.error('Error fetching episode info:', error);
    }

    await browser.close();
    return episodeDetails;
}

module.exports = { fetchEpisodeDetails };
