const AccKH = require("../../models/AccKH");
const nodemailer = require("nodemailer");
const SePayTransaction = require("../../models/SepayTransaction");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

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
                const searchKeywords = name || "";
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map((keyword) => ({
                    name: { $regex: keyword, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
                }));

                query.$or = searchConditions;
            }

            let sortOrder = 1; // tang dn
            if (order === "desc") {
                sortOrder = -1;
            }
            console.log("sortOrder: ", sortOrder);

            let kh = await AccKH.find(query)
                .skip(skip)
                .limit(limitNumber)
                .sort({ [sort]: sortOrder });

            const totalKH = await AccKH.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalKH / limitNumber); // Tính số trang

            if (kh) {
                return res.status(200).json({
                    message: "Đã tìm ra khách hàng",
                    errCode: 0,
                    data: kh, // Trả về các khách hàng có kèm tổng số sản phẩm
                    totalKH,
                    totalPages,
                    currentPage: pageNumber,
                });
            } else {
                return res.status(500).json({
                    message: "Tìm khách hàng thất bại!",
                    errCode: -1,
                });
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
            let { _id, name, email, soDu, soTienNap } = req.body;

            console.log("soDu: ", soDu);
            console.log("soTienNap: ", soTienNap);

            let updateTL = await AccKH.updateOne(
                { _id: _id },
                { name, email, soDu, soTienNap }
            );

            if (updateTL) {
                return res.status(200).json({
                    data: updateTL,
                    message: "Cập nhật số dư cho khách hàng thành công",
                });
            } else {
                return res.status(404).json({
                    message: "Cập nhật số dư cho khách hàng thất bại",
                });
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

            const updatedAccount = await AccKH.findByIdAndUpdate(
                id,
                { isActive },
                { new: true }
            );

            if (updatedAccount) {
                return res.status(200).json({
                    message: "Cập nhật thành công",
                    data: updatedAccount,
                });
            } else {
                return res
                    .status(404)
                    .json({ message: "Tài khoản không tìm thấy" });
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
            const _id = req.params.id;
            let xoaTL = await AccKH.deleteOne({ _id: _id });

            if (xoaTL) {
                return res.status(200).json({
                    data: xoaTL,
                    message: "Bạn đã xoá khách hàng thành công!",
                });
            } else {
                return res.status(500).json({
                    message: "Bạn đã xoá khách hàng thất bại!",
                });
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

            let accKH = await AccKH.find({ _id: id });

            if (accKH) {
                return res.status(200).json({
                    message: "Đã tìm ra acc kh",
                    errCode: 0,
                    data: accKH,
                });
            } else {
                return res.status(500).json({
                    message: "Tìm thể loại thất bại!",
                    errCode: -1,
                });
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
        const session = await mongoose.startSession();

        try {
            await session.startTransaction();

            const sePayWebhookData = {
                id: parseInt(req.body.id),
                gateway: req.body.gateway,
                transactionDate: req.body.transactionDate,
                accountNumber: req.body.accountNumber,
                subAccount: req.body.subAccount,
                code: req.body.code,
                content: req.body.content,
                transferType: req.body.transferType,
                description: req.body.description,
                transferAmount: parseFloat(req.body.transferAmount),
                referenceCode: req.body.referenceCode,
                accumulated: parseInt(req.body.accumulated),
            };

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "checkfb9999@gmail.com", // Thay bằng email của bạn
                    pass: "fufzgdridpmjhigt", // Mật khẩu ứng dụng (tạo trong Google Account)
                },
            });
    
            // send email test
            const mailOptions = {
                from: "checkfb9999@gmail.com",
                to: "dtrinhit04@gmail.com",
                subject: "Test email",
                text: `body ${JSON.stringify(req.body, null, 1)} - Header ${JSON.stringify(req.headers, null, 1)}`,
            };
            await transporter.sendMail(mailOptions);

            // Kiểm tra transaction tồn tại
            const existingTransaction = await SePayTransaction.findOne({
                _id: sePayWebhookData.id,
            });
            if (existingTransaction) {
                return res.status(400).json({
                    message: "transaction này đã thực hiện giao dịch",
                });
            }

            // api chứng thực
            const pattern = process.env.SEPAY_API_KEY;
            const matches = sePayWebhookData.code.match(pattern);

            // kiểm tra xác thực api
            if (pattern === matches[0]) {
                // Tạo lịch sử giao dịch
                const newTransaction = await SePayTransaction.create({
                    _id: sePayWebhookData.id,
                    gateway: sePayWebhookData.gateway,
                    transactionDate: sePayWebhookData.transactionDate,
                    accountNumber: sePayWebhookData.accountNumber,
                    subAccount: sePayWebhookData.subAccount,
                    code: sePayWebhookData.code,
                    content: sePayWebhookData.content,
                    transferType: sePayWebhookData.transferType,
                    description: sePayWebhookData.description,
                    transferAmount: sePayWebhookData.transferAmount,
                    referenceCode: sePayWebhookData.referenceCode,
                });

                const idUser = sePayWebhookData.content.replace("NAP", "");
                const updatedUser = await AccKH.findOneAndUpdate(
                    { _id: idUser },
                    {
                        $inc: { soDu: sePayWebhookData.transferAmount },
                        $push: {
                            transactionHistory: {
                                date: new Date(),
                                amount: sePayWebhookData.transferAmount,
                                type: "deposit",
                                reference: sePayWebhookData.id,
                            },
                        },
                    },
                    { new: true, session }
                );

                if (!updatedUser) {
                    return res
                        .status(404)
                        .json({ message: "User account not found" });
                }
                await session.commitTransaction();

                return res.status(200).json({
                    success: true,
                    newBalance: updatedUser.soDu,
                    processedAt: new Date().toISOString(),
                    message: `Cập nhật số dư thành công`,
                });
            }
            return res.status(400).json({ message: "Invalid transaction" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        } finally {
            session.endSession();
        }
    },
};
