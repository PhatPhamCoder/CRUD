const tableName = 'tbl_module';
const db = require('../models/connectDb');
const dbs = require('../models/connectDb').promise();
const constantNotify = require('../config/constants');

//getall
exports.getall = async (keySearch, result) => {
    try {
        const orderBy = 'ORDER BY sort DESC';
        let parentId = 0;
        let where = `WHERE parent_id = ${parentId} && publish = 1`;
        let query = `SELECT * FROM ${tableName} ${where} ${orderBy}`;

        db.getConnection((err, conn) => {
            if (err) {
                // console.log(err);
                console.log('Unable to connect to database. Please check again.');
                return result({ msg: err }, null);
            }
            conn.query(query, async (err, dataRes) => {
                if (err) {
                    return result({ msg: constantNotify.ERROR }, null);
                }

                async function dequy(dataRes) {
                    // console.log(dataRes);
                    let i = 0;
                    for (const item of dataRes) {
                        //   console.log("i", i);
                        const parentId = item.id;
                        //   console.log("parentId thứ ", i, parentId);
                        where = `WHERE parent_id = ${parentId} && publish = 1`;
                        query = `SELECT * FROM ${tableName} ${where} ${orderBy}`;

                        const [rows, field] = await dbs.query(query);
                        // console.log(rows);

                        if (rows.length > 0) {
                            // console.log("rows thứ i", i, rows);
                            dataRes[i]['child'] = rows;
                            await dequy(rows);
                        } else {
                            dataRes[i]['child'] = [];
                        }
                        //   console.log("dataResChild thứ ", i, "-----", rows);

                        i++;
                    }
                    return dataRes;
                }
                dequy(dataRes)
                    .then((data) => {
                        return result(null, data);
                    })
                    .catch((err) => {
                        // console.log(err);
                        return result({ msg: err }, null);
                    });
                // return result(null, dequy(dataRes));
            });
            conn.release();
        });
    } catch (error) {
        // console.log(err);
        result({ msg: error }, null);
    }
};

//getallrows
exports.getallrows = async (id, result) => {
    try {
        const query = `SELECT * FROM ${tableName}`;

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
exports.register = (data, result) => {
    const query = `INSERT INTO ${tableName} SET ?`;
    db.query(query, data, (err, dataRes) => {
        if (err) {
            // console.log(err);
            return result({ msg: constantNotify.ERROR }, null);
        }
        result(null, dataRes.insertId);
    });
};

//update
exports.update = async (id, data, result) => {
    try {
        const query = `UPDATE ${tableName} SET parent_id= ?, name =?, link=?,component=?,icon = ?,publish =?,sort=?, updated_at =? WHERE id = ?`;
        db.query(
            query,
            [
                data.parent_id,
                data.name,
                data.link,
                data.component,
                data.icon,
                data.publish,
                data.sort,
                data.updated_at,
                id,
            ],
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

//updatePublish
exports.updatePublish = async (id, publish, result) => {
    try {
        const query = `UPDATE ${tableName} SET publish = ? WHERE id = ?`;

        db.query(query, [publish, id], (err, dataRes) => {
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

// update Sort
exports.updateSort = async (id, sort, result) => {
    try {
        const query = `UPDATE ${tableName} SET sort = ? WHERE id = ?`;

        db.query(query, [sort, id], (err, dataRes) => {
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
