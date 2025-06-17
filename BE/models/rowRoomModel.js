import { connection } from "../config/connectDb.js";

const addRowRoomModel = async (rowRoom, callback) => {
  const { MaDayPhong, TenDayPhong, SoPhongCuaDay } = rowRoom;
  const sql =
    "INSERT INTO dayphong(MaDayPhong, TenDayPhong, SoPhongCuaDay) VALUES(?,?,?)";
  connection.query(
    sql,
    [MaDayPhong, TenDayPhong, SoPhongCuaDay],
    (err, result) => {
      if (err) return callback(err);
      const sql2 = "SELECT * FROM dayphong WHERE MaDayPhong = ?";
      connection.query(sql2, [MaDayPhong], (err2, row) => {
        if (err2) return callback(err2);
        else return callback(null, row[0]);
      });
    }
  );
};

const updateRowRoomModel = async (MaDayPhong, updateIfRowRoom, callback) => {
  const fields = Object.keys(updateIfRowRoom);
  const values = Object.values(updateIfRowRoom);
  const setClause = fields.map((field) => `${field} = ?`).join(",");

  const sql = `UPDATE dayphong SET ${setClause} WHERE MaDayPhong = ?`;
  connection.query(sql, [...values, MaDayPhong], (err) => {
    if (err) return callback(err);
    const sql2 = "SELECT * FROM dayphong WHERE MaDayPhong = ?";
    connection.query(sql2, [MaDayPhong], (err2, row) => {
      if (err2) return callback(err2);
      else return callback(null, row[0]);
    });
  });
};

const deleteRowRoomModel = async (MaDayPhong, callback) => {
  const sql = "DELETE FROM dayphong WHERE MaDayPhong = ?";
  connection.query(sql, [MaDayPhong], (err, result) => {
    if (err) return callback(err);
    else return callback(null, result);
  });
};

const getAllRowRoomModel =  async(callback) => {
  const sql = "SELECT * FROM dayphong";
  connection.query(sql, (err, result) => {
    if (err) return callback(err);
    else return callback(null, result);
  });
};

const capacityRowRoomModel = async (MaDayPhong) => {
  const sql = "SELECT SoPhongCuaDay FROM dayphong WHERE MaDayPhong = ?";
  const [rows] = await connection.promise().query(sql, [MaDayPhong]);
  return rows.length > 0 ? rows[0].SoPhongCuaDay : null;
}


export { addRowRoomModel, updateRowRoomModel, deleteRowRoomModel, getAllRowRoomModel, capacityRowRoomModel };
