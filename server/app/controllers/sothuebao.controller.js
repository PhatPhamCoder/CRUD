const Sothuebao = require('../models/sothuebao.model');
const sothuebaoServeice = require('../services/sothuebao.service');
const constantNotify = require('../config/constants');
const { validationResult } = require('express-validator');
const db = require('../models/connectDb');
const tableName = 'tbl_sothuebao';
const XLSX = require('xlsx');

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
        sothuebaoServeice.getall(dataSearch, offset, limit, (err, res_) => {
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

//statistics
exports.statistics = (req, res) => {
    try {
        sothuebaoServeice.statistics((err, res_) => {
            if (err) {
                return res.send({ result: false, error: [err] });
            }
            res.send({
                result: true,
                data: [
                    {
                        expired: res_.expired || 0,
                        new: res_.new || 0,
                        using: res_.using || 0,
                        total: parseInt(res_.expired) + parseInt(res_.new) + parseInt(res_.using),
                    },
                ],
            });
        });
    } catch (error) {
        res.send({ result: false, error: [{ msg: error }] });
    }
};

//getbyid
exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        sothuebaoServeice.getById(id, (err, res_) => {
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
        db.query(`SELECT sothuebao FROM ${tableName} WHERE sothuebao = ?`, req.body.sothuebao, (err, dataRes_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ERROR }],
                });
            }
            if (dataRes_?.length > 0) {
                return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ALREADY_EXITS_SOTHUEBAO }],
                });
            }
            const sothuebao = new Sothuebao({
                sothuebao: req.body.sothuebao,
                status: 0,
                created_at: Date.now(),
            });
            delete sothuebao.updated_at;
            sothuebaoServeice.register(sothuebao, (err, res_) => {
                if (err) {
                    return res.send({
                        result: false,
                        error: err,
                    });
                }
                sothuebao.id = res_;
                sothuebao.updated_at = 0;
                res.send({
                    result: true,
                    data: {
                        msg: constantNotify.ADD_DATA_SUCCESS,
                        insertId: res_,
                        newData: sothuebao,
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

//uplaod excel
exports.uploadExcel = async (req, res) => {
    try {
        // console.log(req.file);
        const workBook = XLSX.readFile(req?.file?.path);
        const workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const dataExcel = XLSX.utils.sheet_to_json(workSheet);
        if (dataExcel?.length > 1000) {
            return res.send({
                result: false,
                error: [{ msg: constantNotify.DATALESS1000 }],
            });
        }
        // console.log(dataExcel);
        const queryPromse = [];
        dataExcel?.forEach((item, index) => {
            queryPromse.push(
                new Promise((resolve, reject) => {
                    const query = `SELECT sothuebao FROM ${tableName} WHERE sothuebao LIKE "%${item['Số thuê bao']}%"`;
                    db.query(query, (err, dataRes_) => {
                        if (err) {
                            reject(err);
                        }
                        resolve({ dataRes_, index: ++index });
                    });
                }),
            );
        });
        await Promise.all(queryPromse)
            .then((data) => {
                const sameSothuebao = [];
                data?.forEach((item) => {
                    // console.log(item);
                    // console.log("item.dataRes_", item.dataRes_);

                    if (item.dataRes_?.length > 0) {
                        sameSothuebao.push(item.index);
                    }
                });
                // console.log(sameSothuebao);
                return sameSothuebao;
            })
            .then((data) => {
                // console.log(data);
                if (data?.length > 0) {
                    return res.send({
                        result: false,
                        error: [{ msg: `Số thuê bao có stt ${data.join()} đã được sử dụng` }],
                    });
                }
                let dataSothuebao = [];
                dataExcel?.forEach((item) => {
                    dataSothuebao = [
                        ...dataSothuebao,
                        {
                            sothuebao: item['Số thuê bao'],
                            status: 0,
                            created_at: Date.now(),
                        },
                    ];
                });
                // console.log(dataSothuebao);
                sothuebaoServeice.uploadExcel(dataSothuebao, (err, res_) => {
                    if (err) {
                        return res.send({
                            result: false,
                            error: [err],
                        });
                    }

                    res_?.forEach((item, index) => {
                        dataSothuebao[index].id = item;
                        dataSothuebao[index].updated_at = 0;
                    });
                    res.send({
                        result: true,
                        data: {
                            msg: constantNotify.ADD_DATA_SUCCESS,
                            dataNew: dataSothuebao,
                        },
                    });
                });
            })
            .catch((err) => {
                // console.log(err);
                return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ERROR }],
                });
            });
    } catch (error) {
        // console.log(error);
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
        db.query(`SELECT sothuebao,id FROM ${tableName} WHERE sothuebao = ?`, req.body.sothuebao, (err, dataRes_) => {
            if (err) {
                return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ERROR }],
                });
            }
            if (dataRes_?.length > 0 && parseInt(dataRes_[0]?.id) !== parseInt(req.params.id)) {
                return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ALREADY_EXITS_SOTHUEBAO }],
                });
            }
            const id = req.params.id;
            const sothuebao = new Sothuebao({
                sothuebao: req.body.sothuebao,
                status: req.body.status,
                updated_at: Date.now(),
            });
            delete sothuebao.created_at;
            sothuebaoServeice.update(id, sothuebao, (err, res_) => {
                if (err) {
                    return res.send({
                        result: false,
                        error: err,
                    });
                }
                sothuebao.id = id;
                sothuebao.created_at = 0;
                res.send({
                    result: true,
                    data: {
                        msg: constantNotify.UPDATE_DATA_SUCCESS,
                        id,
                        newData: sothuebao,
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

//delete
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        sothuebaoServeice.delete(id, (err, res_) => {
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

//updateStatus
exports.updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        sothuebaoServeice.updateStatus(id, status, (err, res_) => {
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
