const express = require("express");
const {
    loginAccKH,
    registerAccKH,
    logoutKH,
    xacThucOTP,
    quenMatKhauKH,
} = require("../controllers/Login/login.kh.controller");
const {
    getKH,
    updateKH,
    deleteKH,
    khoaAccKH,
    getOneAccKH,
    updateCongTienKhiNap,
    updatePhanTramNapTien,
    findPhanTramNapTien,
} = require("../controllers/KhachHang/khachhang.controller");
const { findThongBaoBanner, createThongBaoBanner, updateThongBaoBanner } = require("../controllers/ThongBao/thongBao.controller");

const router = express.Router();

// route đăng nhập kh
router.post("/login-kh", loginAccKH);
// route register KH
router.post("/register-kh", registerAccKH);
// route logout  KH
router.post("/logout-kh", logoutKH);

router.post("/xac-thuc-otp-kh", xacThucOTP);

router.post("/quen-mat-khau", quenMatKhauKH);

router.get("/get-kh", getKH);
router.get("/get-one-kh", getOneAccKH);

router.put("/update-kh", updateKH);
router.post("/check-payment", updateCongTienKhiNap,);
router.put("/update-phantramnaptien", updatePhanTramNapTien);

router.put("/khoa-kh", khoaAccKH);

router.delete("/delete-kh/:id", deleteKH);

// // đổi thông tin khách hàng
// router.put("/doi-thong-tin", doiThongTinKH)

router.get("/get-PhanTramNapTien", findPhanTramNapTien);
router.get("/get-thong-bao-banner", findThongBaoBanner);
router.post("/create-thong-bao-banner", createThongBaoBanner);

router.put("/update-thong-bao-banner", updateThongBaoBanner);

module.exports = router;
