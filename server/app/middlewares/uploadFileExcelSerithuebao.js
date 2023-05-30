const multer = require("multer");
const { existsSync, mkdirSync } = require("node:fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/serithuebao/excel";
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    // console.log(file);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".xlsx");
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
