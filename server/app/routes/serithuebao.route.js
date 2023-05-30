const router = require("express").Router();
const { body } = require("express-validator");
const serithuebaoController = require("../controllers/serithuebao.controller");
const uploadExcel = require("../middlewares/uploadFileExcelSerithuebao");
module.exports = (app) => {
  router.get("/getall", serithuebaoController.getall);
  router.get("/getbyid/:id", serithuebaoController.getById);
  router.get("/statistics", serithuebaoController.statistics);

  router.post(
    "/register",
    [
      body("serithuebao", "Số thuê bao không được bỏ trống").notEmpty(),
      body("serithuebao", "Số thuê bao phải là số").isNumeric(),
    ],
    serithuebaoController.register
  );

  router.post(
    "/upload-excel",
    uploadExcel.single("excel"),
    serithuebaoController.uploadExcel
  );
  router.put(
    "/updatebyid/:id",
    [
      body("serithuebao", "Số thuê bao không được bỏ trống").notEmpty(),
      body("serithuebao", "Số thuê bao phải là số").isNumeric(),
    ],
    serithuebaoController.update
  );
  router.delete("/delete/:id", serithuebaoController.delete);
  router.put("/update-status/:id", serithuebaoController.updateStatus);

  app.use("/api/serithuebao", router);
};
