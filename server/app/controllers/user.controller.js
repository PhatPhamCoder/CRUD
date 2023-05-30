const userService = require("../services/user.service");

//getall
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
    userService.getall(dataSearch, offset, limit, (err, res_) => {
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
