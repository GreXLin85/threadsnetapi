import { ThreadsAPI } from './index';

describe('ThreadsAPI Internal', () => {
    let threadsAPI: ThreadsAPI;

    beforeAll(async () => {
        threadsAPI = new ThreadsAPI({});
    });

    test('throws error if not initialized', () => {
        expect(() => {
            const thrAPI = new ThreadsAPI({});

            thrAPI.checkIfInitialized();
        }).toThrow('You must call init() before calling this method');
    });

    test('does not throw error if initialized', async () => {
        const thrAPI = new ThreadsAPI({});
        
        await thrAPI.init();
        expect(async () => {
            thrAPI.checkIfInitialized();
        }).not.toThrowError('You must call init() before calling this method');
    
        await thrAPI.close();
    });
});

describe('ThreadsAPI', () => {
    let threadsAPI: ThreadsAPI;

    beforeAll(async () => {
        threadsAPI = new ThreadsAPI({});
        await threadsAPI.init();
    });

    test('getThread', async () => {
        const thread = await threadsAPI.getThread();
        expect(thread).toMatchObject({
            id: expect.any(String),
            content: expect.any(String),
            user: expect.any(String),
            whenShared: expect.any(Date),
            repliesCount: expect.any(Number),
            likesCount: expect.any(Number),
        });
    }, 10000);

    test('getUser', async () => {
        const user = await threadsAPI.getUser("grexlin85");

        expect(user).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            username: expect.any(String),
            bio: expect.any(String),
            profilePicture: expect.any(String),
            followersCount: expect.any(Number),
            instagramAccount: expect.any(String),
        });
    }, 10000);

    afterAll(async () => {
        await threadsAPI.close();
    });
})