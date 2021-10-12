const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');
const Comment = require('../lib/models/Comment.js');

describe('authentication-ctbe routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('should return a newly POSTed User id and email', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        expect(res.body).toEqual({
            id: expect.any(String),
            email: 'cow@moo.com',
        });
    });

    it('should return 400 upon signup w/ email already in use', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'Hi!' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(
            'There is already a user with this email'
        );
    });

    it('should login a user and respond with the existing users id', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        expect(res.body).toEqual({
            email: 'cow@moo.com',
            id: expect.any(String),
        });
    });

    it('should return 401 for trying to login with bad credentials', async () => {
        await UserService.create({ email: 'cow@moo.com', password: 'mooo' });
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'cow@moo.com', password: 'moooo' });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid email/password combination');
    });

    it('GET /me should respond with the currently logged in user', async () => {
        const user = await UserService.create({
            email: 'cow@moo.com',
            password: 'mooo',
        });

        const agent = request.agent(app);
        await agent
            .post('/api/auth/signin')
            .send({ email: 'cow@moo.com', password: 'mooo' });

        const res = await agent.get('/api/auth/me');

        expect(res.body).toEqual({
            id: user.id,
            email: 'cow@moo.com',
        });
    });

    it('should GET /comments without needing a JWT', async () => {
        await UserService.create({
            email: 'cow@moo.com',
            password: 'mooo',
        });
        const comment1 = await Comment.create({
            userId: 1,
            content: 'Hi im a cow! Moooo!',
        });
        const comment2 = await Comment.create({
            userId: 1,
            content: 'Hey! Where is everybody? Am I the only person on here?',
        });
        const res = await request(app).get('/api/comments');
        expect(res.body).toEqual(
            expect.arrayContaining([
                { ...comment1, userId: '1' },
                { ...comment2, userId: '1' },
            ])
        );
    });

    afterAll(() => {
        pool.end();
    });
});
