const express = require("express");
const { muaHangTuTaiKhoan } = require("../controllers/MuaHang/muahang.controller");

const router = express.Router();

router.post("/mua-hang", muaHangTuTaiKhoan );



module.exports = router;