const ThongBaoBanner = require("../../models/ThongBaoBanner")

module.exports = {
    findThongBaoBanner: async (req, res) => {
        let findRobux = await ThongBaoBanner.findOne({})
        if(findRobux) {
            return res.status(200).json({
                message: "Đã tìm ra ThongBaoBanner",
                errCode: 0,
                data: findRobux,                   
            })
        } else {
            return res.status(500).json({
                message: "Tìm findRobux thất bại!",
                errCode: -1,
            })
        }
    },

    createThongBaoBanner: async (req, res) => {
        let title = req.body.title

        let findRobux = await ThongBaoBanner.create({title})

        if(findRobux) {
            return res.status(200).json({
                message: "Tạo giá ThongBaoBanner thành công",
                errCode: 0,
                data: findRobux,                   
            })
        } else {
            return res.status(500).json({
                message: "Tạo giá ThongBaoBanner thất bại!",
                errCode: -1,
            })
        }
    },

    updateThongBaoBanner: async (req, res) => {
        let _id = req.body._id
        let title = req.body.title

        let findRobux = await ThongBaoBanner.updateOne({_id: _id}, {title})

        if(findRobux) {
            return res.status(200).json({
                message: "Sửa giá ThongBaoBanner thành công",
                errCode: 0,
                data: findRobux,                   
            })
        } else {
            return res.status(500).json({
                message: "Sửa giá ThongBaoBanner thất bại!",
                errCode: -1,
            })
        }
    },
}