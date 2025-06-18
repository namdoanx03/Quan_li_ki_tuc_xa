import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const DataReport = () => {
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statType, setStatType] = useState("empty");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${baseURL}${SummaryApi.getAllRoom.url}`);
      const data = await res.json();
      if (data && data.result) {
        setRooms(data.result);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng:", err);
    }
  };

  // Tính toán thống kê
  const totalRooms = rooms.length;
  const emptyRooms = rooms.filter(room => (room.SoSVDangOHienTai || 0) < (room.SucChua || 0)).length;
  const fullRooms = rooms.filter(room => (room.SoSVDangOHienTai || 0) >= (room.SucChua || 0)).length;

  // Lọc dữ liệu bảng theo loại thống kê
  let filteredRooms = rooms;
  if (statType === "empty") {
    filteredRooms = rooms.filter(room => (room.SoSVDangOHienTai || 0) < (room.SucChua || 0));
  } else if (statType === "full") {
    filteredRooms = rooms.filter(room => (room.SoSVDangOHienTai || 0) >= (room.SucChua || 0));
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 mt-6">
      <div className="rounded-xl shadow-lg w-full max-w-6xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-6" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase flex-1">THỐNG KÊ BÁO CÁO</h1>
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
              {/* Nút Xem và Tạo báo cáo có thể bổ sung chức năng sau */}
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
                    <th className="border px-2 py-1">Số SV đang ở hiện tại</th>
                    <th className="border px-2 py-1">Giá phòng / tháng</th>
                    <th className="border px-2 py-1">Mã dãy</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr
                      key={room.MaPhong}
                      className={selected === room.MaPhong ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-white"}
                      onClick={() => {
                        if (selected === room.MaPhong) {
                          setSelected(null);
                        } else {
                          setSelected(room.MaPhong);
                        }
                      }}
                    >
                      <td className="border px-2 py-2 text-left font-medium">
                        <span className="inline-block w-5 text-center mr-2 align-middle">{selected === room.MaPhong ? "▶" : ""}</span>
                        {room.MaPhong}
                      </td>
                      <td className="border px-2 py-2">{room.TenPhong}</td>
                      <td className="border px-2 py-2">{room.LoaiPhong}</td>
                      <td className="border px-2 py-2">{room.SucChua}</td>
                      <td className="border px-2 py-2">{room.SoSVDangOHienTai || 0}</td>
                      <td className="border px-2 py-2">{room.GiaPhong?.toLocaleString()} đồng</td>
                      <td className="border px-2 py-2">{room.MaDayPhong}</td>
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
