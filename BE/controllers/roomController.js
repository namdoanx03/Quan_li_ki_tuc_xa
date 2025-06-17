import { updateRoomRowRoomModel } from "../models/historyRoomRowRoomModel.js";
import {
  addRoomModel,
  deleteRoomModel,
  updateRoomModel,
} from "../models/roomModel.js";

import { checkCapacityRowRoom } from "./rowOfRoomController.js";

const addRoom = async (req, res) => {
  const room = req.body;
  const checkCapacity = await checkCapacityRowRoom(room.MaDayPhong)
  
  if(!checkCapacity) return res.status(404).json({message:"day phong da day. Vui long chon day khac !"}) 
  addRoomModel(room, (err) => {
    if (err) {
      return res.status(500).json({ message: "ko them dc phong", error: err });
    }
    const MaDayPhong = room.MaDayPhong;
    const MaPhong = room.MaPhong;

    updateRoomRowRoomModel(MaDayPhong,MaPhong, "add", (err, result) => {
      if (err) {
        return res.status(500).json({ message: "ko cap nhat dc lich su so phong", error: err });
      }
      return res.status(200).json({message:"them thanh cong", result:result})
    });
  });
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

  deleteRoomModel(MaPhong, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "ko xoa dc phong", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Phòng không tồn tại để xóa" });
    }
    updateRoomRowRoomModel(MaDayPhong, MaPhong, "delete", (err,row) => {
      if (err) {
        return res.
        status(500).json({ message: "ko cap nhat dc lich su so phong", error: err });
      }
      return res.status(200).json({message:"xoa thanh cong thanh cong", row:row})
    })
  });
};

export { addRoom, updateRoom, deleteRoom };
