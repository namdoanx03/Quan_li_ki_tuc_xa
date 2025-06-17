import { connection } from "../config/connectDb.js";

const getCapacityRoomNow = async (MaPhong) => {
  const sql =
    "SELECT SoSVHT FROM lichsusosvphong WHERE MaPhong = ? ORDER BY ThoiGianGhiNhanPhong DESC LIMIT 1";
  const [rows] = await connection.promise().query(sql, [MaPhong]);
  let soSVHT = rows.length > 0 ? rows[0].SoSVHT : 0;
  return soSVHT;
};

const historyCreateContract = async (
  MaPhong,
  MaSV,
  NgayVao,
  NgayRa,
  callback
) => {
  const sql =
    "INSERT INTO lichsuophong(MaPhong,MaSV,NgayVao, NgayRa) VALUES(?,?,?,?)";
  connection.query(sql, [MaPhong, MaSV, NgayVao, NgayRa], (err) => {
    if (err) return callback(err);
    const sql2 = "SELECT * FROM lichsuophong WHERE MaPhong = ?";
    connection.query(sql2, [MaPhong], (err, result) => {
      if (err) return callback(err);
      else return callback(null, result);
    });
  });
};

const historyDeleteContract = async (MaPhong, MaSV, NgayRa, callback) => {
  const sql =
    "UPDATE lichsuophong SET NgayRa = ? WHERE MaPhong = ? AND MaSV = ?";
  connection.query(sql, [NgayRa, MaPhong, MaSV], (err) => {
    if (err) return callback(err);
    const sql2 = "SELECT * FROM lichsuophong WHERE MaPhong = ?";
    connection.query(sql2, [MaPhong], (err, result) => {
      if (err) return callback(err);
      else return callback(null, result);
    });
  });
};

const updateHistoryStudentRoom = async (MaPhong, MaSV, command, callback) => {
  let SoSVHT = await getCapacityRoomNow(MaPhong);
  if (command === "add") SoSVHT += 1;
  else SoSVHT -= 1;

  const sql = "INSERT INTO lichsusosvphong(MaPhong,SoSVHT) VALUES(?,?)";
  connection.query(sql, [MaPhong, SoSVHT], (err) => {
    if (err) return callback(err);
    if (command === "add") {
      const NgayVao = new Date();
      const NgayRa = null;
      historyCreateContract(MaPhong, MaSV, NgayVao, NgayRa, (err, result) => {
        if (err) return callback(err);
        else return callback(null, { SoSVHT: SoSVHT, result: result });
      });
    } else {
      const NgayRa = new Date();
      historyDeleteContract(MaPhong, MaSV, NgayRa, (err, result) => {
        if (err) callback(err);
        else return callback(null, { SoSVHT: SoSVHT, result: result });
      });
    }
  });
};

export { getCapacityRoomNow, historyCreateContract, updateHistoryStudentRoom };
