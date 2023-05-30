const db = require("../models/connectDb");
const tableName = "tbl_user";
const constantNotify = require("../config/constants");

//getall
exports.getall = async (dataSearch, offset, limit, result) => {
  try {
    let keyword = "";
    if (dataSearch.keyword) {
      keyword = dataSearch.keyword;
    }
    const select = `${tableName}.id,${tableName}.parent_id,${tableName}.account,${tableName}.active,${tableName}.created_at,${tableName}.updated_at,tbl_role.name`;
    const innerJoin = `${tableName} INNER JOIN tbl_role ON ${tableName}.role_id = tbl_role.id`;
    const count = `SELECT COUNT(*) FROM ${innerJoin}`;
    const orderBy = `ORDER BY ${tableName}.id LIMIT ${offset},${limit}`;
    let where = "";
    let query = `SELECT ${select},(${count}) as total FROM ${innerJoin} ${orderBy}`;
    if (keyword) {
      where = `WHERE account LIKE "%${keyword}%"`;
      query = `SELECT ${select},(${count} ${where}) as total FROM ${innerJoin} ${where} ${orderBy}`;
    }
    db.query(query, (err, dataRes) => {
      if (err) {
        // console.log(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      result(null, dataRes);
    });
  } catch (error) {
    // console.log(error);
    result({ msg: error }, null);
  }
};
