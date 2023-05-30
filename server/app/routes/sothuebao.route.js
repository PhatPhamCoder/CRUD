const router = require("express").Router();
const { body } = require("express-validator");
const sothuebaoController = require("../controllers/sothuebao.controller");
const uploadExcel = require("../middlewares/uploadFileExcelSothuebao");

module.exports = (app) => {
  router.get("/getall", sothuebaoController.getall);
  router.get("/getbyid/:id", sothuebaoController.getById);
  router.get("/statistics", sothuebaoController.statistics);
  router.post(
    "/register",
    [body("sothuebao", "Số thuê bao không được bỏ trống").notEmpty()],
    sothuebaoController.register
  );
  router.post(
    "/upload-excel",
    uploadExcel.single("excel"),
    sothuebaoController.uploadExcel
  );
  router.put(
    "/updatebyid/:id",
    [body("sothuebao", "Số thuê bao không được bỏ trống").notEmpty()],
    sothuebaoController.update
  );
  router.delete("/delete/:id", sothuebaoController.delete);
  router.put("/update-status/:id", sothuebaoController.updateStatus);

  app.use("/api/sothuebao", router);
};
