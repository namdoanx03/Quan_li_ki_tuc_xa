import React, { useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const initialRows = [
  { id: 1, code: "D01", date: "30/4/2025", room: "P101", prev: 0, curr: 50, total: "102222 đồng", status: "Đã thanh toán" },
  { id: 2, code: "D02", date: "10/3/2025", room: "P102", prev: 20, curr: 70, total: "102222 đồng", status: "Chưa thanh toán" },
  { id: 3, code: "D03", date: "3/4/2025", room: "P103", prev: 0, curr: 60, total: "123211 đồng", status: "Đã thanh toán" },
  { id: 4, code: "D04", date: "10/4/2025", room: "P104", prev: 0, curr: 50, total: "102222 đồng", status: "Đã thanh toán" },
  { id: 5, code: "D05", date: "20/4/2025", room: "P105", prev: 0, curr: 50, total: "102222 đồng", status: "Đã thanh toán" },
  { id: 6, code: "D06", date: "7/4/2025", room: "P106", prev: 0, curr: 50, total: "102222 đồng", status: "Đã thanh toán" },
  { id: 7, code: "D07", date: "8/4/2025", room: "P107", prev: 0, curr: 50, total: "102222 đồng", status: "Đã thanh toán" },
  { id: 8, code: "D08", date: "9/4/2025", room: "P108", prev: 0, curr: 50, total: "102222 đồng", status: "Chưa thanh toán" },
  { id: 9, code: "D09", date: "10/4/2025", room: "P109", prev: 0, curr: 50, total: "102222 đồng", status: "Đã thanh toán" },
];

const ServiceManagement = () => {
  const [rows] = useState(initialRows);
  const [selected, setSelected] = useState(1);
  const [form, setForm] = useState({
    ghiSoDien: true,
    thanhToan: true,
    date: "30/4/2025",
    room: "P101",
    prev: 0,
    curr: 50,
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-10" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase flex-1">QUẢN LÝ DỊCH VỤ</h1>
        </div>

        {/* Form dịch vụ */}
        <div className="bg-[#E3F1FB] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center justify-center mb-4">
            <div className="flex items-center mr-4">
              <input type="checkbox" checked={form.ghiSoDien} onChange={e => setForm(f => ({ ...f, ghiSoDien: e.target.checked }))} className="mr-2" id="ghisodien" />
              <label htmlFor="ghisodien" className="font-semibold">Ghi số điện</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked={form.thanhToan} onChange={e => setForm(f => ({ ...f, thanhToan: e.target.checked }))} className="mr-2" id="thanhtoan" />
              <label htmlFor="thanhtoan" className="font-semibold">Thanh toán</label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 justify-center items-center max-w-3xl mx-auto">
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Ngày tháng:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Mã phòng:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Chỉ số CT tháng trước:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.prev} onChange={e => setForm(f => ({ ...f, prev: e.target.value }))} />
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Chỉ số sau:</label>
              <input className="border rounded py-1 px-2 w-40" value={form.curr} onChange={e => setForm(f => ({ ...f, curr: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-6 mb-2">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded">Thêm</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-2 rounded">Sửa</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-2 rounded">Xóa</button>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-2 rounded">Làm mới</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded">Lưu</button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded">Hủy</button>
          </div>
        </div>

        {/* Bảng dịch vụ */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã dịch vụ</th>
                <th className="border px-2 py-1">Ngày tháng</th>
                <th className="border px-2 py-1">Mã phòng</th>
                <th className="border px-2 py-1">Chỉ số CT trước</th>
                <th className="border px-2 py-1">Chỉ số sau</th>
                <th className="border px-2 py-1">Tổng tiền</th>
                <th className="border px-2 py-1">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
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
                  <td className="border px-2 py-2">{row.date}</td>
                  <td className="border px-2 py-2">{row.room}</td>
                  <td className="border px-2 py-2">{row.prev}</td>
                  <td className="border px-2 py-2">{row.curr}</td>
                  <td className="border px-2 py-2">{row.total}</td>
                  <td className="border px-2 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: nút Xem và Thanh toán */}
        <div className="flex flex-row items-center justify-center gap-4 bg-blue-50 border-t mt-6 px-6 py-4 rounded-b-xl">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded">Xem</button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded">Thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;