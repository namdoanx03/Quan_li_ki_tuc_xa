import React, { useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const initialRows = [
  { id: 1, code: "P101", name: "Phòng 101", type: "Nam", capacity: 8, current: 5, price: "250000 đồng", block: "P1" },
  { id: 2, code: "P102", name: "Phòng 102", type: "Nam", capacity: 8, current: 6, price: "250000 đồng", block: "P1" },
  { id: 3, code: "P103", name: "Phòng 103", type: "Nam", capacity: 8, current: 7, price: "250000 đồng", block: "P1" },
  { id: 4, code: "P104", name: "Phòng 104", type: "Nam", capacity: 8, current: 7, price: "250000 đồng", block: "P3" },
  { id: 5, code: "P105", name: "Phòng 105", type: "Nam", capacity: 8, current: 8, price: "250000 đồng", block: "P4" },
  { id: 6, code: "P106", name: "Phòng 106", type: "Nam", capacity: 8, current: 8, price: "250000 đồng", block: "P6" },
  { id: 7, code: "P107", name: "Phòng 107", type: "Nữ", capacity: 8, current: 6, price: "250000 đồng", block: "P7" },
  { id: 8, code: "P108", name: "Phòng 108", type: "Nữ", capacity: 8, current: 5, price: "250000 đồng", block: "P8" },
  { id: 9, code: "P109", name: "Phòng 109", type: "Nữ", capacity: 8, current: 6, price: "250000 đồng", block: "P9" },
];

const totalPages = 3;

const RoomManagement = () => {
  const [rows] = useState(initialRows);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", gender: "Nam", dob: "", hometown: "", phone: "", status: "Chưa thuê" });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center ">
          <button className="text-4xl mr-10" onClick={() => navigate('/')}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase pl-64">QUẢN LÝ PHÒNG</h1>
        </div>

        {/* Form nhập (form sinh viên, không thay đổi khi chọn phòng) */}
        <div className="bg-[#E9F6FE] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          <div className="grid gap-y-4 mb-6 px-10">
            <div className="flex items-center ">
              <label className="font-bold mr-2 w-24">Mã SV:</label>
              <input className="border rounded py-1 px-2" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Tên SV:</label>
              <input className="border rounded py-1 px-2 " value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Giới tính:</label>
              <select className="border rounded py-1 px-2 " value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Ngày sinh:</label>
              <input className="border rounded py-1 px-2 " value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} placeholder="__/__/____" />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Quê quán:</label>
              <input className="border rounded py-1 px-2 " value={form.hometown} onChange={e => setForm(f => ({ ...f, hometown: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-24">Trạng thái:</label>
              <select className="border rounded py-1 px-2 " value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="Chưa thuê">Chưa thuê</option>
                <option value="Đã thuê">Đã thuê</option>
              </select>
            </div>
            <div className="flex items-center col-span-2">
              <label className="font-bold mr-2 w-24">SĐT:</label>
              <input className="border rounded py-1 px-2 " value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mb-2">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded">Thêm</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded">Sửa</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded">Xóa</button>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded">Làm mới</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">Lưu</button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded">Hủy</button>
          </div>
        </div>

        {/* Bảng dữ liệu phòng */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã phòng</th>
                <th className="border px-2 py-1">Tên phòng</th>
                <th className="border px-2 py-1">Loại phòng</th>
                <th className="border px-2 py-1">Sức chứa</th>
                <th className="border px-2 py-1">Số SV đang ở hiện tại</th>
                <th className="border px-2 py-1">Giá phòng / tháng</th>
                <th className="border px-2 py-1">Mã dãy</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={selected === row.id ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                  onClick={() => {
                    if (selected === row.id) {
                      setSelected(null);
                    } else {
                      setSelected(row.id);
                    }
                  }}
                >
                  <td className="border px-2 py-2 text-left font-medium">
                    <span className="inline-block w-5 text-center mr-2 align-middle">{selected === row.id ? "▶" : ""}</span>
                    {row.code}
                  </td>
                  <td className="border px-2 py-2">{row.name}</td>
                  <td className="border px-2 py-2">{row.type}</td>
                  <td className="border px-2 py-2">{row.capacity}</td>
                  <td className="border px-2 py-2">{row.current}</td>
                  <td className="border px-2 py-2">{row.price}</td>
                  <td className="border px-2 py-2">{row.block}</td>
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

export default RoomManagement;