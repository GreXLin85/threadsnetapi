import { Browser, BrowserContext, Page, chromium } from 'playwright';

class ThreadsAPI {
    proxy: string | undefined;
    browser: Browser | undefined;
    context: BrowserContext | undefined;
    page: Page | undefined;

    constructor({
        proxy
    }: {
        proxy?: string
    }) {
        this.proxy = proxy;
    }

    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    checkIfInitialized() {
        if (!this.page || !this.context || !this.browser) {
            throw new Error('You must call init() before calling this method');
        }
    }

    async close() {
        this.checkIfInitialized();

        await this.context?.close();
        await this.browser?.close();
    }

    /**
     * Get a thread from Threads.net
     * @param threadId The thread id to get
     * @returns The thread object
     */
    async getThread(threadId: string = "CuP48CiS5sx") {
        this.checkIfInitialized();

        await this.page?.goto(`https://www.threads.net/t/${threadId}`);

        const [
            content,
            user,
            whenShared,
            repliesCount,
            likesCount
        ] = await Promise.all([
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div[3]/div/div[1]/p/span").innerText(),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div[2]/div/div[1]/span/a/span").innerText(),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div[2]/div/div[2]/span/a/time").getAttribute("datetime"),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div[4]/div/span[1]/a").innerText(),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div/div[4]/div/div/span/span").getAttribute("title"),

        ]);

        return {
            id: threadId,
            content,
            user: "@" + user,
            whenShared: new Date(whenShared as string),
            repliesCount: Number(repliesCount?.replace(" replies", "")),
            likesCount: Number(likesCount)
        }
    }
    getReplies(threadId: string = "CuP48CiS5sx") {
        throw new Error("Method will be implemented in the future.");
    }
}

export { ThreadsAPI };