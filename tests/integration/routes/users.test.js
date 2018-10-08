const request = require('supertest'),
    {
        User
    } = require('../../../models/user'),
    jwt = require('jsonwebtoken')

fdescribe('/api/users', () => {

    describe('POST /', function () {
        let server,
            email,
            password;

        const exe = () => {
            return request(server)
                .post('/api/users')
                .type('form')
                .send({
                    email,
                    password,
                    name:'Egor'
                })
        };

        beforeEach(async () => {
            server = require('../../../index');

            email = 'egor@gmail.com';
            password = '123456';
        });

        afterEach(async () => {
            await server.close();
            await User.remove({})
        });

        it('should return 400 if email is invalid', async function () {
            email = '';

            const res = await exe();

            expect(res.status).toBe(400)
        });

        it('should return 400 if password is invalid', async function () {
            password = '';

            const res = await exe();

            expect(res.status).toBe(400)
        });

        it('should return 400 if user is already registered', async function () {

            await exe();

            const res = await exe();

            expect(res.status).toBe(400)
        });

        it('should return 200 if user is valid', async function () {
            const res = await exe();

            expect(res.status).toBe(200);
        })

        it('should return token if user is valid', async function () {
            const res = await exe();

            expect(res.body).toHaveProperty('token');
        });
    });

});