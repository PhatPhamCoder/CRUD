const tableName = "tbl_serithuebao";
const db = require("../models/connectDb");
const constantNotify = require("../config/constants");

//getall
exports.getall = async (keySearch, offset, limit, result) => {
  try {
    let keyword = "";
    let status = "";
    const selectCount = `SELECT COUNT(*) FROM ${tableName}`;
    const orderBy = `ORDER BY id DESC LIMIT ${offset},${limit}`;
    let where = "";
    let query = `SELECT *, (${selectCount}) as total FROM ${tableName} ${orderBy}`;
    if (!keySearch.status && keySearch.keyword) {
      keyword = keySearch.keyword;
      where = `WHERE serithuebao LIKE "%${keyword}%"`;
      query = `SELECT *, (${selectCount} ${where}) as total FROM ${tableName} ${where} ${orderBy}`;
    }
    if (keySearch.status && !keySearch.keyword) {
      status = keySearch.status;
      where = `WHERE status LIKE "%${status}%"`;
      query = `SELECT *,(${selectCount} ${where}) as total FROM ${tableName} ${where} ${orderBy}`;
    }
    if (keySearch.status && keySearch.keyword) {
      keyword = keySearch.keyword;
      status = keySearch.status;
      where = `WHERE status LIKE "%${status}%" AND serithuebao LIKE "%${keyword}%"`;
      query = `SELECT *,(${selectCount} ${where}) as total FROM ${tableName} ${where} ${orderBy}`;
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
    const query = `SELECT id,serithuebao,status,created_at,updated_at FROM ${tableName} WHERE id = ?`;

    db.query(query, id, (err, dataRes) => {
      if (err) {
        // console.log(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

//statistics
exports.statistics = async (result) => {
  try {
    const query0 = `SELECT COUNT(*) as newSerithuebao  FROM ${tableName} WHERE status = 0`;
    const newSerithuebao = new Promise((resolve, reject) => {
      db.query(query0, (err, dataRes0) => {
        if (err) {
          reject(err);
        }
        resolve(dataRes0);
      });
    });
    const query1 = `SELECT COUNT(*) as usingSerithuebao FROM ${tableName} WHERE status = 1`;
    const usingSerithuebao = new Promise((resolve, reject) => {
      db.query(query1, (err, dataRes1) => {
        if (err) {
          reject(err);
        }
        resolve(dataRes1);
      });
    });
    const query2 = `SELECT COUNT(*) as errorSerithuebao FROM ${tableName} WHERE status = 2`;
    const errorSerithuebao = new Promise((resolve, reject) => {
      db.query(query2, (err, dataRes2) => {
        if (err) {
          reject(err);
        }
        resolve(dataRes2);
      });
    });
    await Promise.all([newSerithuebao, usingSerithuebao, errorSerithuebao])
      .then(
        ([
          resultNewSerithuebao,
          resultUsingSerithuebao,
          resultErrorSerithuebao,
        ]) => {
          result(null, {
            new: resultNewSerithuebao[0]?.newSerithuebao,
            using: resultUsingSerithuebao[0]?.usingSerithuebao,
            error: resultErrorSerithuebao[0]?.errorSerithuebao,
          });
        },
      )
      .catch((err) => {
        result({ msg: constantNotify.ERROR }, null);
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

//upload excel
exports.uploadExcel = async (data, result) => {
  try {
    db.getConnection(async (err, conn) => {
      if (err) {
        console.log("connect DB fail");
        result({ msg: constantNotify }, null);
      }
      const insertPromises = [];
      for (const value of data) {
        insertPromises.push(
          new Promise((resolve, reject) => {
            conn.query(
              `INSERT INTO ${tableName} SET ?`,
              value,
              (err, dataRes) => {
                if (err) {
                  reject(err);
                } else {
                  //   console.log(`Inserted ID: ${dataRes.insertId}`);
                  resolve(dataRes.insertId);
                }
              },
            );
          }),
        );
      }
      await Promise.all(insertPromises)
        .then((data) => {
          result(null, data);
        })
        .catch((err) => {
          result({ msg: constantNotify.ERROR }, null);
        });

      conn.release();
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

//update
exports.update = async (id, data, result) => {
  try {
    const query = `UPDATE ${tableName} SET serithuebao =?,status =?, updated_at =? WHERE id = ?`;
    db.query(
      query,
      [data.serithuebao, data.status, data.updated_at, id],
      (err, dataRes) => {
        if (err) {
          // console.log(err);
          return result({ msg: constantNotify.UPDATE_DATA_FAILED }, null);
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
