import { getCapacityNowRowRoomModel } from "../models/historyRoomRowRoomModel.js";
import { addRowRoomModel, capacityRowRoomModel, deleteRowRoomModel, getAllRowRoomModel, updateRowRoomModel } from "../models/rowRoomModel.js";

const addRowRoom = async (req, res) => {
    try {
        const rowRoom = req.body;
         addRowRoomModel(rowRoom, (err, result) => {
            if(err) return res.status(500).json({message: "ko them dc day phong", err:err})
            if(result) return res.status(200).json({message:"them day phong thanh cong", result:result})
        })
    } catch (error) {
        return res.status(500).json({message:"loi he thong", error:error})
    }
}

const updateRowRoom = async (req,res) =>{
    try {
        const updateIfRowRoom = req.body;
        const {MaDayPhong} = req.query;
         updateRowRoomModel(MaDayPhong, updateIfRowRoom, (err, result) => {
            if(err) return res.status(500).json({message:"ko cap nhat dc day phong", err:err})
            else if(result) return res.status(200).json({message:"cap nhat thanh cong", result:result})
        })
    } catch (error) {
        return res.status(500).json({message:"loi he thong", error:error})
    }
}

const deleteRowOfRoom = async (req, res) => {
    try {
        const {MaDayPhong} = req.query;
         deleteRowRoomModel(MaDayPhong, (err, result) => {
            if(err) return res.status(500).json({message:"ko xoa dc", err:err});
            else if(result) return res.status(200).json({message:"xoa thanh cong", result:result})
        })
    } catch (error) {
        return res.status(500).json({message:"loi he thong", error:error})
    }
}

const getAllRowRoom = async (req, res) => {
    try {
         getAllRowRoomModel((err, result) => {
            if(err) return res.status(500).json({message:"ko lay dc", err:err});
            else if(result) return res.status(200).json({message:"lay thanh cong", result:result})
        })
    } catch (error) {
        return res.status(500).json({message:"loi he thong", error:error})
    }
}

const checkCapacityRowRoom = async (MaDayPhong) => {
    const capacityNow = await getCapacityNowRowRoomModel(MaDayPhong)
    const capacity = await capacityRowRoomModel(MaDayPhong)
    // console.log(MaDayPhong);
    // console.log(capacity);
    // console.log(capacityNow);
    if(parseInt(capacity) > parseInt(capacityNow)) return 1;
    return 0;
}
export {addRowRoom, updateRowRoom, deleteRowOfRoom, getAllRowRoom, checkCapacityRowRoom}