const Customer = require("../models/customer.model");
const customerServeice = require("../services/customer.service");
const constantNotify = require("../config/constants");
const { validationResult } = require("express-validator");
const sharp = require("sharp");
const { existsSync, mkdirSync } = require("node:fs");
const db = require("../models/connectDb");
const tableName = "tbl_customer";
const { unlink } = require("node:fs/promises");

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
    customerServeice.getall(dataSearch, offset, limit, (err, res_) => {
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
    customerServeice.getById(id, (err, res_) => {
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
//getByUsrId
exports.getByUsrId = async (req, res) => {
  try {
    const id = req.params.id;
    customerServeice.getByUsrId(id, (err, res_) => {
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

//update
exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ result: false, error: errors.array() });
    }
    const { name, phone, email, address, web_page, active } = req.body;
    const id = req.params.id;
    if (email) {
      db.query(
        `SELECT id,email FROM ${tableName} WHERE email = ?`,
        email,
        (err, dataRes_) => {
          if (err) {
            // console.log(err);
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }
          // console.log(dataRes_);
          if (
            dataRes_.length > 0 &&
            parseInt(dataRes_[0]?.id) !== parseInt(id)
          ) {
            return res.send({
              result: false,
              error: [
                {
                  param: "email",
                  msg: `Email ${constantNotify.ALREADY_EXITS}`,
                },
              ],
            });
          }
          const customer = new Customer({
            name: name ? name : null,
            phone: phone ? phone : null,
            email: email ? email : null,
            address: address ? address : null,
            web_page: web_page ? web_page : null,
            active: !active ? 0 : 1,
            updated_at: Date.now(),
          });
          delete customer.created_at;
          customerServeice.update(id, customer, (err, res_) => {
            if (err) {
              return res.send({
                result: false,
                error: err,
              });
            }
            customer.id = id;
            customer.created_at = 0;
            res.send({
              result: true,
              data: {
                msg: constantNotify.UPDATE_DATA_SUCCESS,
                id,
                newData: customer,
              },
            });
          });
        },
      );
    } else {
      const customer = new Customer({
        name: name ? name : null,
        phone: phone ? phone : null,
        email: email ? email : null,
        address: address ? address : null,
        web_page: web_page ? web_page : null,
        active: !active ? 0 : 1,
        updated_at: Date.now(),
      });
      delete customer.created_at;
      customerServeice.update(id, customer, (err, res_) => {
        if (err) {
          return res.send({
            result: false,
            error: err,
          });
        }
        customer.id = id;
        customer.created_at = 0;
        res.send({
          result: true,
          data: {
            msg: constantNotify.UPDATE_DATA_SUCCESS,
            id,
            newData: customer,
          },
        });
      });
    }
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
    const dir = "uploads/customer/image";
    const thumb = "uploads/customer/thumb";
    if (!existsSync(thumb)) {
      mkdirSync(thumb, { recursive: true });
    }
    db.query(
      `SELECT image FROM ${tableName} WHERE id =?`,
      id,
      async (err, dataRes_) => {
        if (err) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ERROR }],
          });
        }
        if (!existsSync(dir) && !existsSync(thumb)) {
          mkdirSync(dir, { recursive: true });
          mkdirSync(thumb, { recursive: true });
        }
        if (dataRes_[0]?.image) {
          if (
            existsSync(`${dir}/${dataRes_[0]?.image}`) &&
            existsSync(`${thumb}/${dataRes_[0]?.image}`)
          ) {
            await unlink(`${dir}/${dataRes_[0]?.image}`);
            await unlink(`${thumb}/${dataRes_[0]?.image}`);
          }
        }
        customerServeice.delete(id, (err, res_) => {
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
      },
    );
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

//updateActive
exports.updateActive = async (req, res) => {
  try {
    const id = req.params.id;
    const active = !req.body.active ? 0 : 1;
    customerServeice.updateActive(id, active, (err, res_) => {
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

//upload image
exports.uploadImage = async (req, res) => {
  try {
    const id = req.params.id;
    const dir = "uploads/customer/image";
    const thumb = "uploads/customer/thumb";
    if (!existsSync(thumb)) {
      mkdirSync(thumb, { recursive: true });
    }

    db.query(
      `SELECT image FROM ${tableName} WHERE id =?`,
      id,
      async (err, dataRes_) => {
        if (err) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ERROR }],
          });
        }
        if (!existsSync(dir) && !existsSync(thumb)) {
          mkdirSync(dir, { recursive: true });
          mkdirSync(thumb, { recursive: true });
        }
        if (dataRes_[0]?.image) {
          if (
            existsSync(`${dir}/${dataRes_[0]?.image}`) &&
            existsSync(`${thumb}/${dataRes_[0]?.image}`)
          ) {
            await unlink(`${dir}/${dataRes_[0]?.image}`);
            await unlink(`${thumb}/${dataRes_[0]?.image}`);
          }
        }
        sharp(`${req?.file?.path}`)
          .resize(120, 120)
          .toFile(`${thumb}/${req?.file?.filename}`, (err) => {
            if (err) {
              return res.send({ result: false, error: [{ msg: err }] });
            }
            const customer = new Customer({
              image: req?.file?.filename,
              updated_at: Date.now(),
            });
            delete customer.created_at;
            customerServeice.uploadImage(id, customer, (err, res_) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [err],
                });
              }
              customer.id = id;
              customer.created_at = 0;
              return res.send({
                result: true,
                data: {
                  msg: constantNotify.UPDATE_DATA_SUCCESS,
                  id,
                  newData: customer,
                },
              });
            });
          });
      },
    );
  } catch (error) {
    res.send({ result: false, error: [{ msg: error }] });
  }
};
