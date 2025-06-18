import React, { useState, useEffect } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const StudentManagement = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ 
    code: "", 
    name: "", 
    gender: "Nam", 
    dob: "", 
    hometown: "", 
    phone: "", 
    status: "Chưa thuê" 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const itemsPerPage = 5;

  // Lấy danh sách sinh viên khi load trang
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios({
        method: SummaryApi.getAllStudent.method,
        url: baseURL + SummaryApi.getAllStudent.url,
      });
      if (res.data && res.data.result) {
        setRows(res.data.result);
      }
    } catch (err) {
      setError("Không lấy được danh sách sinh viên!");
    }
  };

  // Tính toán số trang
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rows.slice(startIndex, endIndex);
  };

  function renderPagination() {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage, "...", totalPages];
      }
    }
    return pages;
  }

  // Thêm sinh viên
  const handleAdd = async () => {
    setError("");
    setSuccess("");
    if (!form.code || !form.name || !form.gender || !form.dob || !form.hometown || !form.phone) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await axios({
        method: SummaryApi.addStudent.method,
        url: baseURL + SummaryApi.addStudent.url,
        data: {
          MaSV: form.code,
          TenSV: form.name,
          GioiTinh: form.gender,
          NamSinh: form.dob,
          DiaChi: form.hometown,
          SDT: form.phone,
          ChucVu: form.status,
          email: `${form.code.toLowerCase()}@gmail.com` // Tạo email mặc định từ mã sinh viên
        }
      });

      if (res.data && res.data.message === "them thanh cong") {
        setSuccess("Thêm sinh viên thành công!");
        setForm({
          code: "",
          name: "",
          gender: "Nam",
          dob: "",
          hometown: "",
          phone: "",
          status: "Chưa thuê"
        });
        fetchStudents();
      } else {
        setError(res.data.message || "Không thể thêm sinh viên!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Không thể thêm sinh viên!");
    }
  };

  // Sửa sinh viên
  const handleEdit = async () => {
    setError("");
    setSuccess("");
    if (!selected) {
      setError("Vui lòng chọn sinh viên cần sửa!");
      return;
    }
    if (!form.name || !form.gender || !form.dob || !form.hometown || !form.phone) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const res = await axios({
        method: SummaryApi.updateStudent.method,
        url: baseURL + SummaryApi.updateStudent.url + `?MaSV=${selected.MaSV}`,
        data: {
          TenSV: form.name,
          NamSinh: form.dob,
          DiaChi: form.hometown,
          ChucVu: form.status,
          GioiTinh: form.gender,
          SDT: form.phone,
          email: selected.email || `${form.code.toLowerCase()}@gmail.com`
        }
      });
      console.log(res);
      if ((res.data && res.data.success) ||  res.status === 200) {
        setSuccess("Sửa thông tin sinh viên thành công!");
        setForm({
          code: "",
          name: "",
          gender: "Nam",
          dob: "",
          hometown: "",
          phone: "",
          status: "Chưa thuê"
        });
        setSelected(null);
        fetchStudents();
      } else {
        setError(res.data.message || "Không thể sửa thông tin sinh viên!");
      }
    } catch (err) {
      setError(
        (err.response && JSON.stringify(err.response.data)) ||
        err.message ||
        "Không thể sửa thông tin sinh viên!"
      );
    }
  };

  // Xóa sinh viên
  const handleDelete = async () => {
    setError("");
    setSuccess("");
    if (!selected) {
      setError("Vui lòng chọn sinh viên cần xóa!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        const res = await axios({
          method: SummaryApi.deleteStudent.method,
          url: baseURL + SummaryApi.deleteStudent.url,
          data: { MaSV: selected.MaSV }
        });
        if (res.data && res.data.message === "xoa thanh cong") {
          setSuccess("Xóa sinh viên thành công!");
          setForm({
            code: "",
            name: "",
            gender: "Nam",
            dob: "",
            hometown: "",
            phone: "",
            status: "Chưa thuê"
          });
          setSelected(null);
          fetchStudents();
        } else {
          setError(res.data.message || "Không thể xóa sinh viên!");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể xóa sinh viên!");
      }
    }
  };

  // Làm mới
  const handleRefresh = () => {
    setForm({
      code: "",
      name: "",
      gender: "Nam",
      dob: "",
      hometown: "",
      phone: "",
      status: "Chưa thuê"
    });
    setSelected(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center ">
          <button className="text-4xl mr-10" onClick={() => navigate('/')}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase pl-64">QUẢN LÝ SINH VIÊN</h1>
        </div>

        {/* Form nhập */}
        <div className="bg-[#E9F6FE] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          <div className="grid gap-y-4 mb-6 px-10">
            <div className="flex items-center ">
              <label className="font-bold mr-2 w-24">Mã SV:</label>
              <input 
                className="border rounded py-1 px-2" 
                value={form.code} 
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                disabled={selected !== null}
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Tên SV:</label>
              <input 
                className="border rounded py-1 px-2" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Giới tính:</label>
              <select 
                className="border rounded py-1 px-2" 
                value={form.gender} 
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Ngày sinh:</label>
              <input 
                type="date"
                className="border rounded py-1 px-2" 
                value={form.dob} 
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} 
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Quê quán:</label>
              <input 
                className="border rounded py-1 px-2" 
                value={form.hometown} 
                onChange={e => setForm(f => ({ ...f, hometown: e.target.value }))} 
              />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Trạng thái:</label>
              <select 
                className="border rounded py-1 px-2" 
                value={form.status} 
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="Chưa thuê">Chưa thuê</option>
                <option value="Đã thuê">Đã thuê</option>
              </select>
            </div>
            <div className="flex items-center col-span-2">
              <label className="font-bold mr-2 w-24">SĐT:</label>
              <input 
                className="border rounded py-1 px-2" 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mb-2">
            <button 
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
            >
              Thêm
            </button>
            <button 
              onClick={handleEdit}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded"
            >
              Sửa
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
            >
              Xóa
            </button>
            <button 
              onClick={handleRefresh}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded"
            >
              Làm mới
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã SV</th>
                <th className="border px-2 py-1">Họ và tên</th>
                <th className="border px-2 py-1">Giới tính</th>
                <th className="border px-2 py-1">Ngày sinh</th>
                <th className="border px-2 py-1">Quê quán</th>
                <th className="border px-2 py-1">Số điện thoại</th>
                <th className="border px-2 py-1">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((row) => (
                <tr
                  key={row.MaSV}
                  className={selected?.MaSV === row.MaSV ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                  onClick={() => {
                    if (selected?.MaSV === row.MaSV) {
                      setSelected(null);
                      setForm({
                        code: "",
                        name: "",
                        gender: "Nam",
                        dob: "",
                        hometown: "",
                        phone: "",
                        status: "Chưa thuê"
                      });
                    } else {
                      setSelected(row);
                      setForm({
                        code: row.MaSV,
                        name: row.TenSV,
                        gender: row.GioiTinh,
                        dob: row.NamSinh,
                        hometown: row.DiaChi,
                        phone: row.SDT,
                        status: row.ChucVu
                      });
                    }
                  }}
                >
                  <td className="border px-2 py-2 text-left font-medium">
                    <span className="inline-block w-5 text-center mr-2 align-middle">
                      {selected?.MaSV === row.MaSV ? "▶" : ""}
                    </span>
                    {row.MaSV}
                  </td>
                  <td className="border px-2 py-2">{row.TenSV}</td>
                  <td className="border px-2 py-2">{row.GioiTinh}</td>
                  <td className="border px-2 py-2">{row.NamSinh}</td>
                  <td className="border px-2 py-2">{row.DiaChi}</td>
                  <td className="border px-2 py-2">{row.SDT}</td>
                  <td className="border px-2 py-2">{row.ChucVu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 border-t mt-6 px-6 py-4 rounded-b-xl">
          {/* PHÂN TRANG */}
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              &larr; Previous
            </button>
            {renderPagination().map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className={`px-3 py-1 rounded border font-medium ${
                    currentPage === p
                      ? "border-orange-400 text-orange-600 bg-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;