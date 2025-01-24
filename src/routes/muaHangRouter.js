const express = require("express");
const { muaHangTuTaiKhoan, getAllOrder, getAllOrderThongBao } = require("../controllers/MuaHang/muahang.controller");

const router = express.Router();

router.post("/mua-hang", muaHangTuTaiKhoan );
router.get("/get-order", getAllOrder );
router.get("/get-all-order", getAllOrderThongBao );

module.exports = router;