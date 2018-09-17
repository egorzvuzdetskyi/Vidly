const request = require('supertest'),
    {
        User
    } = require('../../models/user'),
    {
        Genre
    } = require('../../models/genres')

describe('auth middleware', () => {
    let server,
        token;

    beforeEach(() => {

        server = require('../../index');

    });

    afterEach(async () => {
        await Genre.remove({})
        await server.close();
    });

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    const exe = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .type('form')
            .send({
                name: 'genre1'
            })
    };

    it('should return 401 if no token is provided', async function () {
        token = '';

        const res = await exe();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async function () {
        token = 'wrong token for sure';

        const res = await exe();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async function () {
        const res = await exe();

        expect(res.status).toBe(200);
    });

});