const router = require("express").Router();
const moduleController = require("../controllers/module.controller");
const { body } = require("express-validator");

module.exports = (app) => {
  router.get("/getall", moduleController.getall);
  router.get("/getallrows", moduleController.getallrows);
  router.get("/getbyid/:id", moduleController.getById);
  router.post(
    "/register",
    [body("name", "Tên không được trống").notEmpty()],

    moduleController.register
  );
  router.put(
    "/updatebyid/:id",
    [body("name", "Tên không được trống").notEmpty()],
    moduleController.update
  );
  router.delete("/delete/:id", moduleController.delete);
  router.put("/update-publish/:id", moduleController.updatePublish);
  router.put("/update-sort/:id", moduleController.updateSort);
  app.use("/api/module", router);
};
