import { Browser, BrowserContext, LaunchOptions, Page, chromium } from 'playwright';

class ThreadsAPI {
    private proxy: LaunchOptions["proxy"] | undefined;
    private headless: boolean | undefined;
    private browser: Browser | undefined;
    private context: BrowserContext | undefined;
    private page: Page | undefined;

    constructor({
        proxy,
        headless = false
    }: {
        proxy?: LaunchOptions["proxy"];
        headless?: boolean;
    }) {
        this.proxy = proxy;
        this.headless = headless;
    }

    async init() {
        this.browser = await chromium.launch({ headless: this.headless, proxy: this.proxy });
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

    async getUser(userId: string = "zuck") {
        this.checkIfInitialized();

        await this.page?.goto(`https://www.threads.net/@${userId}`);

        const [
            name,
            bio,
            profilePicture,
            followersCount,
            instagramAccount
        ] = await Promise.all([
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[1]/div[1]/h1").innerText(),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[2]/span").innerText(),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[1]/div[2]/div/div/img").getAttribute("src"),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[3]/div[1]/div/div/span/span").innerText(),
            this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[3]/div[3]/div[1]/a").getAttribute("href"),
        ]);

        return {
            id: userId,
            name,
            username: "@" + userId,
            bio,
            profilePicture,
            followersCount: Number(followersCount),
            instagramAccount: instagramAccount?.replace("https://www.instagram.com/", "")
        }
    }

    async getUserThreads(userId: string = "zuck") {
        this.checkIfInitialized();

        await this.page?.goto(`https://www.threads.net/@${userId}`);

        const threads = await this.page?.locator("xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div").count() as number;

        const threadsArray = [];

        for (let i = 3; i <= threads; i++) {
            const [
                content,
                whenShared,
                repliesCount,
                likesCount
            ] = await Promise.all([
                this.page?.locator(`xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[${i}]/div/div/div[3]/div/div[1]/p/span`).innerText(),
                this.page?.locator(`xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[${i}]/div/div/div[2]/div/div[2]/span/a/time`).getAttribute("datetime"),
                this.page?.locator(`xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[${i}]/div/div/div[4]/div/span[1]/a`).innerText(),
                this.page?.locator(`xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[${i}]/div/div/div[4]/div/div/span/span`).getAttribute("title"),
            ]);

            threadsArray.push({
                id: (await this.page?.locator(`xpath=//html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[${i}]/div/div/div[1]/div/div[1]/a`).getAttribute("href"))?.replace("https://www.threads.net/t/", ""),
                content,
                user: "@" + userId,
                whenShared: new Date(whenShared as string),
                repliesCount: Number(repliesCount?.replace(" replies", "")),
                likesCount: Number(likesCount)
            });
        }

        return threadsArray;
    }
}

export { ThreadsAPI };