const tableName = 'tbl_customer';
const db = require('../models/connectDb');
const constantNotify = require('../config/constants');

//getall
exports.getall = async (keySearch, offset, limit, result) => {
    try {
        let keyword = '';
        const innerjoin = `${tableName} INNER JOIN tbl_user ON ${tableName}.user_id = tbl_user.id INNER JOIN tbl_role ON tbl_user.role_id = tbl_role.id`;
        const selectTable = `${tableName}.id,${tableName}.code,${tableName}.name,${tableName}.phone,${tableName}.email,${tableName}.address,${tableName}.active,${tableName}.web_page,${tableName}.image,${tableName}.created_at,${tableName}.updated_at,tbl_user.account,tbl_role.name as name_role`;
        const selectCount = `SELECT COUNT(*) FROM ${innerjoin}`;
        const orderBy = `ORDER BY ${tableName}.id DESC LIMIT ${offset},${limit}`;
        let where = '';
        let query = `SELECT ${selectTable}, (${selectCount}) as total FROM ${innerjoin} ${orderBy}`;
        if (keySearch.keyword) {
            keyword = keySearch.keyword;
            where = `WHERE ${tableName}.name LIKE "%${keyword}%" OR ${tableName}.phone LIKE "%${keyword}%"`;
            query = `SELECT ${selectTable}, (${selectCount} ${where}) as total FROM ${innerjoin} ${where} ${orderBy}`;
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

//getByUsrId
exports.getByUsrId = async (id, result) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE user_id = ?`;

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

//update
exports.update = async (id, data, result) => {
    try {
        db.getConnection((err, conn) => {
            if (err) {
                if (err) {
                    console.log('connect db fail');
                    return res.send({
                        result: false,
                        error: [{ msg: constantNotify.ERROR }],
                    });
                }
            }
            // console.log(data.phone);
            if (data.phone) {
                // console.log("có phone");
                conn.query(`SELECT id,phone FROM ${tableName} WHERE phone = ?`, data.phone, (err, dataRes_) => {
                    if (err) {
                        return res.send({
                            result: false,
                            error: [{ msg: constantNotify.ERROR }],
                        });
                    }
                    if (dataRes_.length > 0 && parseInt(dataRes_[0]?.id) !== parseInt(id)) {
                        return result({ msg: `Số điện thoại ${constantNotify.ALREADY_EXITS}` }, null);
                    }
                    const query = `UPDATE ${tableName} SET name =?,phone =?, email= ?, address =?, active = ?, web_page = ?,  updated_at =? WHERE id = ?`;
                    conn.query(
                        query,
                        [
                            data.name,
                            data.phone,
                            data.email,
                            data.address,
                            data.active,
                            data.web_page,
                            data.updated_at,
                            id,
                        ],
                        (err, dataRes) => {
                            if (err) {
                                // console.log(err);
                                return result({ msg: constantNotify.ADD_DATA_FAILED }, null);
                            }
                            if (dataRes.affectedRows === 0) {
                                return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
                            }
                            result(null, dataRes);
                        },
                    );
                });
            } else {
                const query = `UPDATE ${tableName} SET name =?,phone =?, email= ?, address =?, active = ?, web_page = ?, updated_at =? WHERE id = ?`;
                db.query(
                    query,
                    [data.name, data.phone, data.email, data.address, data.active, data.web_page, data.updated_at, id],
                    (err, dataRes) => {
                        if (err) {
                            return result({ msg: constantNotify.ADD_DATA_FAILED }, null);
                        }
                        if (dataRes.affectedRows === 0) {
                            return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
                        }
                        result(null, dataRes);
                    },
                );
            }
            conn.release();
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

//updateActive
exports.updateActive = async (id, active, result) => {
    try {
        const query = `UPDATE ${tableName} SET active = ? WHERE id = ?`;

        db.query(query, [active, id], (err, dataRes) => {
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

//uploadImage
exports.uploadImage = async (id, data, result) => {
    try {
        const query = `UPDATE ${tableName} SET image =? WHERE user_id = ?`;
        db.query(query, [data.image, id], (err, dataRes) => {
            if (err) {
                // console.log(err);
                return result({ msg: constantNotify.ERROR }, null);
            }
            if (dataRes.affectedRows === 0) {
                return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
            }
            return result(null, dataRes.insertId);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};
