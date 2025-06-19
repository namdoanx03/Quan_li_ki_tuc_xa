import {
  cancelContractModel,
  createContractModel,
  extendContractModel,
  generateMaHD,
  getAllContractModel,
} from "../models/contractModel.js";
import {
  getCapacityRoomNow,
  updateHistoryStudentRoom,
} from "../models/historyStudentRoomModel.js";
import { getCapacityRoomModel, updateCurrentStudentCountModel, getCurrentStudentCountByRoom, calculateAndUpdateAllRoomStudentCounts, getCurrentStudentCountFromRoomTable } from "../models/roomModel.js";

const checkCapacityRoom = async (MaPhong) => {
  console.log("bat dau check");
  const sucChua = await getCapacityRoomModel(MaPhong);
  const soSVHT = await getCurrentStudentCountFromRoomTable(MaPhong);
  console.log(`Room ${MaPhong}: Capacity=${sucChua}, Current=${soSVHT}`);
  if (parseInt(sucChua) > parseInt(soSVHT)) return 1;
  return 0;
};

const createContract = async (req, res) => {
  try {
    const { MaSV, MaPhong, MaQl, NgayBatDau } = req.body;
    
    // Validate required fields
    if (!MaSV || !MaPhong || !MaQl) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc (MaSV, MaPhong, MaQl)",
      });
    }

    console.log("Creating contract with data:", { MaSV, MaPhong, MaQl, NgayBatDau });

    const MaHD = await generateMaHD();
    console.log("Generated MaHD:", MaHD);

    // Generate TenHD - using MaHD for uniqueness and brevity
    const TenHD = `HD${MaHD}`;
    console.log("Generated TenHD:", TenHD);

    // Use custom start date if provided, otherwise use current date
    const NgayLap = NgayBatDau ? new Date(NgayBatDau) : new Date();
    const NgayHetHan = new Date(NgayLap);
    NgayHetHan.setMonth(NgayHetHan.getMonth() + 3);

    // Validate start date
    if (NgayBatDau && new Date(NgayBatDau) < new Date()) {
      return res.status(400).json({
        message: "Ngày bắt đầu hợp đồng không thể là ngày trong quá khứ",
      });
    }

    // Check room capacity
    console.log("Checking room capacity for MaPhong:", MaPhong);
    const checkCapa = await checkCapacityRoom(MaPhong);
    console.log("Room capacity check result:", checkCapa);

    if (!checkCapa) {
      return res.status(400).json({
        message: "Phòng đã đầy. Vui lòng chọn phòng khác!",
      });
    }

    // Create contract using Promise
    const createContractPromise = () => {
      return new Promise((resolve, reject) => {
        createContractModel(
          MaSV,
          MaPhong,
          MaQl,
          MaHD,
          NgayLap,
          NgayHetHan,
          TenHD,
          (err) => {
            if (err) {
              console.error("Error creating contract:", err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    };

    // Update history using Promise
    const updateHistoryPromise = () => {
      return new Promise((resolve, reject) => {
        updateHistoryStudentRoom(MaPhong, MaSV, "add", (err, result) => {
          if (err) {
            console.error("Error updating room history:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    // Execute both operations
    await createContractPromise();
    const historyResult = await updateHistoryPromise();

    // Update current student count in room based on active contracts
    const currentCount = await getCurrentStudentCountByRoom(MaPhong);
    const updateSuccess = await updateCurrentStudentCountModel(MaPhong, currentCount);
    
    if (!updateSuccess) {
      console.error("Failed to update room student count");
      // Don't return error here as contract was created successfully
    }

    console.log("Contract created successfully:", { MaHD, MaSV, MaPhong, TenHD, currentCount, NgayLap });
    return res.status(200).json({
      message: "Tạo hợp đồng thành công",
      maHD: MaHD,
      tenHD: TenHD,
      result: historyResult,
      currentStudentCount: currentCount,
    });
  } catch (error) {
    console.error("System error in createContract:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

const cancelContract = async (req, res) => {
  try {
    const { MaPhong, MaSV } = req.query;
    
    if (!MaPhong || !MaSV) {
      return res.status(400).json({ message: "Thiếu thông tin MaPhong hoặc MaSV" });
    }

    console.log("Canceling contract:", { MaPhong, MaSV });

    // Cancel contract using Promise
    const cancelContractPromise = () => {
      return new Promise((resolve, reject) => {
        cancelContractModel(MaSV, MaPhong, (err) => {
          if (err) {
            console.error("Error canceling contract:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    // Update history using Promise
    const updateHistoryPromise = () => {
      return new Promise((resolve, reject) => {
        updateHistoryStudentRoom(MaPhong, MaSV, "cancel", (err, result) => {
          if (err) {
            console.error("Error updating room history:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    // Execute both operations
    await cancelContractPromise();
    const historyResult = await updateHistoryPromise();

    // Update current student count in room based on active contracts
    const currentCount = await getCurrentStudentCountByRoom(MaPhong);
    const updateSuccess = await updateCurrentStudentCountModel(MaPhong, currentCount);
    
    if (!updateSuccess) {
      console.error("Failed to update room student count");
      // Don't return error here as contract was canceled successfully
    }

    console.log("Contract canceled successfully:", { MaPhong, MaSV, currentCount });
    return res.status(200).json({
      message: "Hủy hợp đồng thành công",
      result: historyResult,
      currentStudentCount: currentCount,
    });

  } catch (error) {
    console.error("System error in cancelContract:", error);
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

const extendContract = async (req, res) => {
  try {
    const { MaHD } = req.query;
    const { NgayHetHan } = req.body;
    
    if (!MaHD) {
      return res.status(400).json({ message: "Thiếu mã hợp đồng" });
    }

    const NgayLap = new Date();
    
    // Use custom date if provided, otherwise add 3 months to current date
    let newNgayHetHan;
    if (NgayHetHan) {
      newNgayHetHan = new Date(NgayHetHan);
      // Validate that the new date is in the future
      if (newNgayHetHan <= new Date()) {
        return res.status(400).json({ message: "Ngày hết hạn mới phải sau ngày hiện tại" });
      }
    } else {
      newNgayHetHan = new Date(NgayLap);
      newNgayHetHan.setMonth(newNgayHetHan.getMonth() + 3);
    }

    console.log("Extending contract:", { 
      MaHD, 
      NgayLap: NgayLap.toISOString(), 
      newNgayHetHan: newNgayHetHan.toISOString() 
    });

    extendContractModel(NgayLap, newNgayHetHan, MaHD, (err, result) => {
      if (err) {
        console.error("Error extending contract:", err);
        return res.status(500).json({ message: "Không thể gia hạn hợp đồng", error: err.message });
      } else {
        console.log("Contract extended successfully:", { MaHD, newNgayHetHan: newNgayHetHan.toISOString() });
        return res
          .status(200)
          .json({ 
            message: "Gia hạn hợp đồng thành công", 
            result: result,
            newExpiryDate: newNgayHetHan.toISOString()
          });
      }
    });
  } catch (error) {
    console.error("System error in extendContract:", error);
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

const getAllContract = async (req, res) => {
  try {
    const hopdong = await getAllContractModel();
    if (!hopdong)
      return res.status(404).json({ message: "ko lay dc hop dong" });
    return res
      .status(200)
      .json({ message: "lay danh sach thanh cong", result: hopdong });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const updateAllRoomStudentCounts = async (req, res) => {
  try {
    console.log("Updating all room student counts...");
    
    const success = await calculateAndUpdateAllRoomStudentCounts();
    
    if (success) {
      console.log("Successfully updated all room student counts");
      return res.status(200).json({
        message: "Cập nhật số sinh viên tất cả phòng thành công",
        success: true
      });
    } else {
      console.error("Failed to update all room student counts");
      return res.status(500).json({
        message: "Không thể cập nhật số sinh viên tất cả phòng",
        success: false
      });
    }
  } catch (error) {
    console.error("System error in updateAllRoomStudentCounts:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
      success: false
    });
  }
};

export { createContract, extendContract, cancelContract, getAllContract, updateAllRoomStudentCounts };
