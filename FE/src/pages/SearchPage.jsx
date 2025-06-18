import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const SearchPage = () => {
  const [form, setForm] = useState({ student: "", service: "", room: "" });
  const [studentResult, setStudentResult] = useState(null);
  const [serviceResult, setServiceResult] = useState(null);
  const [roomResult, setRoomResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setStudentResult(null);
    setServiceResult(null);
    setRoomResult(null);
    try {
      // Tìm kiếm sinh viên theo MaSV
      if (form.student.trim()) {
        const res = await fetch(`${baseURL}/api/user/getAllStudent`);
        const data = await res.json();
        if (data && data.result) {
          const found = data.result.filter(
            sv => sv.MaSV?.toLowerCase().includes(form.student.trim().toLowerCase())
          );
          setStudentResult(found.length > 0 ? found : []);
        }
      }
      // Tìm kiếm dịch vụ theo TenDV
      if (form.service.trim()) {
        const res = await fetch(`${baseURL}/api/service/getAllService`);
        const data = await res.json();
        if (data && data.result) {
          const found = data.result.filter(
            dv => dv.TenDV?.toLowerCase().includes(form.service.trim().toLowerCase())
          );
          setServiceResult(found.length > 0 ? found : []);
        }
      }
      // Tìm kiếm phòng theo TenPhong
      if (form.room.trim()) {
        const res = await fetch(`${baseURL}/api/room/getAllRoom`);
        const data = await res.json();
        if (data && data.result) {
          const found = data.result.filter(
            room => room.TenPhong?.toLowerCase().includes(form.room.trim().toLowerCase())
          );
          setRoomResult(found.length > 0 ? found : []);
        }
      }
      if (!form.student.trim() && !form.service.trim() && !form.room.trim()) {
        setError("Vui lòng nhập ít nhất một trường để tìm kiếm!");
      }
    } catch (err) {
      setError("Lỗi khi tìm kiếm dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ student: "", service: "", room: "" });
    setStudentResult(null);
    setServiceResult(null);
    setRoomResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="rounded-xl shadow-lg w-full max-w-4xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-6" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase flex-1">TÌM KIẾM</h1>
        </div>

        {/* Form tìm kiếm */}
        <div className="bg-[#e3f1fb] border border-blue-200 rounded-lg mx-6 mt-6 mb-10 p-8">
          <div className="text-center font-semibold text-lg mb-6">Điền một thông tin cần tìm</div>
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="flex flex-col items-center">
              <label className="font-bold mb-2">Tìm kiếm sinh viên:</label>
              <input
                className="border rounded py-2 px-4 w-64"
                placeholder="điền mã sinh viên"
                value={form.student}
                onChange={e => setForm(f => ({ ...f, student: e.target.value }))}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="font-bold mb-2">Tìm kiếm dịch vụ:</label>
              <input
                className="border rounded py-2 px-4 w-64"
                placeholder="điền tên dịch vụ"
                value={form.service}
                onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mb-8">
            <label className="font-bold mb-2">Tìm kiếm phòng:</label>
            <input
              className="border rounded py-2 px-4 w-64"
              placeholder="điền tên phòng"
              value={form.room}
              onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
            />
          </div>
          {error && <div className="text-red-600 text-center font-semibold mb-4">{error}</div>}
          <div className="flex justify-center gap-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded" onClick={handleSearch} disabled={loading}>{loading ? "Đang tìm..." : "Tìm kiếm"}</button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded" onClick={handleCancel}>Hủy</button>
          </div>
        </div>

        {/* Kết quả tìm kiếm */}
        <div className="px-8 pb-8">
          {/* Sinh viên */}
          {studentResult && (
            <div className="mb-6">
              <div className="font-bold text-blue-700 mb-2">Kết quả sinh viên:</div>
              {studentResult.length === 0 ? (
                <div className="text-gray-600">Không tìm thấy sinh viên phù hợp.</div>
              ) : (
                <table className="w-full text-center border mb-2">
                  <thead className="bg-[#F9E9D0]">
                    <tr>
                      <th className="border px-2 py-1">Mã SV</th>
                      <th className="border px-2 py-1">Họ tên</th>
                      <th className="border px-2 py-1">Email</th>
                      <th className="border px-2 py-1">SĐT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentResult.map(sv => (
                      <tr key={sv.MaSV}>
                        <td className="border px-2 py-1">{sv.MaSV}</td>
                        <td className="border px-2 py-1">{sv.HoTen}</td>
                        <td className="border px-2 py-1">{sv.email}</td>
                        <td className="border px-2 py-1">{sv.SDT}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {/* Dịch vụ */}
          {serviceResult && (
            <div className="mb-6">
              <div className="font-bold text-green-700 mb-2">Kết quả dịch vụ:</div>
              {serviceResult.length === 0 ? (
                <div className="text-gray-600">Không tìm thấy dịch vụ phù hợp.</div>
              ) : (
                <table className="w-full text-center border mb-2">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="border px-2 py-1">Mã DV</th>
                      <th className="border px-2 py-1">Tên dịch vụ</th>
                      <th className="border px-2 py-1">Giá</th>
                      <th className="border px-2 py-1">Đơn vị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceResult.map(dv => (
                      <tr key={dv.MaDV}>
                        <td className="border px-2 py-1">{dv.MaDV}</td>
                        <td className="border px-2 py-1">{dv.TenDV}</td>
                        <td className="border px-2 py-1">{dv.GiaDV?.toLocaleString()} đồng</td>
                        <td className="border px-2 py-1">{dv.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {/* Phòng */}
          {roomResult && (
            <div className="mb-6">
              <div className="font-bold text-purple-700 mb-2">Kết quả phòng:</div>
              {roomResult.length === 0 ? (
                <div className="text-gray-600">Không tìm thấy phòng phù hợp.</div>
              ) : (
                <table className="w-full text-center border mb-2">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="border px-2 py-1">Mã phòng</th>
                      <th className="border px-2 py-1">Tên phòng</th>
                      <th className="border px-2 py-1">Loại</th>
                      <th className="border px-2 py-1">Sức chứa</th>
                      <th className="border px-2 py-1">Số SV hiện tại</th>
                      <th className="border px-2 py-1">Giá</th>
                      <th className="border px-2 py-1">Mã dãy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomResult.map(room => (
                      <tr key={room.MaPhong}>
                        <td className="border px-2 py-1">{room.MaPhong}</td>
                        <td className="border px-2 py-1">{room.TenPhong}</td>
                        <td className="border px-2 py-1">{room.LoaiPhong}</td>
                        <td className="border px-2 py-1">{room.SucChua}</td>
                        <td className="border px-2 py-1">{room.SoSVDangOHienTai || 0}</td>
                        <td className="border px-2 py-1">{room.GiaPhong?.toLocaleString()} đồng</td>
                        <td className="border px-2 py-1">{room.MaDayPhong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default SearchPage;