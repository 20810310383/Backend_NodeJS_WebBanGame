const AccKH = require('../../models/AccKH');
const SanPham = require('../../models/SanPham');

require('dotenv').config();

module.exports = {

    muaHangTuTaiKhoan: async (req, res) => {
        try {
            let {idSP, soTienConLai, idKH, quantity} = req.body
            console.log("SP bán: ", idSP);
            console.log("idKH: ", idKH);
            console.log("quantity: ", quantity);

            let sp = await SanPham.findById(idSP);

            let giaCanThanhToan = sp?.GiamGiaSP !== 0 
            ? Math.floor(sp?.GiaBan - (sp?.GiaBan * (sp?.GiamGiaSP / 100)) )
            : sp?.GiaBan; 

            if (!sp) {
                return res.status(404).json({
                    message: "Sản phẩm không tồn tại",
                    errCode: 1
                });
            }

            if (sp.SoLuongTon < quantity) {
                return res.status(400).json({
                    message: "Tài khoản này đã bán hết, Bạn có thể tham khảo và chốt tài khoản khác!",
                    errCode: 2
                });
            }

            sp = await SanPham.findByIdAndUpdate(
                {_id: idSP},
                {$inc: {SoLuongTon: -quantity}},  // Giảm số lượng tồn kho
                {new: true}  
            ).populate('IdLoaiSP');

            let kh = await AccKH.findById(idKH);
            if (!kh) {
                return res.status(404).json({
                    message: "Khách hàng không tồn tại",
                    errCode: 3
                });
            }  
            if (kh.soDu < giaCanThanhToan) {
                return res.status(404).json({
                    message: "Số dư không đủ để mua hàng, Vui lòng nạp thêm vào tài khoản để mua hàng!",
                    errCode: 4
                });
            }    
            
            let soDuUpdate = Math.floor(kh.soDu - giaCanThanhToan);
                
            // Cập nhật số dư tài khoản của khách hàng
            kh = await AccKH.findByIdAndUpdate(
                {_id: idKH},
                {soDu: soDuUpdate},
                {new: true}
            );
    
            console.log("sp: ", sp);
            console.log("kh: ", kh);
    
            let mess = `Cảm ơn bạn đã chốt tài khoản ${sp.TenSP} thành công!`;
            return res.status(200).json({
                message: mess,
                errCode: 0
            });            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }   
    }
}