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
  try {
    console.log("Updating room history:", { MaPhong, MaSV, command });

    // Get current student count
    let SoSVHT = await getCapacityRoomNow(MaPhong);
    console.log("Current student count:", SoSVHT);

    // Validate command
    if (command !== "add" && command !== "cancel") {
      throw new Error("Invalid command. Must be 'add' or 'cancel'");
    }

    // Update student count
    if (command === "add") {
      SoSVHT = parseInt(SoSVHT) + 1;
    } else {
      SoSVHT = Math.max(0, parseInt(SoSVHT) - 1); // Ensure we don't go below 0
    }
    console.log("New student count:", SoSVHT);

    // Insert history record
    const sql = "INSERT INTO lichsusosvphong(MaPhong,SoSVHT) VALUES(?,?)";
    connection.query(sql, [MaPhong, SoSVHT], async (err) => {
      if (err) {
        console.error("Error updating student count history:", err);
        return callback(err);
      }

      try {
        if (command === "add") {
          const NgayVao = new Date();
          const NgayRa = null;
          console.log("Creating room history entry:", { MaPhong, MaSV, NgayVao });
          
          historyCreateContract(MaPhong, MaSV, NgayVao, NgayRa, (err, result) => {
            if (err) {
              console.error("Error creating room history:", err);
              return callback(err);
            }
            console.log("Room history created successfully");
            return callback(null, { SoSVHT: SoSVHT, result: result });
          });
        } else {
          const NgayRa = new Date();
          console.log("Updating room history exit date:", { MaPhong, MaSV, NgayRa });
          
          historyDeleteContract(MaPhong, MaSV, NgayRa, (err, result) => {
            if (err) {
              console.error("Error updating room history exit date:", err);
              return callback(err);
            }
            console.log("Room history updated successfully");
            return callback(null, { SoSVHT: SoSVHT, result: result });
          });
        }
      } catch (historyError) {
        console.error("Error in history operations:", historyError);
        return callback(historyError);
      }
    });
  } catch (error) {
    console.error("Error in updateHistoryStudentRoom:", error);
    return callback(error);
  }
};

export { getCapacityRoomNow, historyCreateContract, updateHistoryStudentRoom };
