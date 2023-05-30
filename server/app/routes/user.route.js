const router = require('express').Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const uploadImageUser = require('../middlewares//uploadImageUser');

module.exports = (app) => {
    router.get('/getall', userController.getall);
    app.use('/api/user', router);
};
