const mongoose = require('mongoose');

const AccAdmin_Schema = new mongoose.Schema({   
        name: { type: String },
        email: { type: String },
        password: { type: String,  },      
        otp: { type: Number },  // Thêm trường lưu mã OTP
        otpExpires: { type: Date },  // Thêm trường lưu thời gian hết hạn mã OTP          
        isActive: { type: Boolean, default: false},        // Trạng thái tài khoản       
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);

module.exports = mongoose.model("AccAdmin", AccAdmin_Schema);