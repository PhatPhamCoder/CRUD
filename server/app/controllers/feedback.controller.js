const Feedback = require("../models/feedback.model");
const feedbackServeice = require("../services/feedback.service");
const constantNotify = require("../config/constants");
const { validationResult } = require("express-validator");
const db = require("../models/connectDb");
const tableName = "tbl_feedback";
const regex = require("../ultils/regex");

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
    feedbackServeice.getall(dataSearch, offset, limit, (err, res_) => {
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
    feedbackServeice.getById(id, (err, res_) => {
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
    if (req.body.email) {
      if (!regex.regexEmail.test(req.body.email)) {
        return res.send({
          result: false,
          error: [
            {
              param: "email",
              msg: "Trường này là email",
            },
          ],
        });
      }
    }

    const feedback = new Feedback({
      msg: req.body.msg,
      email: req.body.email,
      phone: req.body.phone,
      status: 0,
      created_at: Date.now(),
    });
    delete feedback.updated_at;
    feedbackServeice.register(feedback, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: err,
        });
      }
      feedback.id = res_;
      feedback.updated_at = 0;
      res.send({
        result: true,
        data: {
          msg: constantNotify.ADD_DATA_SUCCESS,
          insertId: res_,
          newData: feedback,
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
    feedbackServeice.delete(id, (err, res_) => {
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
    const Status = 1;
    feedbackServeice.updateStatus(id, Status, (err, res_) => {
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
