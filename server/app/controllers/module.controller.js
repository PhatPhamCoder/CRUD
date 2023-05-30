const { validationResult } = require('express-validator');
const moduleService = require('../services/module.service');
const Module = require('../models/module.model');
const constantNotify = require('../config/constants');

//getall
exports.getall = async (req, res) => {
    try {
        const dataSearch = req.query;

        moduleService.getall(dataSearch, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: [err],
                });
            }

            res.send({
                result: true,
                data: res_,
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

//getallrow
exports.getallrows = async (req, res) => {
    try {
        moduleService.getallrows((err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: [err],
                });
            }

            res.send({
                result: true,
                data: res_,
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

//getbyid
exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        moduleService.getById(id, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: err,
                });
            }

            res.send({
                result: true,
                data: res_,
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

exports.register = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ result: false, error: errors.array() });
        }
        const { parent_id, name, link, component, icon, publish, sort } = req.body;
        const module = new Module({
            parent_id: parent_id ? parent_id : 0,
            name,
            link: link ? link : null,
            component: component ? component : null,
            icon: icon ? icon : null,
            publish: !publish ? false : true,
            sort: !sort ? 0 : sort,
            created_at: Date.now(),
        });
        delete module.updated_at;
        moduleService.register(module, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: [err],
                });
            }
            module.id = res_;
            module.updated_at = 0;
            res.send({
                result: true,
                data: {
                    msg: constantNotify.ADD_DATA_SUCCESS,
                    inserID: res_,
                    newData: module,
                },
            });
        });
    } catch (error) {
        res.send({ result: false, error: [{ msg: error }] });
    }
};

//update
exports.update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ result: false, error: errors.array() });
        }
        const { parent_id, name, link, component, icon, publish, sort } = req.body;
        const id = req.params.id;
        const module = new Module({
            parent_id: parent_id ? parent_id : 0,
            name,
            link: link ? link : null,
            component: component ? component : null,
            icon: icon ? icon : null,
            publish: !publish ? false : true,
            sort: !sort ? 0 : sort,
            updated_at: Date.now(),
        });
        delete module.created_at;
        moduleService.update(id, module, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: err,
                });
            }
            module.id = id;
            module.created_at = 0;
            res.send({
                result: true,
                data: {
                    msg: constantNotify.UPDATE_DATA_SUCCESS,
                    id,
                    newData: module,
                },
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

//delete
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        moduleService.delete(id, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: err,
                });
            }

            res.send({
                result: true,
                data: { msg: constantNotify.DELETE_DATA_SUCCESS },
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

//updatePublish
exports.updatePublish = async (req, res) => {
    try {
        const id = req.params.id;
        const publish = !req.body.publish ? 0 : 1;
        moduleService.updatePublish(id, publish, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: err,
                });
            }

            res.send({
                result: true,
                data: { msg: constantNotify.UPDATE_DATA_SUCCESS },
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

//sort
exports.updateSort = async (req, res) => {
    try {
        const id = req.params.id;
        const sort = req.body.sort;
        moduleService.updateSort(id, sort, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: err,
                });
            }

            res.send({
                result: true,
                data: { msg: constantNotify.UPDATE_DATA_SUCCESS },
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};
