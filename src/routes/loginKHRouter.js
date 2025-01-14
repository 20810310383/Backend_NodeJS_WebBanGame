const express = require("express");
const { loginAccKH, registerAccKH, logoutKH, xacThucOTP } = require("../controllers/Login/login.kh.controller");


const router = express.Router();

// route đăng nhập kh
router.post("/login-kh", loginAccKH );
// route register KH
router.post("/register-kh", registerAccKH );
// route logout  KH
router.post("/logout-kh", logoutKH );

router.post("/xac-thuc-otp-kh", xacThucOTP );

// router.get("/check-status", checkTrangThaiIsActive );

// // find all acc kh
// router.get("/get-kh", getAccKH );

// router.get("/get-one-kh", getOneAccKH );

// // update acc kh
// router.put("/update-kh", updateAccKH );

// router.put("/khoa-kh", khoaAccKH );

// // delete acc kh
// router.delete("/delete-kh/:id", deleteAccKH );

// // router.post("/auth/google", verifyGoogleToken );

// // quên mật khẩu
// router.post("/quen-mat-khau", quenMatKhauKH)

// // đổi thông tin khách hàng
// router.put("/doi-thong-tin", doiThongTinKH)

module.exports = router;