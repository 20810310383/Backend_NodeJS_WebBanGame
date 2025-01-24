const AccKH = require('../../models/AccKH');

require('dotenv').config();

module.exports = {

    getKH: async (req, res) => {
        try {
            let { page, limit, name, sort, order } = req.query; 

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);           

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            if (name) {
                const searchKeywords = (name || '')
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    name: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
                }));

                query.$or = searchConditions;
            }

            let sortOrder = 1; // tang dn
            if (order === 'desc') {
                sortOrder = -1; 
            }
            console.log("sortOrder: ", sortOrder);                             

            let kh = await AccKH.find(query).skip(skip).limit(limitNumber).sort({ [sort]: sortOrder })           

            const totalKH = await AccKH.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalKH / limitNumber); // Tính số trang

            if(kh) {
                return res.status(200).json({
                    message: "Đã tìm ra khách hàng",
                    errCode: 0,
                    data: kh,     // Trả về các khách hàng có kèm tổng số sản phẩm
                    totalKH,
                    totalPages,
                    currentPage: pageNumber,
                })
            } else {
                return res.status(500).json({
                    message: "Tìm khách hàng thất bại!",
                    errCode: -1,
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }        
    },
   
    updateKH: async (req, res) => {
        try {
            let {_id, name, email, soDu, soTienNap} = req.body

            console.log("soDu: ", soDu);
            console.log("soTienNap: ", soTienNap);          

            let updateTL = await AccKH.updateOne({_id: _id},{name, email, soDu, soTienNap})

            if(updateTL) {
                return res.status(200).json({
                    data: updateTL,
                    message: "Cập nhật số dư cho khách hàng thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Cập nhật số dư cho khách hàng thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }
    },

    khoaAccKH: async (req, res) => {
        try {
            // const id = req.params.id
            const { id, isActive } = req.body;

            const updatedAccount = await AccKH.findByIdAndUpdate(id, { isActive }, { new: true });

            if (updatedAccount) {
                return res.status(200).json({ message: "Cập nhật thành công", data: updatedAccount });
            } else {
                return res.status(404).json({ message: "Tài khoản không tìm thấy" });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }
    },

    deleteKH: async (req, res) => {
        try {
            const _id = req.params.id
            let xoaTL = await AccKH.deleteOne({_id: _id})

            if(xoaTL) {
                return res.status(200).json({
                    data: xoaTL,
                    message: "Bạn đã xoá khách hàng thành công!"
                })
            } else {
                return res.status(500).json({
                    message: "Bạn đã xoá khách hàng thất bại!"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }
    },

    getOneAccKH: async (req, res) => {
        try {
            const id = req.query.id; 
            console.log("id: ", id);
                            
            let accKH = await AccKH.find({_id: id})
                       
            if(accKH) {
                return res.status(200).json({
                    message: "Đã tìm ra acc kh",
                    errCode: 0,
                    data: accKH,                    
                })
            } else {
                return res.status(500).json({
                    message: "Tìm thể loại thất bại!",
                    errCode: -1,
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }        
    },  

    updateCongTienKhiNap: async (req, res) => {
        const token = req.headers.authorization
        const result = token.replace('Apikey', '') // bỏ chữ Apikey
        const priveKey = '3f1b67a2-d02e-44f6-8a9c-d9a20dbbf5b6f2033b7e745de71000cf'
        const {description, transferAmount} = req.body

        console.log("token: ", token);
        console.log("result: ", result);
        console.log("description: ", description);
        console.log("transferAmount: ", transferAmount);
        

        if(result !== priveKey){
            return res.status(401).json({success: false})
        } else {
            const match = description.match(/[a-f0-9]{24}/)
            const idUser = match[0]

            console.log("match: ", match);
            console.log("idUser: ", idUser);

            const dataUser = await AccKH.findOne({_id: idUser})
            if(dataUser) {
                dataUser.soDu += transferAmount
                await dataUser.save()
                return res.status(200).json({success: true})
            } else {
                return res.status(400).json({success: false})
            }
        }
    }

}