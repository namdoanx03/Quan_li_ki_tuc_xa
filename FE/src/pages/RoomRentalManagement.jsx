import React, { useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const initialRows = [
  { id: 1, code: "P101", name: "Phòng 101", type: "Nam", capacity: 8, current: 6, price: "250000 đồng", status: "Còn trống" },
  { id: 2, code: "P102", name: "Phòng 102", type: "Nam", capacity: 8, current: 5, price: "250000 đồng", status: "Còn trống" },
  { id: 3, code: "P103", name: "Phòng 103", type: "Nam", capacity: 8, current: 7, price: "250000 đồng", status: "Còn trống" },
  { id: 4, code: "P104", name: "Phòng 104", type: "Nam", capacity: 8, current: 7, price: "250000 đồng", status: "Còn trống" },
  { id: 5, code: "P105", name: "Phòng 105", type: "Nam", capacity: 8, current: 8, price: "250000 đồng", status: "Đã đầy" },
  { id: 6, code: "P106", name: "Phòng 106", type: "Nữ", capacity: 8, current: 8, price: "250000 đồng", status: "Đã đầy" },
  { id: 7, code: "P107", name: "Phòng 107", type: "Nữ", capacity: 8, current: 6, price: "250000 đồng", status: "Còn trống" },
  { id: 8, code: "P108", name: "Phòng 108", type: "Nữ", capacity: 8, current: 5, price: "250000 đồng", status: "Còn trống" },
  { id: 9, code: "P109", name: "Phòng 109", type: "Nữ", capacity: 8, current: 6, price: "250000 đồng", status: "Còn trống" },
];

const RoomRentalManagement = () => {
  const [rows] = useState(initialRows);
  const [form, setForm] = useState({
    rentalId: "",
    date: "2025-06-17",
    studentId: "",
    roomCode: "",
  });
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbeafe] mt-6">
      <div className="rounded-xl shadow-lg w-full max-w-6xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-5 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-10" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide uppercase flex-1">QUẢN LÝ THUÊ PHÒNG</h1>
        </div>

        {/* Form thuê phòng */}
        <div className="bg-[#e3f1fb] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center mb-2">
            <div className="flex items-center mb-2">
              <label className="font-bold mr-2 w-24">ID Thuê:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.rentalId} onChange={e => setForm(f => ({ ...f, rentalId: e.target.value }))} />
            </div>
            <div className="flex items-center mb-2">
              <label className="font-bold mr-2 w-24">Ngày tháng:</label>
              <input type="date" className="border rounded py-1 px-2 w-40" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <button className="ml-2 text-gray-500 hover:text-red-500 text-lg font-bold" onClick={() => setForm(f => ({ ...f, date: "" }))}>×</button>
            </div>
            <div className="flex items-center mb-2">
              <label className="font-bold mr-2 w-24">Mã SV:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} />
            </div>
            <div className="flex items-center mb-2">
              <label className="font-bold mr-2 w-24">Mã phòng:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.roomCode} onChange={e => setForm(f => ({ ...f, roomCode: e.target.value }))} />
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-2 ml-1">(Chọn một mã ở bảng phía dưới)</div>
          <div className="flex flex-wrap gap-4 justify-end mt-2">
            <button className="border border-gray-400 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-2 rounded">Tạo hợp đồng</button>
            <button className="border border-gray-400 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-2 rounded">Gia hạn</button>
            <button className="border border-gray-400 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-2 rounded">Tạo hóa đơn</button>
            <button className="border border-gray-400 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded">Hủy</button>
          </div>
        </div>

        {/* Bảng phòng */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F9E9B4]">
              <tr>
                <th className="border px-2 py-1">Mã phòng</th>
                <th className="border px-2 py-1">Tên phòng</th>
                <th className="border px-2 py-1">Loại phòng</th>
                <th className="border px-2 py-1">Sức chứa</th>
                <th className="border px-2 py-1">Số SV đang ở hiện tại</th>
                <th className="border px-2 py-1">Giá phòng / tháng</th>
                <th className="border px-2 py-1">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={selected === row.id ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-white"}
                  onClick={() => {
                    if (selected === row.id) {
                      setSelected(null);
                      setForm(f => ({ ...f, roomCode: "" }));
                    } else {
                      setSelected(row.id);
                      setForm(f => ({ ...f, roomCode: row.code }));
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
                  <td className="border px-2 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomRentalManagement;