const router = require('express').Router();
const { body } = require('express-validator');
const deviceController = require('../controllers/device.controller');

module.exports = (app) => {
    router.get('/getall', deviceController.getall);
    router.get('/getbyid/:id', deviceController.getById);
    router.post('/register', [body('imei', 'Trường này không được bỏ trống').notEmpty()], deviceController.register);
    router.put(
        '/updatebyid/:id',
        [body('imei', 'Trường này không được bỏ trống').notEmpty()],

        deviceController.update,
    );
    router.delete('/delete/:id', deviceController.delete);
    router.put(
        '/move-user',
        [
            body('imei', 'Trường này không được bỏ trống').notEmpty(),
            body('user_id', 'Trường này không được bỏ trống').notEmpty(),
        ],
        deviceController.moveUser,
    );
    router.put('/change-expired-on', deviceController.changeExpiredOn);
    router.put('/change-group/:id', deviceController.changeGroup);

    app.use('/api/device', router);
};
