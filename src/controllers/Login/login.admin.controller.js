const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Secret key cho JWT
const JWT_SECRET = process.env.JWT_SECRET; 
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const AccAdmin = require('../../models/AccAdmin');
const { log } = require('console');

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


module.exports = {

    loginAccAdmin: async (req, res) => {
        const {email, password} = req.body
        console.log("email: ", email);
        try {
            // Tìm admin bằng email
            const admin = await AccAdmin.findOne({ email });
            if (!admin) {
                return res.status(401).json({ message: 'Tài khoản không tồn tại' });
            }

            if (!admin.isActive) {
                return res.status(400).json({
                    message: "Tài khoản vi phạm bị khóa hoặc Tài khoản chưa được xác thực. Vui lòng kiểm tra mã OTP."
                });
            }

            let messError = `Tài khoản này vi phạm quy định của trang và đang bị khóa! ` + '\n' + `Vui lòng liên hệ Admin!`
            if(admin.isActive === false) {
                return res.status(401).json({ message: messError });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            console.log("admin.password: ",admin.password);
            console.log("password: ",password);
            console.log("hashedPassword: ",hashedPassword);
            console.log('EXPIRESIN:', process.env.EXPIRESIN);


            // So sánh mật khẩu với bcrypt
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu không chính xác' });
            }            

            // Tạo token JWT
            const token = jwt.sign(
                { adminId: admin._id, email: admin.email },
                JWT_SECRET,
                { expiresIn: '1m' } // Token hết hạn sau 10 phút
            );

             // Lưu token vào cookie
            res.cookie('token', token, {
                httpOnly: true, // Bảo mật hơn khi chỉ có server mới có thể truy cập cookie này
                secure: process.env.NODE_ENV === 'production', // Chỉ cho phép cookie qua HTTPS nếu là production
                maxAge: 1 * 60 * 1000, // Cookie hết hạn sau 10 phút (10 phút x 60 giây x 1000ms)
            });

            // Trả về thông tin admin (có thể trả về thông tin khác tùy nhu cầu)
            res.json({ message: 'Đăng nhập thành công', access_token: token, data: admin });
            console.log(`Đăng nhập thành công với token: ${token}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    },

    logoutAdmin: async (req, res) => {
        try {
            // Xóa cookie chứa token
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Bảo đảm chỉ xóa cookie qua HTTPS nếu là production
            });
    
            // Trả về phản hồi thành công
            res.status(200).json({ message: 'Bạn đã đăng xuất thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    },

    registerAccAdmin: async (req, res) => {
        const { email, password } = req.body;
            
        try {
            // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
            let check = await AccAdmin.findOne({ email: email });
    
            if (check) {               
                if (check.isActive) {
                    return res.status(400).json({
                        success: false,
                        message: 'Tài khoản đã tồn tại và đã được kích hoạt. Bạn không thể đăng ký lại!'
                    });
                } else {
                    // Nếu tài khoản tồn tại nhưng chưa kích hoạt, xóa OTP cũ (nếu có) trước khi tạo mã OTP mới
                    check.otp = null;  // Xóa OTP cũ
                    check.otpExpires = null;  // Xóa thời gian hết hạn OTP cũ
                    await check.save();
    
                    console.log("Xóa mã OTP cũ, tạo mã OTP mới");
                }
            } else {               

                // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
                const hashedPassword = await bcrypt.hash(password, 10);
    
                // Tạo tài khoản mới
                check = await AccAdmin.create({
                    email, password: hashedPassword
                });
            }
              
            await check.save();
    
            return res.status(200).json({
                success: true,
                message: "đăng ký tài khoản thành công!"
            });
        } catch (error) {
            console.error('Lỗi trong quá trình đăng ký tài khoản: ', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },       

    quenMatKhauKH: async (req, res) => {
        const { email_doimk } = req.body;
        console.log("email đổi mk: ", email_doimk);
    
        try {
            // Kiểm tra xem tài khoản có tồn tại không
            let tk_doimk = await AccAdmin.findOne({ email: email_doimk });
            
            if (!tk_doimk) {
                console.log("Không tồn tại tài khoản");
                return res.status(404).json({ message: 'Không tồn tại tài khoản! Vui lòng kiểm tra lại email của bạn.', data: false });
            }
    
            // Tạo mật khẩu ngẫu nhiên
            const newPassword = Math.random().toString(36).slice(-6);
    
            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // Lưu mật khẩu đã mã hóa vào cơ sở dữ liệu
            tk_doimk.password = hashedPassword;
            await tk_doimk.save();
    
            // Tạo transporter để gửi email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
    
            // Cấu hình email
            const mailOptions = {
                from: 'Admin', 
                to: email_doimk,
                subject: 'Yêu cầu lấy lại mật khẩu',
                text: `Mật khẩu mới của bạn là: ${newPassword}`,
                html: `
                    <p style="color: green;">Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>
                    <p>Vui lòng đăng nhập với mật khẩu mới này để tiếp tục sử dụng dịch vụ.</p>
                `
            };
    
            // Gửi email với async/await thay vì callback
            await transporter.sendMail(mailOptions);
    
            console.log('Email sent');
            return res.status(200).json({
                data: true,
                message: `Mật khẩu mới đã được gửi tới email của bạn. Vui lòng kiểm tra email ${email_doimk} để lấy lại mật khẩu!`
            });
    
        } catch (error) {
            // Xử lý lỗi khi có lỗi xảy ra trong bất kỳ bước nào
            console.error('Lỗi trong quá trình xử lý:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.', data: false });
        }
    },
}