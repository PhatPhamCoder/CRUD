const Serithuebao = require("../models/serithuebao.model");
const serithuebaoServeice = require("../services/serithuebao.service");
const constantNotify = require("../config/constants");
const { validationResult } = require("express-validator");
const db = require("../models/connectDb");
const tableName = "tbl_serithuebao";
const XLSX = require("xlsx");

///getall
exports.getall = async (req, res) => {
  try {
    const dataSearch = req.query;
    let offset = 0;
    let limit = 10;
    if (dataSearch.offset) {
      // console.log(dataSearch.offset);
      offset = dataSearch.offset;
    }
    if (dataSearch.limit) {
      limit = dataSearch.limit;
    }
    serithuebaoServeice.getall(dataSearch, offset, limit, (err, res_) => {
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
    serithuebaoServeice.getById(id, (err, res_) => {
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

//statistics
exports.statistics = (req, res) => {
  try {
    serithuebaoServeice.statistics((err, res_) => {
      if (err) {
        return res.send({ result: false, error: [err] });
      }
      res.send({
        result: true,
        data: [
          {
            error: res_.error || 0,
            new: res_.new || 0,
            using: res_.using || 0,
            total:
              parseInt(res_.error) + parseInt(res_.new) + parseInt(res_.using),
          },
        ],
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
      return res.send({ result: false, error: errors.array() });
    }
    db.query(
      `SELECT serithuebao FROM ${tableName} WHERE serithuebao = ?`,
      req.body.serithuebao,
      (err, dataRes_) => {
        if (err) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ERROR }],
          });
        }
        // console.log(dataRes_);
        if (dataRes_?.length > 0) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ALREADY_EXITS_SERI }],
          });
        }
        const serithuebao = new Serithuebao({
          serithuebao: req.body.serithuebao,
          status: 0,
          created_at: Date.now(),
        });
        delete serithuebao.updated_at;
        serithuebaoServeice.register(serithuebao, (err, res_) => {
          if (err) {
            return res.send({
              result: false,
              error: err,
            });
          }
          serithuebao.id = res_;
          serithuebao.updated_at = 0;
          res.send({
            result: true,
            data: {
              msg: constantNotify.ADD_DATA_SUCCESS,
              insertId: res_,
              newData: serithuebao,
            },
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
          const query = `SELECT serithuebao FROM ${tableName} WHERE serithuebao LIKE "%${item["Seri thuê bao"]}%"`;
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
        const sameSerithuebao = [];
        data?.forEach((item) => {
          // console.log(item);
          // console.log("item.dataRes_", item.dataRes_);

          if (item.dataRes_?.length > 0) {
            sameSerithuebao.push(item.index);
          }
        });
        // console.log(sameSerithuebao);
        return sameSerithuebao;
      })
      .then((data) => {
        // console.log(data);
        if (data?.length > 0) {
          return res.send({
            result: false,
            error: [
              { msg: `Seri thuê bao có stt ${data.join()} đã được sử dụng` },
            ],
          });
        }
        let dataSerithuebao = [];
        dataExcel?.forEach((item) => {
          dataSerithuebao = [
            ...dataSerithuebao,
            {
              serithuebao: item["Seri thuê bao"],
              status: 0,
              created_at: Date.now(),
            },
          ];
        });
        // console.log(dataSerithuebao);
        serithuebaoServeice.uploadExcel(dataSerithuebao, (err, res_) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }

          res_?.forEach((item, index) => {
            dataSerithuebao[index].id = item;
          });
          res.send({
            result: true,
            data: {
              msg: constantNotify.ADD_DATA_SUCCESS,
              dataNew: dataSerithuebao,
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
    db.query(
      `SELECT serithuebao,id FROM ${tableName} WHERE serithuebao = ?`,
      req.body.serithuebao,
      (err, dataRes_) => {
        if (err) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ERROR }],
          });
        }
        if (
          dataRes_?.length > 0 &&
          parseInt(dataRes_[0]?.id) !== parseInt(req.params.id)
        ) {
          return res.send({
            result: false,
            error: [{ msg: constantNotify.ALREADY_EXITS_SERI }],
          });
        }
        const id = req.params.id;
        const serithuebao = new Serithuebao({
          serithuebao: req.body.serithuebao,
          status: req.body.status,
          updated_at: Date.now(),
        });
        delete serithuebao.created_at;
        serithuebaoServeice.update(id, serithuebao, (err, res_) => {
          if (err) {
            return res.send({
              result: false,
              error: err,
            });
          }
          serithuebao.id = id;
          serithuebao.created_at = 0;
          res.send({
            result: true,
            data: {
              msg: constantNotify.UPDATE_DATA_SUCCESS,
              id,
              newData: serithuebao,
            },
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

//delete
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    serithuebaoServeice.delete(id, (err, res_) => {
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
    serithuebaoServeice.updateStatus(id, status, (err, res_) => {
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
