const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const SanPham_Schema = new mongoose.Schema(
    {
        TenSP: { type: String, required: false },
        GiaBan: { type: Number, required: false },
        GiamGiaSP: { type: Number, default: "0" },
        urlYoutube: { type: String },
        MoTa: { type: String, default: "Not thing" },
        Note: { type: String, default: "Not thing" },
        SoLuongBan: { type: Number, required: false, default: "1" },
        ImageSlider: [{ type: String }],    
        Image: { type: String, required: false },     
        IdLoaiSP: {ref: "LoaiSP", type: mongoose.SchemaTypes.ObjectId},
        SoLuongTon: { type: Number, required: false, default: 1 },  
        isActive: { type: Boolean, default: true},     
    },
    { 
        timestamps: true,   // createAt, updateAt
    },
);

// Override all methods
SanPham_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

const SanPham = mongoose.model('SanPham', SanPham_Schema);

module.exports = SanPham;