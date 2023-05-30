const router = require("express").Router();
const { body } = require("express-validator");
const customerController = require("../controllers/customer.controller");
const uploadImageUser = require("../middlewares/uploadImageUser");

module.exports = (app) => {
  router.get("/getall", customerController.getall);
  router.get("/getbyid/:id", customerController.getById);
  router.get("/getbyuserid/:id", customerController.getByUsrId);

  router.put(
    "/updatebyid/:id",
    [body("phone", "Trường này là số điện thoại").isLength({ max: 10 })],
    customerController.update,
  );
  router.delete("/delete/:id", customerController.delete);
  router.put("/update-active/:id", customerController.updateActive);
  router.put(
    "/upload-image/:id",
    uploadImageUser.single("image"),
    customerController.uploadImage,
  );

  app.use("/api/customer", router);
};
