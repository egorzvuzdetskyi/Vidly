const request = require('supertest'),
    {
        User
    } = require('../../../models/user');

fdescribe('/api/auth', () => {

    let server,
        email,
        password;

    const exe = () => {

        return request(server)
            .post('/api/auth')
            .type('form')
            .send({
                email,
                password
            })
    };

    beforeEach(async () => {
        server = require('../../../index');

        email = 'egor@gmail.com';
        password = '123456';

        await request(server)
            .post('/api/users')
            .type('form')
            .send({
                email,
                password,
                name:'Egor'
            })
    });

    afterEach(async () => {
        await server.close();
        await User.remove({})
    });

    it('should return 400 if user is invalid', async function () {
        email = '';
        password = '';

        const res = await exe();

        expect(res.status).toBe(400)

    });

    it('should return 400 if password is invalid', async function () {
        password = '';

        const res = await exe();

        expect(res.status).toBe(400)
    });

    it('should return 200 if user is valid', async function () {
        const res = await exe();

        expect(res.status).toBe(200)
    });

});