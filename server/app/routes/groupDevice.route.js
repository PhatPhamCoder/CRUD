const router = require('express').Router();
const { body } = require('express-validator');
const groupDeviceController = require('../controllers/groupDevice.controller');

module.exports = (app) => {
    router.get('/getall', groupDeviceController.getall);
    router.get('/getbyid/:id', groupDeviceController.getById);
    router.post(
        '/register',
        [body('name', 'Trường này không được bỏ trống').notEmpty()],
        groupDeviceController.register,
    );
    router.put(
        '/updatebyid/:id',
        [body('name', 'Trường này không được bỏ trống').notEmpty()],
        groupDeviceController.update,
    );
    router.delete('/delete/:id', groupDeviceController.delete);
    router.put('/update-publish/:id', groupDeviceController.updatePublish);

    app.use('/api/group-device', router);
};
