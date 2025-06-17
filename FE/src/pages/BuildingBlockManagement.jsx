import React, { useState } from "react";
import { FcSearch, FcDepartment, FcPortraitMode, FcKindle, FcHome, FcComboChart, FcNews, FcServices } from "react-icons/fc";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const functionButtons = [
  {
    name: "Quản lý dãy phòng",
    icon: <FcDepartment size={40} />,
    border: false,
  },
  {
    name: "Quản lý sinh viên",
    icon: <FcPortraitMode size={40} />,
    border: false,
  },
  {
    name: "Quản lý dịch vụ",
    icon: <FcServices size={40} />,
    border: true,
  },
  {
    name: "Quản lý phòng",
    icon: <FcHome size={40} />,
    border: false,
  },
  {
    name: "Quản lý thuê phòng",
    icon: <FcNews size={40} />,
    border: false,
  },
  {
    name: "Tìm kiếm",
    icon: <FcSearch size={40} />,
    border: false,
  },
  {
    name: "Thống kê, báo cáo",
    icon: <FcComboChart size={40} />,
    border: true,
  },
];

const initialRows = [
  { id: 1, code: "P1", name: "Dãy P1", rooms: 9 },
  { id: 2, code: "P2", name: "Dãy P2", rooms: 9 },
  { id: 3, code: "P3", name: "Dãy P3", rooms: 9 },
  { id: 4, code: "P4", name: "Dãy P4", rooms: 9 },
  { id: 5, code: "P5", name: "Dãy P5", rooms: 9 },
];

const totalPages = 7;

const BuildingBlockManagement = () => {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState(1);
  const [form, setForm] = useState({ code: "", name: "", rooms: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
              <label className="mb-1 font-bold mr-2">Mã dãy:</label>
              <input className="border rounded py-1 w-[150px]" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="mb-1 font-bold mr-2">Tên dãy:</label>
              <input className="border rounded py-1 w-[150px]" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="mb-1 font-bold mr-2">Số phòng:</label>
              <input className="border rounded py-1 w-[150px]" value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded">Thêm</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded">Sửa</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded">Xóa</button>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded">Làm mới</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">Lưu</button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded">Hủy</button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã dãy phòng</th>
                <th className="border px-2 py-1">Tên dãy phòng</th>
                <th className="border px-2 py-1">Số phòng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={selected === row.id ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                  onClick={() => {
                    setSelected(row.id);
                    setForm({ code: row.code, name: row.name, rooms: row.rooms.toString() });
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
      </div>
    </div>
  );
};

export default BuildingBlockManagement;