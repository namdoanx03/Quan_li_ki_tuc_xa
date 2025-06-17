import { connection } from "../config/connectDb.js";

const findUserByEmailQl = async (email, callback) => {
  const sql = "SELECT * FROM nguoiquanly WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null,result[0]);
  });
};

const findUserByMaSV = async (MaSV, callback) => {
  const sql = "SELECT * FROM sinhvien WHERE MaSV = ?";
  connection.query(sql, [MaSV], (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null, result[0]);
  });
};

const addStudent = async (student, callback) => {
  const { MaSV, TenSV, DiaChi, GioiTinh, ChucVu, SDT, email, NamSinh } =
    student;
  const sql =
    "INSERT INTO sinhvien(MaSV, TenSV, DiaChi, GioiTinh, ChucVu, SDT, email, NamSinh) VALUES  (?, ?, ? ,?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [MaSV, TenSV, DiaChi, GioiTinh, ChucVu, SDT, email, NamSinh],
    (err, result) => {
      if (err) return callback(err);
      else if (result) return callback(null, result);
    }
  );
};

const deleteStudentModel = async (MaSV, callback) => {
  const sql = "DELETE FROM sinhvien WHERE MaSV = ?";
  connection.query(sql, [MaSV], (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null, result);
  });
};

const getStudentAllModel = async (callback) => {
  const sql = "SELECT * FROM sinhvien";
  connection.query(sql, (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null, result);
  });
};

const getStudentByMaSVModel = async (MaSV, callback) => {
  const sql = "SELECT * FROM sinhvien WHERE MaSV = ?";
  connection.query(sql,[MaSV], (err, result) => {
    if (err) return callback(err);
    else if (result) return callback(null, result[0]);
  });
};

export {
  findUserByEmailQl,
  addStudent,
  findUserByMaSV,
  deleteStudentModel,
  getStudentAllModel,
  getStudentByMaSVModel,
};
