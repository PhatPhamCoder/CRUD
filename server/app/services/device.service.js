const tableName = "tbl_device";
const constantNotify = require("../config/constants");
const db = require("../models/connectDb");

//getall
exports.getall = async (dataSearch, offset, limit, result) => {
  // console.log(dataSearch);
  try {
    const orderBy = `ORDER BY id DESC LIMIT ${offset},${limit}`;
    const innerjoin = `${tableName}  LEFT JOIN tbl_user_device ON ${tableName}.id = tbl_user_device.device_id`;
    const selectCount = `SELECT COUNT(*) FROM ${innerjoin}`;
    const selectRow = `${tableName}.imei,${tableName}.seri,${tableName}.id,${tableName}.created_at,${tableName}.updated_at`;
    let query = `SELECT ${selectRow},(${selectCount})as total FROM ${innerjoin}  ${orderBy}`;
    let where = `WHERE imei LIKE "%${dataSearch.keyword}%" OR seri LIKE "%${dataSearch.keyword}%"`;
    if (dataSearch.keyword && !dataSearch.group && !dataSearch.user_id) {
      query = `SELECT ${selectRow},(${selectCount} ${where})as total FROM ${innerjoin} ${where} ${orderBy}`;
    }
    if (!dataSearch.keyword && dataSearch.group && !dataSearch.user_id) {
      let where = `WHERE group_device_id = ${dataSearch.group}`;
      query = `SELECT ${selectRow},(${selectCount} ${where})as total FROM ${innerjoin} ${where} ${orderBy}`;
    }
    if (!dataSearch.keyword && !dataSearch.group && dataSearch.user_id) {
      let where = `WHERE tbl_user_device.user_id = ${dataSearch.user_id}`;
      query = `SELECT ${selectRow},(${selectCount} ${where})as total FROM ${innerjoin} ${where} ${orderBy}`;
    }
    if (dataSearch.keyword && dataSearch.group && !dataSearch.user_id) {
      let where = `WHERE (group_device_id = ${dataSearch.group} AND imei LIKE "%${dataSearch.keyword}%") OR (group_device_id = ${dataSearch.group} AND seri LIKE "%${dataSearch.keyword}%")`;
      query = `SELECT ${selectRow},(${selectCount} ${where})as total FROM ${innerjoin} ${where} ${orderBy}`;
    }
    if (dataSearch.keyword && !dataSearch.group && dataSearch.user_id) {
      let where = `WHERE (tbl_user_device.user_id = ${dataSearch.user_id} AND imei LIKE "%${dataSearch.keyword}%") OR (tbl_user_device.user_id = ${dataSearch.user_id} AND seri LIKE "%${dataSearch.keyword}%")`;
      query = `SELECT ${selectRow},(${selectCount} ${where})as total FROM ${innerjoin} ${where} ${orderBy}`;
    }
    if (dataSearch.keyword && dataSearch.group && dataSearch.user_id) {
      let where = `WHERE (group_device_id = ${dataSearch.group} AND imei LIKE "%${dataSearch.keyword}%" AND tbl_user_device.user_id = ${dataSearch.user_id}) OR (group_device_id = ${dataSearch.group} AND seri LIKE "%${dataSearch.keyword}%" AND tbl_user_device.user_id = ${dataSearch.user_id})`;
      query = `SELECT ${selectRow},(${selectCount} ${where})as total FROM ${innerjoin} ${where} ${orderBy}`;
    }
    db.query(query, (err, dataRes) => {
      // console.log(err);
      // console.log(query);

      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      // console.log(dataRes);
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

//getById
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
    return result({ msg: error }, null);
  }
};

//register
exports.register = async (data, result) => {
  try {
    db.getConnection((err, conn) => {
      if (err) {
        // console.log(err);
        console.log("conect db fail");
        return result({ msg: err }, null);
      }
      if (data.seri) {
        conn.query(
          `SELECT serithuebao,status FROM tbl_serithuebao WHERE serithuebao LIKE "%${data.seri}%"`,
          (err, dataRes_) => {
            console.log(err);
            if (err) {
              return result({ msg: constantNotify.ERROR }, null);
            }
            if (dataRes_?.length <= 0) {
              return result(
                { param: "seri", msg: constantNotify.NOT_EXITS_SERI },
                null,
              );
            }

            if (dataRes_[0]?.status == 1) {
              return result(
                { param: "seri", msg: constantNotify.USED_SERI },
                null,
              );
            }
            if (dataRes_[0]?.status == 2) {
              return result(
                { param: "seri", msg: constantNotify.ERROR_SERI },
                null,
              );
            }
            let end = false;
            dataRes_?.forEach((item) => {
              if (!(data.seri.length == item.serithuebao.length)) {
                end = true;
              }
            });
            if (end) {
              return result(
                { param: "seri", msg: constantNotify.NOT_EXITS_SERI },
                null,
              );
            }
            const query = `INSERT INTO ${tableName} SET ?`;
            conn.query(query, data, (err, dataRes) => {
              console.log(err);
              if (err) {
                return result({ msg: constantNotify.ERROR }, null);
              }
              result(null, dataRes.insertId);
            });
          },
        );
      } else {
        const query = `INSERT INTO ${tableName} SET ?`;
        conn.query(query, data, (err, dataRes) => {
          console.log(err);
          if (err) {
            return result({ msg: constantNotify.ERROR }, null);
          }
          result(null, dataRes.insertId);
        });
      }
      conn.release();
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
        // console.log(err);
        console.log("conect db fail");
        return result({ msg: err }, null);
      }
      if (data.seri) {
        conn.query(
          `SELECT serithuebao,status FROM tbl_serithuebao WHERE serithuebao = "${data.seri}"`,
          (err, dataRes_) => {
            if (err) {
              return result({ msg: constantNotify.ERROR }, null);
            }
            if (dataRes_?.length <= 0) {
              return result(
                { param: "seri", msg: constantNotify.NOT_EXITS_SERI },
                null,
              );
            }
            if (dataRes_[0]?.status == 1) {
              return result(
                { param: "seri", msg: constantNotify.USED_SERI },
                null,
              );
            }
            if (dataRes_[0]?.status == 2) {
              return result(
                { param: "seri", msg: constantNotify.ERROR_SERI },
                null,
              );
            }

            const query = `UPDATE ${tableName} SET imei= ?,seri =? , note=?,updated_at=? WHERE id = ?`;
            db.query(
              query,
              [data.imei, data.seri, data.note, data.updated_at, id],
              (err, dataRes) => {
                if (err) {
                  return result({ msg: constantNotify.ERROR }, null);
                }
                if (dataRes.affectedRows === 0) {
                  return result({ msg: `id ${constantNotify.NOT_EXITS}` });
                }
                result(null, dataRes.insertId);
              },
            );
          },
        );
      } else {
        const query = `UPDATE ${tableName} SET imei= ?,seri =?, note=?,updated_at=? WHERE id = ?`;
        db.query(
          query,
          [data.imei, data.seri, data.note, data.updated_at, id],
          (err, dataRes) => {
            if (err) {
              return result({ msg: constantNotify.ERROR }, null);
            }
            if (dataRes.affectedRows === 0) {
              return result({ msg: `id ${constantNotify.NOT_EXITS}` });
            }
            result(null, dataRes.insertId);
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
    const query = `DELETE FROM ${tableName} WHERE id = ?`;
    db.query(query, id, (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      if (dataRes.affectedRows === 0) {
        return result({ msg: `id ${constantNotify.NOT_EXITS}` });
      }
      result(null, dataRes.insertId);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

//moveUser
exports.moveUser = async (user_id, data, result) => {
  try {
    // console.log(data);
    db.getConnection(async (err, conn) => {
      if (err) {
        // console.log(err);
        console.log("Unable to connect to database. Please check again.");
        return result({ msg: err }, null);
      }
      const arrPromise = [];
      data.device_id?.forEach((item) => {
        // console.log(item);
        arrPromise.push(
          new Promise((resolve, reject) => {
            conn.query(
              `SELECT id,device_id FROM tbl_user_device WHERE device_id = ?`,
              item.id,
              (err, dataRes_) => {
                if (err) {
                  // console.log(err);
                  return reject(err);
                }
                // console.log(dataRes_);
                const arrInsert = [];
                if (dataRes_.length <= 0) {
                  arrInsert.push(item.id);
                }
                // console.log(arrInsert);
                resolve({
                  result: true,
                  dataRes_,
                  arrInsert,
                });
              },
            );
          }).catch((err) => {
            // console.log(err);
            return { result: false };
          }),
        );
      });
      await Promise.all(arrPromise)
        .then(async (data) => {
          // console.log("data", data[0]?.result);
          if (!data[0]?.result) {
            return { result: false };
          }
          // console.log("ppkpppooewjfrekfkdnfl", data);
          let result_ = true;
          for (const item of data) {
            if (item.dataRes_?.length > 0) {
              // console.log(item);
              await new Promise((resolve, reject) => {
                // console.log(1234);
                const query = `UPDATE tbl_user_device SET user_id = ?,updated_at = ? WHERE device_id = ?`;

                conn.query(
                  query,
                  [user_id, Date.now(), item.dataRes_[0]?.device_id],
                  (err, dataRes) => {
                    // console.log('query10', query);
                    // console.log("user_id", user_id);
                    // console.log('item.id', item.dataRes_[0]?.device_id);
                    if (err) {
                      reject(err);
                    }

                    resolve(dataRes);
                  },
                );
              }).catch(() => {
                result_ = false;
              });
            } else {
              console.log("item.id", item);
              await new Promise((resolve, reject) => {
                const data = {
                  user_id,
                  device_id: item.arrInsert[0],
                  name_device: null,
                  expired_on: null,
                  created_at: Date.now(),
                };
                const query = `INSERT INTO tbl_user_device SET ?`;

                conn.query(query, data, (err, dataRes) => {
                  // console.log('user_id', query);
                  if (err) {
                    return reject(err);
                  }
                  resolve(dataRes);
                });
              }).catch(() => {
                result_ = false;
                return;
              });
            }
          }

          return { result: result_ };
        })

        .then((data) => {
          // console.log("data10321", data);
          if (data.result) {
            return result(null, data);
          } else {
            return result({ msg: constantNotify.ERROR }, null);
          }
        });

      conn.release();
    });
  } catch (error) {
    // console.log(err);
    result({ msg: error }, null);
  }
};

//ChangeExpiredOn
exports.changeExpiredOn = async (data, result) => {
  try {
    db.getConnection((err, conn) => {
      if (err) {
        // console.log(err);
        console.log("Unable to connect to database. Please check again.");
        return result({ msg: err }, null);
      }
      conn.query(
        `SELECT id FROM tbl_user_device WHERE device_id = ?`,
        data.device_id,
        (err, dataRes_) => {
          if (err) {
            // console.log(err);
            return result({ msg: constantNotify.ERROR }, null);
          }
          if (dataRes_?.length > 0) {
            const query = `UPDATE tbl_user_device SET expired_on = ?,updated_at = ? WHERE device_id = ?`;

            db.query(
              query,
              [data.expired_on, Date.now(), data.device_id],
              (err, dataRes) => {
                if (err) {
                  return result({ msg: constantNotify.ERROR }, null);
                }
                if (dataRes.affectedRows === 0) {
                  return result({ msg: `id ${constantNotify.NOT_EXITS}` });
                }
                return result(null, dataRes);
              },
            );
          }
        },
      );
      conn.release();
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

//ChangeExpiredOn
exports.changeGroup = async (id, group_device_id, result) => {
  try {
    const query = `UPDATE ${tableName} SET group_device_id = ?,updated_at = ? WHERE id = ?`;

    db.query(query, [group_device_id, Date.now(), id], (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      if (dataRes.affectedRows === 0) {
        return result({ msg: `id ${constantNotify.NOT_EXITS}` });
      }
      return result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};
