const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // Tên cấu hình
    value: { type: Number, required: true }, // Giá trị cấu hình
    dieuKien: { type: Number, }, 
    description: { type: String }, // Mô tả (tùy chọn)
});

const Config = mongoose.model("Config", ConfigSchema);

module.exports = Config;
