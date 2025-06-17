import mysql from "mysql2";

const createAdmin = async (callback) => {
  const sql =
    "INSERT INTO nguoiquanly(MaQl, TenQL, DiaChi, GioiTinh, ChucVu, SDT, email, NamSinh, name, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(sql, [
    "QL1",
    "Nguyen Van A",
    "Ha Noi",
    "Nam",
    "01234567",
    "quan ly",
    "quanly@gmail.com",
    "1980",
    "root",
    "123456",
  ], (err, result) =>{
    if(err) return callback(err)
    else return callback(null, result[0])
  });
};

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "qlktx",
});



const connectDB = async () => {
  connection.connect((err) => {
    if (err) {
      console.error("Lỗi kết nối:", err);
    } else {
      console.log("Kết nối MySQL thành công!");
    }
  });
};

export { connectDB, connection };
