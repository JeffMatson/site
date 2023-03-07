import { afterAll, beforeAll, describe, test } from 'vitest'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'
import { expect } from '@playwright/test'

describe('Test path: "/"', async () => {
    let server: PreviewServer
    let browser: Browser
    let page: Page

    beforeAll(async () => {
        server = await preview({ preview: { port: 3000 } })
        browser = await chromium.launch()
        page = await browser.newPage()
    });

    afterAll(async () => {
        await browser.close()
        await new Promise<void>((resolve, reject) => {
            server.httpServer.close(error => error ? reject(error) : resolve())
        })
    })

    test('Check index', async () => {
        await page.goto('http://localhost:3000');

        await expect(page).toHaveTitle("Jeff Matson's Super Rad Home Page");
    });

});