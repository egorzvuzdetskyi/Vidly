const request = require('supertest'),
    {
        Genre
    } = require('../../../models/genres'),
    {
        User
    } = require('../../../models/user'),
    mongoose = require('mongoose');

describe('api/genres', () => {

    beforeEach(() => {

        server = require('../../../index');

    });

    afterEach(async () => {
        await server.close();
        await clearDbAfterTests();
    });

    describe('GET /', () => {
        it('should return all genres', async function () {

            await Genre.insertMany([
                {
                    name: 'genre1'
                },
                {
                    name: 'genre2'
                }
            ]);

            const res = await request(server).get('/api/genres')
                .catch(err => console.log(err));

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy();
            expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {

        it('should return 404 if invalid id is passed', async function () {

            // const objectId = new mongoose.Types.ObjectId();

            const res = await request(server).get('/api/genres/1')
            ;
            expect(res.status).toBe(404);
        });

        it('should return 404 if genre can not be found with this id', async function () {

            const objectId = new mongoose.Types.ObjectId();

            const res = await request(server).get('/api/genres/' + objectId);
            expect(res.status).toBe(404);
        });

        it('should return a genre if valid id is passed', async function () {
            const genre = new Genre({
                name: 'genre1'
            });

            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    describe('POST /', function () {

        let token,
            name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1'
        });

        const exe = async () => {
            return await request(server)
                .post('/api/genres')
                .type('form')
                .send({
                    name
                })
                .set('x-auth-token', token);
        };

        it('should return 401 if client is not logged in', async function () {
            token = '';
            const res = await exe();

            expect(res.status).toBe(401);
        });

        it('should return 401 if genre is less than 5 characters', async function () {
            name = '1234';

            const res = await exe();

            expect(res.status).toBe(400);
        });

        it('should return 401 if genre is more than 50 characters', async function () {

            name = new Array(52).join('a');

            const res = await exe();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async function () {

            await exe();

            const genre = await Genre.find({
                name: 'genre1'
            });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async function () {

            const res = await exe();

            expect(res.body).toHaveProperty('_id');

            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});

const clearDbAfterTests = async () => {
    await Genre.remove({});
};