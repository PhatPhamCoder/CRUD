const router = require("express").Router();
const { body } = require("express-validator");
const feedbackController = require("../controllers/feedback.controller");

module.exports = (app) => {
  router.post("/register", feedbackController.register);

  router.get("/getall", feedbackController.getall);
  router.get("/getbyid/:id", feedbackController.getById);

  router.delete("/delete/:id", feedbackController.delete);
  router.put("/update-status/:id", feedbackController.updateStatus);

  app.use("/api/feedback", router);
};
