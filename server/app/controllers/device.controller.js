const { validationResult } = require("express-validator");
const Device = require("../models/device.model");
const deviceService = require("../services/device.service");
const constantNotify = require("../config/constants");
const db = require("../models/connectDb");
const tableName = "tbl_device";

//getall
exports.getall = async (req, res) => {
  try {
    const dataSearch = req.query;
    // console.log(dataSearch);
    let offset = 0;
    let limit = 10;
    if (dataSearch.offset) {
      offset = dataSearch.offset;
    }
    if (dataSearch.limit) {
      limit = dataSearch.limit;
    }
    deviceService.getall(dataSearch, offset, limit, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      const totalPage = Math.ceil(res_[0]?.total / limit);
      // console.log(totalPage);
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
    res.send({ result: false, error: [{ msg: error }] });
  }
};

//getbyid
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    deviceService.getById(id, (err, res_) => {
      if (err) {
        return res.send({ result: false, error: [err] });
      }
      res.send({
        result: true,
        data: res_,
      });
    });
  } catch (error) {
    res.send({ result: false, error: [{ msg: error }] });
  }
};

//register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ result: false, error: [errors] });
    }
    const { imei, seri, group_device_id, note } = req.body;
    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }
      conn.query(
        `SELECT imei FROM ${tableName} WHERE imei LIKE "%${imei}%"`,
        imei,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }
          if (dataRes?.length > 0) {
            return res.send({
              result: false,
              error: [{ param: "imei", msg: constantNotify.USED_IMEI }],
            });
          }
          const device = new Device({
            imei,
            seri: seri ? seri : null,
            group_device_id,
            note: note ? note : null,
            created_at: Date.now(),
          });
          delete device.updated_at;
          deviceService.register(device, (err, res_) => {
            if (err) {
              return res.send({ result: false, error: [err] });
            }

            device.id = res_;

            device.updated_at = 0;
            res.send({
              result: true,
              data: {
                msg: constantNotify.ADD_DATA_SUCCESS,
                insertId: res_,
                newData: device,
              },
            });
          });
        },
      );

      conn.release();
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
      return res.send({ result: false, error: [errors] });
    }
    const { imei, seri, note } = req.body;
    const id = req.params.id;
    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }
      conn.query(
        `SELECT id, imei FROM ${tableName} WHERE imei LIKE "%${imei}%"`,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }
          if (
            dataRes.length !== 0 &&
            parseInt(dataRes[0]?.id) !== parseInt(id)
          ) {
            return res.send({
              result: false,
              error: [{ param: "imei", msg: constantNotify.USED_IMEI }],
            });
          }
          const device = new Device({
            imei,
            seri: seri ? seri : null,
            note: note ? note : null,
            updated_at: Date.now(),
          });
          delete device.created_at;
          deviceService.update(id, device, (err, res_) => {
            if (err) {
              return res.send({ result: false, error: [err] });
            }
            conn.query(
              `SELECT name FROM tbl_group_device WHERE id = ?`,
              (err, dataRes) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ERROR }],
                  });
                }

                device.id = id;
                device.name = dataRes[0]?.name;
                device.created_at = 0;
                res.send({
                  result: true,
                  data: {
                    msg: constantNotify.ADD_DATA_SUCCESS,
                    insertId: id,
                    newData: device,
                  },
                });
              },
            );
          });
        },
      );
      conn.release();
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
    deviceService.delete(id, (err, res_) => {
      if (err) {
        return res.send({ result: false, error: [err] });
      }
      res.send({
        result: true,
        data: { msg: constantNotify.DELETE_DATA_SUCCESS },
      });
    });
  } catch (error) {
    res.send({ result: false, error: [{ msg: error }] });
  }
};

//moveUser
exports.moveUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.send({ result: false, error: errors.array() });
    }
    const { user_id, imei } = req.body;
    // console.log(imei.split('\n'));
    const arrImei = imei.split("\n");
    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }
      const arrPromise = [];
      arrImei?.forEach((item, i) => {
        if (item) {
          // console.log('item', item);
          arrPromise.push(
            new Promise((resolve, reject) => {
              conn.query(
                `SELECT id,imei FROM ${tableName} WHERE imei = ${item}`,
                (err, dataRes_) => {
                  if (err) {
                    // console.log(err);
                    reject(err);
                  }
                  resolve({ dataRes_, index: ++i });
                },
              );
            }),
          );
        }
      });
      Promise.all(arrPromise)
        .then((data) => {
          // console.log(data);
          const arrIndex = [];
          const arrData = [];
          data?.forEach((item) => {
            if (item.dataRes_?.length <= 0) {
              arrIndex.push(item.index);
            } else {
              arrData.push(item.dataRes_[0]);
            }
          });
          if (arrIndex?.length > 0) {
            return res.send({
              result: false,
              error: [
                {
                  param: "imei",
                  msg: `IMEI hàng thứ ${arrIndex.join(",")} không tồn tại`,
                },
              ],
            });
          } else {
            const dataMove = { device_id: arrData };
            // console.log('arrData', dataMove);

            deviceService.moveUser(user_id, dataMove, (err, res_) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [err],
                });
              }

              return res.send({
                result: true,
                data: { msg: constantNotify.UPDATE_DATA_SUCCESS },
              });
            });
          }
        })
        .catch((err) => {
          return res.send({
            result: false,
            error: [err],
          });
        });
      conn.release();
    });
  } catch (error) {
    // console.log(error);
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

//ChangeExpiredOn
exports.changeExpiredOn = async (req, res) => {
  try {
    const { expired_on, imei } = req.body;

    db.query(
      `SELECT id,imei FROM ${tableName} WHERE imei = ${imei}`,
      (err, dataRes_) => {
        // console.log(err);
        if (err) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ERROR }],
          });
        }
        // console.log(dataRes_);
        if (dataRes_?.length > 0) {
          const data = {
            expired_on,
            device_id: dataRes_[0]?.id,
          };
          deviceService.changeExpiredOn(data, (err, res_) => {
            if (err) {
              return res.send({
                result: false,
                error: err,
              });
            }

            return res.send({
              result: true,
              data: { msg: constantNotify.UPDATE_DATA_SUCCESS },
            });
          });
        } else {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.NOT_EXITS_IMEI }],
          });
        }
      },
    );
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

//ChangeGroup
exports.changeGroup = async (req, res) => {
  try {
    const { group_device_id } = req.body;
    const id = req.params.id;

    deviceService.changeGroup(id, group_device_id, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: err,
        });
      }

      return res.send({
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
