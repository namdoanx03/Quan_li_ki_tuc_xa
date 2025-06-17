import { connection } from "../config/connectDb.js";

const getRoomRowRoomModel = async (MaDayPhong, command) => {
  const sql =
    "SELECT SoPhongHientai FROM lichsusophongday WHERE MaDayPhong = ?  ORDER BY ThoiGianThayDoi DESC LIMIT 1";
  const [rows] = await connection.promise().query(sql, [MaDayPhong]);
  let soPhongHienTai = rows.length > 0 ? rows[0].SoPhongHientai : 0;
  if (command === "add") soPhongHienTai += 1;
  else if (command === "delete") {
    soPhongHienTai -= 1;
  }
  return soPhongHienTai;
};

const historyAddRoom = (
  MaDayPhong,
  MaPhong,
  NgayThemPhong,
  NgayXoaPhong,
  callback
) => {
  const sql =
    "INSERT INTO lichsuthemphong(MaDayPhong, MaPhong, NgayThemPhong,NgayXoaPhong) VALUES (?,?,?,?)";
  connection.query(
    sql,
    [MaDayPhong, MaPhong, NgayThemPhong, NgayXoaPhong],
    (err) => {
      if (err) return callback(err);
      const sql2 = "SELECT * FROM lichsuthemphong WHERE MaPhong = ?";
      connection.query(sql2, [MaPhong], (err2, row) => {
        if (err2) return callback(err2);
        else return callback(null, row);
      });
    }
  );
};

const historyDeleteRoom = (MaDayPhong, MaPhong, NgayXoaPhong, callback) => {
  const sql =
    "UPDATE lichsuthemphong SET NgayXoaPhong = ? WHERE MaDayPhong =? AND MaPhong = ?";
  connection.query(sql, [NgayXoaPhong, MaDayPhong, MaPhong], (err, result) => {
    if (err) return callback(err);
    const sql2 = "SELECT * FROM lichsuthemphong WHERE MaPhong = ?";
    connection.query(sql2, [MaPhong], (err2, row) => {
      if (err2) return callback(err2);
      else return callback(null, row);
    });
  });
};

const updateRoomRowRoomModel = async (
  MaDayPhong,
  MaPhong,
  command,
  callback
) => {
  const SoPhongHienTai = await getRoomRowRoomModel(MaDayPhong, command);
  if (SoPhongHienTai < 0) return callback("loi xoa phong");
  if (command === "add") {
    const NgayThemPhong = new Date();
    const NgayXoaPhong = null;
    const sql =
      "INSERT INTO lichsusophongday(MaDayPhong,SoPhongHienTai) VALUES (?,?)";
    connection.query(sql, [MaDayPhong, SoPhongHienTai], (err) => {
      if (err) return callback(err);
      historyAddRoom(
        MaDayPhong,
        MaPhong,
        NgayThemPhong,
        NgayXoaPhong,
        (err, result) => {
          if (err) return callback(err);
          return callback(null, { SoPhongHienTai, history: result });
        }
      );
    });
  } else {
    const NgayXoaPhong = new Date();
    const sql =
      "INSERT INTO lichsusophongday(MaDayPhong,SoPhongHienTai) VALUES (?,?)";
    connection.query(sql, [MaDayPhong, SoPhongHienTai], (err) => {
      if (err) return callback(err);
      historyDeleteRoom(MaDayPhong, MaPhong, NgayXoaPhong, (err, result) => {
        if (err) return callback(err);
        else return callback(null, { SoPhongHienTai, history: result });
      });
    });
  }
};

const getCapacityNowRowRoomModel = async (MaDayPhong) => {
  const sql = "SELECT SoPhongHienTai FROM lichsusophongday WHERE MaDayPhong = ? ORDER BY ThoiGianThayDoi DESC LIMIT 1";
  const [rows] = await connection.promise().query(sql, [MaDayPhong]);
  return rows.length > 0 ? rows[0].SoPhongHienTai : 0;
}

export { updateRoomRowRoomModel, getCapacityNowRowRoomModel };
