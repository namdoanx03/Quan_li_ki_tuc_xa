import {connection} from "../config/connectDb.js"

const addRoomModel = async (room, callback) => {
    const { MaPhong, TenPhong, SucChua, GiaPhong, MaDayPhong, LoaiPhong, SoSVDangOHienTai } = room;
    const sql = "INSERT INTO phong(MaPhong,TenPhong,SucChua,GiaPhong,MaDayPhong,LoaiPhong,SoSVDangOHienTai) VALUES (?,?,?,?,?,?,?)";
    connection.query(sql, [MaPhong, TenPhong, SucChua, GiaPhong, MaDayPhong, LoaiPhong, SoSVDangOHienTai], (err) => {
        if(err) {
            console.error("Error in addRoomModel:", err);
            return callback(err);
        }
        return callback(null);
    });
};

const updateRoomModel = async (MaPhong, updateIfRoom, callback) => {
    const fields = Object.keys(updateIfRoom);
    const values = Object.values(updateIfRoom);
    const setClause = fields.map((field) => `${field} = ?`).join(", ")
    const sql = `UPDATE phong SET ${setClause} WHERE MaPhong =?`
     connection.query(sql,[...values, MaPhong], (err) => {
        if(err) return callback(err);
        const sql2 = "SELECT * FROM phong WHERE MaPhong =?";
        connection.query(sql2, [MaPhong], (err2, result) => {
            if(err2) return callback(err2)
            else return callback(null,result[0])
        })
    })
}

const deleteRoomModel = async (MaPhong, callback) => {
    const sql = "DELETE FROM phong WHERE MaPhong = ?";
     connection.query(sql, [MaPhong], (err,result) => {
        if(err) return callback(err)
        else return callback(null,result)
    })
}

const getAllRoomModel = async (callback) => {
    const sql = "SELECT * FROM phong"
    connection.query(sql, (err, result) => {
        if(err) return callback(err)
        else return callback(null,result)
    })
}

const getCapacityRoomModel = async (MaPhong) => {
    const sql = "SELECT SucChua FROM phong WHERE MaPhong = ?";
    const [rows] = await connection.promise().query(sql, [MaPhong])
    const SucChua = rows.length > 0 ? rows[0].SucChua : 0;
    return SucChua
}

const updateCurrentStudentCountModel = async (MaPhong, newCount) => {
    const sql = "UPDATE phong SET SoSVDangOHienTai = ? WHERE MaPhong = ?";
    try {
        await connection.promise().query(sql, [newCount, MaPhong]);
        console.log(`Updated room ${MaPhong} student count to ${newCount}`);
        return true;
    } catch (error) {
        console.error(`Error updating room ${MaPhong} student count:`, error);
        return false;
    }
}

const calculateAndUpdateAllRoomStudentCounts = async () => {
    try {
        // Get all active contracts (contracts that haven't expired)
        const currentDate = new Date().toISOString().split('T')[0];
        const sql = `
            SELECT MaPhong, COUNT(*) as studentCount 
            FROM hopdong 
            WHERE NgayHetHan >= ? 
            GROUP BY MaPhong
        `;
        
        const [activeContracts] = await connection.promise().query(sql, [currentDate]);
        console.log("Active contracts by room:", activeContracts);

        // Update each room's current student count
        for (const room of activeContracts) {
            await updateCurrentStudentCountModel(room.MaPhong, room.studentCount);
        }

        // Update rooms with no active contracts to 0
        const updateZeroSql = `
            UPDATE phong 
            SET SoSVDangOHienTai = 0 
            WHERE MaPhong NOT IN (
                SELECT DISTINCT MaPhong 
                FROM hopdong 
                WHERE NgayHetHan >= ?
            )
        `;
        await connection.promise().query(updateZeroSql, [currentDate]);

        console.log("Successfully updated all room student counts");
        return true;
    } catch (error) {
        console.error("Error calculating and updating room student counts:", error);
        return false;
    }
}

const getCurrentStudentCountByRoom = async (MaPhong) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const sql = `
            SELECT COUNT(*) as studentCount 
            FROM hopdong 
            WHERE MaPhong = ? AND NgayHetHan >= ?
        `;
        
        const [rows] = await connection.promise().query(sql, [MaPhong, currentDate]);
        const count = rows.length > 0 ? rows[0].studentCount : 0;
        console.log(`Current student count for room ${MaPhong}: ${count}`);
        return count;
    } catch (error) {
        console.error(`Error getting current student count for room ${MaPhong}:`, error);
        return 0;
    }
}

const getCurrentStudentCountFromRoomTable = async (MaPhong) => {
    try {
        const sql = "SELECT SoSVDangOHienTai FROM phong WHERE MaPhong = ?";
        const [rows] = await connection.promise().query(sql, [MaPhong]);
        const count = rows.length > 0 ? rows[0].SoSVDangOHienTai : 0;
        console.log(`Current student count from room table for ${MaPhong}: ${count}`);
        return count;
    } catch (error) {
        console.error(`Error getting current student count from room table for ${MaPhong}:`, error);
        return 0;
    }
}

export {getAllRoomModel,deleteRoomModel,addRoomModel,updateRoomModel, getCapacityRoomModel, updateCurrentStudentCountModel, calculateAndUpdateAllRoomStudentCounts, getCurrentStudentCountByRoom, getCurrentStudentCountFromRoomTable}