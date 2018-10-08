const {
        Rental
    } = require('../../../models/rental'),
    mongoose = require('mongoose'),
    request = require('supertest'),
    {
        User
    } = require('../../../models/user'),
    moment = require('moment'),
    {
        Movie
    } = require('../../../models/movies');
describe('/api/returns', () => {
    let server,
        rental,
        customerId,
        movieId,
        token,
        movie;

    const exe = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .type('form')
            .send({
                movieId: movieId ? movieId.toHexString() : movieId,
                customerId: customerId ? customerId.toHexString() : customerId
            });
    };

    beforeEach(async () => {
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {
                name: '12345'
            },
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'movie title',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });

    it('should return 401 if client is not logged in', async function () {

        token = '';

        const res = await exe();

        expect(res.status).toBe(401);

    });

    it('should return 400 if customerId not provided', async function () {

        customerId = '';

        const res = await exe();

        expect(res.status).toBe(400);

    });

    it('should return 400 if movieId not provided', async function () {

        movieId = '';

        const res = await exe();

        expect(res.status).toBe(400);

    });

    it('should return 404 if no rental for this customer and movie combination', async function () {

        await Rental.remove({});

        const res = await exe();

        expect(res.status).toBe(404);

    });

    it('should return 400 if return is already processed', async function () {

        rental.dateReturned = new Date();

        await rental.save();

        const res = await exe();

        expect(res.status).toBe(400);

    });

    it('should return 200 if we have a valid request', async function () {

        const res = await exe();

        expect(res.status).toBe(200);

    });

    it('should set the returnDate if input is valid', async function () {
        await exe();

        const rentalInDb = await Rental.findById(rental._id),
            diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);

    });

    it('should set the rentalFee if input is valid', async function () {

        rental.dateOut = moment().add(-7, 'days').toDate();

        await rental.save();

        await exe();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);

    });

    it('should increase the movie stock if input is valid', async function () {

        await exe();

        const movieInDb = await Movie.findById(rental.movie._id);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);

    });

    it('should return rental if input is valid', async function () {

        const res = await exe();

        expect(Object.keys(res.body))
            .toEqual(expect.arrayContaining([
                'dateOut',
                'dateReturned',
                'rentalFee',
                'customer',
                'movie'
            ]))

    });

});