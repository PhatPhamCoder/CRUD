const GroupDevice = require('../models/groupDevice.model');
const groupDeviceServeice = require('../services/groupDevice.service');
const constantNotify = require('../config/constants');
const { validationResult } = require('express-validator');
const db = require('../models/connectDb');
const tableName = 'tbl_group_device';

///getall
exports.getall = async (req, res) => {
    try {
        const dataSearch = req.query;
        let offset = 0;
        let limit = 10;
        if (dataSearch.offset) {
            offset = dataSearch.offset;
        }
        if (dataSearch.limit) {
            limit = dataSearch.limit;
        }
        groupDeviceServeice.getall(dataSearch, offset, limit, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: [err],
                });
            }
            const totalPage = Math.ceil(res_[0]?.total / limit);

            res_.forEach((item) => {
                delete item.total;
            });
            res.send({
                result: true,
                totalPage: totalPage ? totalPage : 0,
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
        groupDeviceServeice.getById(id, (err, res_) => {
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

//register
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ result: false, error: errors.array() });
        }
        db.query(`SELECT name FROM ${tableName} WHERE name LIKE "%${req.body.name}%"`, (err, dataRes_) => {
            // console.log(dataRes_);
            if (err) {
                return res.send({ result: false, error: [{ msg: constantNotify.ERROR }] });
            }
            if (dataRes_?.length > 0) {
                return res.send({ result: false, error: [{ msg: `Nhóm thiết bị ${constantNotify.ALREADY_EXITS}` }] });
            }
            const groupDevice = new GroupDevice({
                name: req.body.name,
                publish: !req.body.publish ? 0 : 1,
                created_at: Date.now(),
            });
            delete groupDevice.updated_at;
            groupDeviceServeice.register(groupDevice, (err, res_) => {
                if (err) {
                    return res.send({
                        result: false,
                        error: err,
                    });
                }
                groupDevice.id = res_;
                groupDevice.updated_at = 0;
                res.send({
                    result: true,
                    data: {
                        msg: constantNotify.ADD_DATA_SUCCESS,
                        insertId: res_,
                        newData: groupDevice,
                    },
                });
            });
        });
    } catch (error) {
        res.send({
            result: false,
            error: [{ msg: error }],
        });
    }
};

//update
exports.update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ result: false, error: errors.array() });
        }
        const id = req.params.id;
        const groupDevice = new GroupDevice({
            name: req.body.name,
            publish: !req.body.publish ? 0 : 1,
            updated_at: Date.now(),
        });
        delete groupDevice.created_at;
        groupDeviceServeice.update(id, groupDevice, (err, res_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: err,
                });
            }
            groupDevice.id = id;
            groupDevice.created_at = 0;
            res.send({
                result: true,
                data: {
                    msg: constantNotify.UPDATE_DATA_SUCCESS,
                    id,
                    newData: groupDevice,
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
        groupDeviceServeice.delete(id, (err, res_) => {
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
        groupDeviceServeice.updatePublish(id, publish, (err, res_) => {
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
