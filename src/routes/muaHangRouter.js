const express = require("express");
const { muaHangTuTaiKhoan, getAllOrder } = require("../controllers/MuaHang/muahang.controller");

const router = express.Router();

router.post("/mua-hang", muaHangTuTaiKhoan );
router.get("/get-order", getAllOrder );

module.exports = router;