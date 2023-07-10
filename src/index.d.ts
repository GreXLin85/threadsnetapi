type Thread = {
    id: String,
    content: String,
    user: String,
    whenShared: Date,
    repliesCount: Number,
    likesCount: Number
}

declare module 'threadsnetapi' {
    export class ThreadsAPI {
        constructor({
            proxy,
            headless
        }: {
            proxy?: import("playwright").LaunchOptions["proxy"] | undefined;
            headless?: boolean | undefined;
        });
        checkIfInitialized(): void;
        init(): Promise<void>;
        close(): Promise<void>;
        getThread(threadId?: String): Promise<Thread>;
        getUser(userId?: String): Promise<{
            id: String;
            name: String;
            username: String;
            bio: String;
            profilePicture: String;
            followersCount: Number;
            instagramAccount: String;
        }>;
    }
}