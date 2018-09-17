const {
        User
    } = require('../../../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    mongoose = require('mongoose');

describe('userModel: generateAuthToken', () => {
    it('should return a valid JWT', function () {
        const payLoad = {
                _id: new mongoose.Types.ObjectId().toHexString(),
                isAdmin: true
            },
            user = new User(payLoad),
            token = user.generateAuthToken(),
            decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(payLoad)
    });
})