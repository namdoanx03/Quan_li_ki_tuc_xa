import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

const initialRows = [
  { id: 1, code: "P101", name: "Phòng 101", type: "Nam", capacity: 8, current: 5, price: "250000 đồng", block: "P1" },
  { id: 2, code: "P102", name: "Phòng 102", type: "Nam", capacity: 8, current: 6, price: "250000 đồng", block: "P1" },
  { id: 3, code: "P103", name: "Phòng 103", type: "Nam", capacity: 8, current: 7, price: "250000 đồng", block: "P1" },
  { id: 4, code: "P104", name: "Phòng 104", type: "Nam", capacity: 8, current: 7, price: "250000 đồng", block: "P3" },
  { id: 5, code: "P105", name: "Phòng 105", type: "Nam", capacity: 8, current: 8, price: "250000 đồng", block: "P4" },
  { id: 6, code: "P106", name: "Phòng 106", type: "Nữ", capacity: 8, current: 8, price: "250000 đồng", block: "P6" },
  { id: 7, code: "P107", name: "Phòng 107", type: "Nữ", capacity: 8, current: 6, price: "250000 đồng", block: "P7" },
  { id: 8, code: "P108", name: "Phòng 108", type: "Nữ", capacity: 8, current: 5, price: "250000 đồng", block: "P8" },
  { id: 9, code: "P109", name: "Phòng 109", type: "Nữ", capacity: 8, current: 6, price: "250000 đồng", block: "P9" },
  { id: 10, code: "P201", name: "Phòng 110", type: "Nam", capacity: 8, current: 8, price: "250000 đồng", block: "P2" },
  { id: 11, code: "P202", name: "Phòng 111", type: "Nam", capacity: 8, current: 8, price: "250000 đồng", block: "P2" },
];

const DataReport = () => {
  const [selected, setSelected] = useState(1);
  const [statType, setStatType] = useState("empty");
  const navigate = useNavigate();
  // Giả lập số liệu
  const totalRooms = 45;
  const emptyRooms = 28;
  const fullRooms = 17;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 mt-6">
      <div className="rounded-xl shadow-lg w-full max-w-6xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-5 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-6" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide uppercase flex-1">THỐNG KÊ BÁO CÁO</h1>
        </div>
        <div className="flex flex-row gap-6 px-6 py-8">
          {/* Box Thông tin bên trái */}
          <div className="bg-[#e3f1fb] border border-blue-200 rounded-lg p-6 w-64 flex flex-col items-center">
            <button className="bg-blue-300 text-white font-semibold px-8 py-2 rounded mb-6 cursor-default">Thông tin</button>
            <div className="w-full mb-4">
              <div className="font-semibold text-gray-700 mb-1">Số lượng phòng</div>
              <input className="w-full border rounded py-2 px-3 text-center font-bold text-lg bg-white" value={totalRooms} readOnly />
            </div>
            <div className="w-full mb-4">
              <div className="font-semibold text-gray-700 mb-1">Số lượng phòng trống</div>
              <input className="w-full border rounded py-2 px-3 text-center font-bold text-lg bg-white" value={emptyRooms} readOnly />
            </div>
            <div className="w-full">
              <div className="font-semibold text-gray-700 mb-1">Số lượng phòng đầy</div>
              <input className="w-full border rounded py-2 px-3 text-center font-bold text-lg bg-white" value={fullRooms} readOnly />
            </div>
          </div>
          {/* Box Thống kê và bảng bên phải */}
          <div className="flex-1 bg-[#e3f1fb] border border-blue-200 rounded-lg p-6">
            <div className="flex flex-row items-center gap-4 mb-4">
              <span className="font-semibold text-gray-700">Chọn kiểu thống kê:</span>
              <select
                className="border rounded py-2 px-4 min-w-[220px]"
                value={statType}
                onChange={e => setStatType(e.target.value)}
              >
                <option value="empty">Thống kê phòng còn trống</option>
                <option value="full">Thống kê phòng đã đầy</option>
                <option value="all">Thống kê tất cả phòng</option>
              </select>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded">Xem</button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">Tạo báo cáo</button>
            </div>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-center">
                <thead className="bg-[#F9E9B4]">
                  <tr>
                    <th className="border px-2 py-1">Mã phòng</th>
                    <th className="border px-2 py-1">Tên phòng</th>
                    <th className="border px-2 py-1">Loại phòng</th>
                    <th className="border px-2 py-1">Sức chứa</th>
                    <th className="border px-2 py-1">Số SVHT</th>
                    <th className="border px-2 py-1">Giá phòng / tháng</th>
                    <th className="border px-2 py-1">Mã dãy</th>
                  </tr>
                </thead>
                <tbody>
                  {initialRows.map((row) => (
                    <tr
                      key={row.id}
                      className={selected === row.id ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-white"}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataReport;
