import { updateRoomRowRoomModel } from "../models/historyRoomRowRoomModel.js";
import {
  addRoomModel,
  deleteRoomModel,
  updateRoomModel,
  getAllRoomModel,
} from "../models/roomModel.js";
import { getAllRowRoomModel } from "../models/rowRoomModel.js";

import { checkCapacityRowRoom } from "./rowOfRoomController.js";

const addRoom = async (req, res) => {
  try {
    const { MaPhong, TenPhong, MaDayPhong, LoaiPhong, SucChua, GiaPhong } = req.body;

    // Kiểm tra dãy phòng có tồn tại không
    getAllRowRoomModel((err, rowRooms) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Lỗi khi kiểm tra dãy phòng!",
          error: err.message
        });
      }

      const rowRoomExists = rowRooms.some(row => row.MaDayPhong === MaDayPhong);
      if (!rowRoomExists) {
        return res.status(400).json({
          success: false,
          message: "Dãy phòng không tồn tại!"
        });
      }

      // Kiểm tra xem mã phòng đã tồn tại chưa
      getAllRoomModel((err, rooms) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Lỗi khi kiểm tra phòng!",
            error: err.message
          });
        }

        const existingRoom = rooms.find(room => room.MaPhong === MaPhong);
        if (existingRoom) {
          return res.status(400).json({
            success: false,
            message: "Mã phòng đã tồn tại!"
          });
        }

        // Tạo phòng mới
        const roomToAdd = {
          MaPhong,
          TenPhong,
          MaDayPhong,
          LoaiPhong,
          SucChua: parseInt(SucChua),
          GiaPhong: parseInt(GiaPhong),
          SoSVDangOHienTai: 0
        };

        addRoomModel(roomToAdd, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Lỗi khi thêm phòng!",
              error: err.message
            });
          }

          res.status(201).json({
            success: true,
            message: "Thêm phòng thành công!"
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in addRoom:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm phòng!",
      error: error.message
    });
  }
};

const updateRoom = async (req, res) => {
  const updateIfRoom = req.body;
  const { MaPhong } = req.query;

  updateRoomModel(MaPhong, updateIfRoom, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "ko cap nhat dc phong", error: err });
    }

    return res
      .status(200)
      .json({ message: "cap nhat thanh cong", result: result });
  });
};

const deleteRoom = async (req, res) => {
  const { MaPhong, MaDayPhong } = req.query;

  if (!MaPhong || !MaDayPhong) {
    return res.status(400).json({ 
      success: false,
      message: "Thiếu thông tin mã phòng hoặc mã dãy phòng" 
    });
  }

  try {
    // Xóa phòng trước
    deleteRoomModel(MaPhong, (err, result) => {
      if (err) {
        console.error("Error deleting room:", err);
        return res.status(500).json({ 
          success: false,
          message: "Không thể xóa phòng", 
          error: err.message 
        });
      }
      
      // Kiểm tra xem có phòng nào bị xóa không
      if (!result || result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: "Phòng không tồn tại để xóa" 
        });
      }

      // Cập nhật lịch sử dãy phòng
      updateRoomRowRoomModel(MaDayPhong, MaPhong, "delete", (historyErr, historyResult) => {
        if (historyErr) {
          console.error("Error updating room history:", historyErr);
          // Nếu cập nhật lịch sử thất bại, vẫn trả về thành công vì phòng đã được xóa
          return res.status(200).json({
            success: true,
            message: "Xóa phòng thành công nhưng không thể cập nhật lịch sử",
            warning: historyErr.message
          });
        }

        return res.status(200).json({
          success: true,
          message: "Xóa phòng và cập nhật lịch sử thành công",
          data: historyResult
        });
      });
    });
  } catch (error) {
    console.error("Error in deleteRoom:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa phòng",
      error: error.message
    });
  }
};

const getAllRoom = async (req, res) => {
  try {
    getAllRoomModel((err, result) => {
      if (err)
        return res.status(500).json({ message: "ko lay dc danh sach phong", error: err });
      else if (result)
        return res.status(200).json({ message: "lay danh sach thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

export { addRoom, updateRoom, deleteRoom, getAllRoom };
