import {
  addServiceModel,
  allServiceModel,
  deleteServiceModel,
  updateServiceModel,
} from "../models/serviceModel.js";

const addService = async (req, res) => {
  try {
    const service = req.body;
     addServiceModel(service, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "ko the them dich vu", error: err });
      else if (!result)
        return res.status(404).json({ message: "ko thay ket qua" });

      return res
        .status(200)
        .json({ message: "them dich vu thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const updateService = async (req, res) => {
  try {
    const updateIfService = req.body; //array
    const {MaDV} = req.query;
    
     updateServiceModel(MaDV, updateIfService, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "ko the cap nhat dich vu", error: err });
      else if (result)
        res
          .status(200)
          .json({ message: "cap nhat thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const deleteService = async (req, res) => {
  try {
    const {MaDV} = req.query;
     deleteServiceModel(MaDV, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "ko xoa dc dich vu", error: err });
      else if (result)
        return res
          .status(200)
          .json({ message: "xoa dich vu thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const getAllService = async (req, res) => {
  try {
     allServiceModel((err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "ko lay dc danh sach dich vu", error: err });
      else if (result)
        return res
          .status(200)
          .json({ message: "lay danh sach thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

export { addService, updateService, deleteService, getAllService };
