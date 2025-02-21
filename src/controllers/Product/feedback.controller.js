const Feedback = require("../../models/Feedback");


module.exports = {
    getFeedbacks: async (req, res) => {
        try {
            const { page, limit } = req.query; 

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};                        
            
            let sp = await Feedback.find(query)
                .skip(skip)
                .limit(limitNumber)

            const totalFeedback = await Feedback.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalFeedback / limitNumber); // Tính số trang

            if(sp) {
                return res.status(200).json({
                    message: "Đã tìm ra Feedback",
                    errCode: 0,
                    data: sp,
                    totalFeedback,
                    totalPages,
                    currentPage: pageNumber,
                })
            } else {
                return res.status(500).json({
                    message: "Tìm Feedback thất bại!",
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

    createFeedback: async (req, res) => {
        try {
            let {TenSP, ImageSlider} = req.body                                      

            let createSP = await Feedback.create({TenSP, ImageSlider})

            if(createSP){
                return res.status(200).json({
                    message: "Bạn đã thêm Feedback thành công!",
                    errCode: 0,
                    data: createSP
                })
            } else {
                return res.status(500).json({
                    message: "Bạn thêm Feedback thất bại!",                
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

    deleteFeedback: async (req, res) => {
        try {
            const _id = req.params.id
            let xoaTL = await Feedback.deleteOne({_id: _id})

            if(xoaTL) {
                return res.status(200).json({
                    data: xoaTL,
                    message: "Bạn đã xoá Feedback thành công!"
                })
            } else {
                return res.status(500).json({
                    message: "Bạn đã xoá Feedback thất bại!"
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
}