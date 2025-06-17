import {
  findUserByEmailQl,
  addStudent,
  deleteStudentModel,
  getStudentAllModel,
  getStudentByMaSVModel,
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = async (id, role) => {
  return jwt.sign({ id, role }, process.env.lwt_secret, {
    expiresIn: "1d",
  });
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
     findUserByEmailQl(email, (err, result) => {
      if (err)
        return res.status(500).json({ error: err, message: "thong bao loi" });
      if (!result)
        return res.status(404).json({ message: "ko tim thay nguoi quan ly" });
      if (password !== result.password) {
        return res.status(400).json({ message: "mat khau khong dung" });
      }

      const token = createToken(result.MaQl, result.ChucVu);

      return res
        .status(200)
        .json({ message: "dang nhap thanh cong", result, token });
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

const createStudent = async (req, res) => {
  try {
    const student = req.body;
     addStudent(student, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "loi them sinh vien", error: err });
      return res
        .status(200)
        .json({ message: "them thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const {MaSV} = req.body;
     deleteStudentModel(MaSV, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "loi xoa sinh vien", error: err });
      else if (!result)
        return res
          .status(404)
          .json({ message: "ko thay sinh vien", result: result });

      return res
        .status(200)
        .json({ message: "xoa thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const getAllStudent = async (req, res) => {
  try {
     getStudentAllModel((err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "loi lay danh sach sinh vien", error: err });
      else if (!result)
        return res
          .status(404)
          .json({ message: "ko thay sinh vien", result: result });

      return res
        .status(200)
        .json({ message: "lay danh sach thanh cong", result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: "loi he thong", error: error });
  }
};

const getStudentByMaSV = async(req, res) => {
  try {
    const {MaSV} = req.query;
    
     getStudentByMaSVModel(MaSV, (err, result) => {
      if(err) return res.status(500).json({message:"loi tim sinh vien", error:err});
      else if(!result) res.status(404).json({message:"ko thay sinh vien", result:result});

      return res.status(200).json({message:"lay sinh vien thanh cong", result:result})
    })
  } catch (error) {
    return res.status.json({message:"loi he thong", error:error})
  }
}

export { login, createStudent, deleteStudent, getAllStudent, getStudentByMaSV };
