import { connection } from "../config/connectDb.js";

const createBill = async (req, res) => {
  try {
    const { MaHD } = req.body;

    if (!MaHD) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc (MaHD)",
      });
    }

    // Tạo mã hóa đơn mới
    const generateMaHoaDon = () => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT MAX(CAST(SUBSTRING(MaHoaDon, 3) AS UNSIGNED)) as maxId FROM hoadon";
        connection.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const nextId = (result[0]?.maxId || 0) + 1;
            const MaHoaDon = `HD${nextId.toString().padStart(3, '0')}`;
            resolve(MaHoaDon);
          }
        });
      });
    };

    const MaHoaDon = await generateMaHoaDon();
    const TenHoaDon = `Hóa đơn ${MaHoaDon}`;

    // Insert hóa đơn
    const sql = "INSERT INTO hoadon (MaHoaDon, TenHoaDon, MaHD) VALUES (?, ?, ?)";
    connection.query(sql, [MaHoaDon, TenHoaDon, MaHD], (err) => {
      if (err) {
        console.error("Error creating bill:", err);
        return res.status(500).json({ message: "Lỗi khi tạo hóa đơn", error: err.message });
      }
      return res.status(200).json({
        message: "Tạo hóa đơn thành công",
        MaHoaDon,
        TenHoaDon,
        MaHD,
      });
    });
  } catch (error) {
    console.error("System error in createBill:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

export { createBill };