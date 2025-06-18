import { connection } from "../config/connectDb.js";

const addServiceModel = async (service, callback) => {
  const { MaDV, TenDV, GiaDV, units } = service;
  const sql = "INSERT INTO dichvu(MaDV, TenDV, GiaDV, units) VALUES(?,?,?,?)";
  connection.query(sql, [MaDV, TenDV, GiaDV, units], (err, result) => {
    if (err) return callback(err);
    const selectSql = "SELECT * FROM dichvu WHERE MaDV = ?";
    connection.query(selectSql, [MaDV], (err2, rows) => {
      if (err2) return callback(err2);
      if (rows.length === 0) return callback(null, null);
      return callback(null, rows[0]); 
    });
  });
};

const updateServiceModel = async (MaDV, updateIfService, callback) => {
  const fields = Object.keys(updateIfService);
  const values = Object.values(updateIfService);
  
  console.log("updateServiceModel input:", { MaDV, updateIfService, fields, values });
  
  if (fields.length === 0) {
    return callback(new Error("ko co cap nhat moi"));
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  values.push(MaDV);

  const sql = `UPDATE dichvu SET ${setClause} WHERE MaDV = ?`;
  console.log("Update SQL:", sql, "Values:", values);
  
  connection.query(sql, values, (err, result) => {
    console.log("Update query result:", { err, result });
    
    if (err) return callback(err);
    if (result.affectedRows === 0) {
      console.log("No rows affected - service not found");
      return callback(null, null); // Không tìm thấy record để update
    }
    // Trả về dữ liệu đã update
    const updatedData = { ...updateIfService, MaDV: MaDV };
    // console.log("Returning updated data:", updatedData);
    return callback(null, updatedData);
  });
};

const deleteServiceModel = async (MaDV, callback) => {
  const sql = "DELETE FROM dichvu WHERE MaDV = ?";
  connection.query(sql, [MaDV], (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null, result);
  });
};

const allServiceModel = async (callback) => {
  const sql = "SELECT * FROM dichvu";
  connection.query(sql, (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null, result);
  });
};

// const ifServiceModel = async (MaDV, callback) => {
//     const sql = "SELECT * FROM dichvu WHERE MaDV = ?";
//     connection.query(sql, [MaDV], (err, result) => {
//         if(err) return callback(err);
//         else if(result) return callback(result[0])
//     })
// }

export {
  addServiceModel,
  updateServiceModel,
  deleteServiceModel,
  allServiceModel,
};
