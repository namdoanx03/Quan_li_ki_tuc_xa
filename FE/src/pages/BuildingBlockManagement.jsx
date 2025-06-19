import React, { useState, useEffect } from "react";
import { FcSearch, FcDepartment, FcPortraitMode, FcKindle, FcHome, FcComboChart, FcNews, FcServices } from "react-icons/fc";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";




const BuildingBlockManagement = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", rooms: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Lấy danh sách dãy phòng khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          method: SummaryApi.getAllRowRoom.method,
          url: baseURL + SummaryApi.getAllRowRoom.url,
        });
        if (res.data && res.data.result) {
          setRows(res.data.result.map((r, idx) => ({
            id: idx + 1,
            code: r.MaDayPhong,
            name: r.TenDayPhong,
            rooms: r.SoPhongCuaDay,
          })));
        }
      } catch (err) {
        setError("Không lấy được danh sách dãy phòng!");
      }
    };
    fetchData();
  }, []);

  // Lấy mã dãy phòng tự động
  const generateCode = async () => {
    try {
      const res = await axios({
        method: SummaryApi.generateMaDayPhong.method,
        url: baseURL + SummaryApi.generateMaDayPhong.url,
      });
      if (res.data && res.data.result) {
        setForm(prev => ({ ...prev, code: res.data.result }));
      }
    } catch (err) {
      setError("Không thể tạo mã tự động!");
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

  // Thêm dãy phòng
  const handleAdd = async () => {
    setError(""); setSuccess("");
    if (!form.name || !form.rooms) {
      setError("Vui lòng nhập đầy đủ thông tin!"); return;
    }
    
    if (isNaN(form.rooms) || parseInt(form.rooms) <= 0) {
      setError("Số phòng phải là số dương!"); return;
    }
    
    try {
      console.log("=== BẮT ĐẦU THÊM DÃY PHÒNG ===");
      console.log("Form data:", form);
      
      // Tự động generate mã dãy phòng
      console.log("1. Đang tạo mã tự động...");
      const codeRes = await axios({
        method: SummaryApi.generateMaDayPhong.method,
        url: baseURL + SummaryApi.generateMaDayPhong.url,
      });
      
      console.log("Response tạo mã:", codeRes.data);
      
      if (!codeRes.data || !codeRes.data.result) {
        setError("Không thể tạo mã tự động!"); return;
      }
      
      const generatedCode = codeRes.data.result;
      console.log("2. Mã được tạo:", generatedCode);
      
      console.log("3. Đang thêm dãy phòng...");
      const res = await axios({
        method: SummaryApi.addRowRoom.method,
        url: baseURL + SummaryApi.addRowRoom.url,
        data: {
          MaDayPhong: generatedCode,
          TenDayPhong: form.name,
          SoPhongCuaDay: parseInt(form.rooms),
        },
      });
      
      console.log("Response thêm dãy phòng:", res.data);
      
      setSuccess("Thêm dãy phòng thành công!");
      setForm({ code: "", name: "", rooms: "" });
      setSelected(null);
      
      console.log("4. Đang reload danh sách...");
      // Reload lại danh sách
      const reload = await axios({ method: SummaryApi.getAllRowRoom.method, url: baseURL + SummaryApi.getAllRowRoom.url });
      if (reload.data && reload.data.result) {
        setRows(reload.data.result.map((r, idx) => ({ id: idx + 1, code: r.MaDayPhong, name: r.TenDayPhong, rooms: r.SoPhongCuaDay }))); }
      
      console.log("=== HOÀN THÀNH THÊM DÃY PHÒNG ===");
    } catch (err) {
      console.error("=== LỖI THÊM DÃY PHÒNG ===");
      console.error("Error:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      setError(err.response?.data?.message || "Thêm thất bại!");
    }
  };

  // Sửa dãy phòng
  const handleEdit = async () => {
    setError(""); setSuccess("");
    if (selected == null) { setError("Vui lòng chọn dãy để sửa!"); return; }
    if (!form.name || !form.rooms) { setError("Vui lòng nhập đầy đủ thông tin!"); return; }
    
    if (isNaN(form.rooms) || parseInt(form.rooms) <= 0) {
      setError("Số phòng phải là số dương!"); return;
    }
    
    try {
      const res = await axios({
        method: SummaryApi.updateRowRoom.method,
        url: baseURL + SummaryApi.updateRowRoom.url + `?MaDayPhong=${form.code}`,
        data: {
          TenDayPhong: form.name,
          SoPhongCuaDay: parseInt(form.rooms),
        },
      });
      setSuccess("Sửa dãy phòng thành công!");
      if (res.data && res.data.result) {
        setRows(rows.map(r =>
          r.code === form.code
            ? { ...r, name: res.data.result.TenDayPhong, rooms: res.data.result.SoPhongCuaDay }
            : r
        ));
      } else {
        setRows(rows.map(r =>
          r.code === form.code
            ? { ...r, name: form.name, rooms: parseInt(form.rooms) }
            : r
        ));
      }
      setForm({ code: "", name: "", rooms: "" });
      setSelected(null);
    } catch (err) {
      setError(err.response?.data?.message || "Sửa thất bại!");
    }
  };

  // Xóa dãy phòng
  const handleDelete = async () => {
    setError(""); setSuccess("");
    if (selected == null) { setError("Vui lòng chọn dãy để xóa!"); return; }
    
    try {
      const res = await axios({
        method: SummaryApi.deleteRowRoom.method,
        url: baseURL + SummaryApi.deleteRowRoom.url + `?MaDayPhong=${form.code}`,
      });
      setSuccess("Xóa dãy phòng thành công!");
      setForm({ code: "", name: "", rooms: "" });
      setSelected(null);
      // Reload lại danh sách
      const reload = await axios({ method: SummaryApi.getAllRowRoom.method, url: baseURL + SummaryApi.getAllRowRoom.url });
      if (reload.data && reload.data.result) {
        setRows(reload.data.result.map((r, idx) => ({ id: idx + 1, code: r.MaDayPhong, name: r.TenDayPhong, rooms: r.SoPhongCuaDay }))); }
    } catch (err) {
      setError(err.response?.data?.message || "Xóa thất bại!");
    }
  };

  // Làm mới
  const handleReset = () => {
    setError(""); setSuccess("");
    setForm({ code: "", name: "", rooms: "" });
    setSelected(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-2">
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center ">
          <button className="text-4xl mr-10" onClick={() => navigate('/')}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase pl-64">QUẢN LÝ DÃY PHÒNG</h1>
        </div>

        {/* Form nhập */}
        <div className="bg-[#E9F6FE] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          <h2 className="text-xl font-bold mb-4">Thông tin dãy phòng</h2>
          <div className="flex flex-wrap gap-6 mb-5 justify-center">
            <div className="flex items-center">
              <label className="mb-1 font-bold mr-2">Tên dãy:</label>
              <input 
                className="border rounded py-1 w-[150px] px-2" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Nhập tên dãy"
              />
            </div>
            <div className="flex items-center">
              <label className="mb-1 font-bold mr-2">Số phòng:</label>
              <input 
                className="border rounded py-1 w-[100px] px-2" 
                value={form.rooms} 
                onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))}
                placeholder="Số phòng"
                type="number"
                min="1"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded" onClick={handleAdd}>Thêm</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded" onClick={handleEdit}>Sửa</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded" onClick={() => {
              if (selected == null) {
                setError("Vui lòng chọn dãy để xóa!");
                return;
              }
              setShowDeleteModal(true);
            }}>Xóa</button>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded" onClick={handleReset}>Làm mới</button>
            {error && <div className="w-full text-center text-red-500 font-semibold mt-2">{error}</div>}
            {success && <div className="w-full text-center text-green-500 font-semibold mt-2">{success}</div>}
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã dãy phòng</th>
                <th className="border px-2 py-1">Tên dãy phòng</th>
                <th className="border px-2 py-1">Tổng số phòng</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((row, idx) => (
                <tr
                  key={row.id}
                  className={selected === row.id ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                  onClick={() => {
                    if (selected === row.id) {
                      setSelected(null);
                      setForm({ code: "", name: "", rooms: "" });
                    } else {
                      setSelected(row.id);
                      setForm({ code: row.code, name: row.name, rooms: row.rooms.toString() });
                    }
                  }}
                >
                  <td className="border px-2 py-2 text-left">
                    <span className="inline-block w-5 text-center mr-2 align-middle">{selected === row.id ? "▶" : ""}</span>
                    {row.code}
                  </td>
                  <td className="border px-2 py-2">{row.name}</td>
                  <td className="border px-2 py-2">{row.rooms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 border-t mt-6 px-6 py-4 rounded-b-xl">
          {/* PHÂN TRANG MỚI */}
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
                <span key={idx} className="px-2 text-gray-500">...</span>
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

        {/* Modal xác nhận xóa */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h2 className="text-lg font-bold mb-4 text-center">Xác nhận xóa</h2>
              <p className="mb-6 text-center">Bạn có chắc chắn muốn xóa dãy phòng này?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    setShowDeleteModal(false);
                    await handleDelete();
                  }}
                >
                  Xóa
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingBlockManagement;