const tableName = 'tbl_feedback';
const db = require('../models/connectDb');
const constantNotify = require('../config/constants');

//getall
exports.getall = async (keySearch, offset, limit, result) => {
    try {
        let keyword = '';
        const selectCount = `SELECT COUNT(*) FROM ${tableName}`;
        const orderBy = `ORDER BY id DESC LIMIT ${offset},${limit}`;
        let where = '';
        let query = `SELECT *, (${selectCount}) as total FROM ${tableName} ${orderBy}`;
        if (keySearch.keyword) {
            keyword = keySearch.keyword;
            where = `WHERE email LIKE "%${keyword}%" OR phone LIKE "%${keyword}%"`;
            query = `SELECT *, (${selectCount} ${where}) as total FROM ${tableName} ${where} ${orderBy}`;
        }

        db.query(query, (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

//getByID
exports.getById = async (id, result) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE id = ?`;

        db.query(query, id, (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

//register
exports.register = async (data, result) => {
    try {
        const query = `INSERT INTO ${tableName} SET ?`;
        db.query(query, data, (err, dataRes) => {
            if (err) {
                // console.log(err);
                return result({ msg: constantNotify.ADD_DATA_FAILED }, null);
            }
            // console.log(dataRes);
            result(null, dataRes.insertId);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

//delete
exports.delete = async (id, result) => {
    try {
        const query = `DELETE FROM ${tableName} WHERE id =?`;

        db.query(query, id, (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            if (dataRes.affectedRows === 0) {
                return result({ msg: `id ${constantNotify.NOT_EXITS}` });
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

//updateStatus
exports.updateStatus = async (id, status, result) => {
    try {
        const query = `UPDATE ${tableName} SET status = ? WHERE id = ?`;

        db.query(query, [status, id], (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            if (dataRes.affectedRows === 0) {
                return result({ msg: `id ${constantNotify.NOT_EXITS}` });
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};
