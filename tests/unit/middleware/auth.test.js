const {
        User
    } = require('../../../models/user'),
    auth = require('../../../middleware/auth'),
    mongoose = require('mongoose')

describe('auth middleware', function () {
    it('should populate req.user with the payload of a valid JWT', function () {
        const user = {
                _id: new mongoose.Types.ObjectId().toHexString(),
                isAdmin: true
            },
            token = new User(user).generateAuthToken(),
            req = {
                header: jest.fn().mockReturnValue(token)
            },
            next = jest.fn(),
            res = {};

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});