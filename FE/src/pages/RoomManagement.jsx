import React, { useState, useEffect } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const RoomManagement = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", capacity: "", price: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Thêm hàm clearForm để reset form và selection
  const clearForm = () => {
    setForm({ code: "", name: "", capacity: "", price: "" });
    setSelected(null);
  };

  useEffect(() => {
    fetchRooms();
  }, [refreshTrigger]);

  const fetchRooms = async () => {
    setError("");
    try {
      console.log("Fetching rooms...");
      const res = await axios({
        method: "get",
        url: baseURL + "/api/room/getAllRoom",
      });
      console.log("Rooms response:", res.data);
      if (res.data && res.data.result) {
        setRows(res.data.result);
        console.log("Updated rows:", res.data.result);
        // Đảm bảo trang hiện tại hợp lệ sau khi cập nhật dữ liệu
        const newTotalPages = Math.ceil(res.data.result.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
          setCurrentPage(1);
        }
        // Trigger re-render
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      setError("Không lấy được danh sách phòng!");
      console.error("Error fetching rooms:", err);
    }
  };

  const handleAddRoom = async () => {
    setError(""); 
    setSuccess("");
    if (!form.code || !form.name || !form.capacity || !form.price) {
      setError("Vui lòng nhập đầy đủ thông tin!"); 
      return;
    }

    // Lưu lại thông tin phòng trước khi clear form
    const roomToAdd = {
      MaPhong: form.code,
      TenPhong: form.name,
      SucChua: form.capacity,
      GiaPhong: form.price,
      MaDayPhong: form.block || "P1"
    };

    // Clear form TRƯỚC KHI gọi API thêm
    clearForm();

    try {
      await axios({
        method: SummaryApi.addRoom.method,
        url: baseURL + SummaryApi.addRoom.url,
        data: roomToAdd,
      });
      
      setSuccess("Thêm phòng thành công!");
      await fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Thêm phòng thất bại!");
    }
  };

  const handleUpdateRoom = async () => {
    setError(""); 
    setSuccess("");
    if (selected == null) { 
      setError("Vui lòng chọn phòng để sửa!"); 
      return; 
    }
    if (!form.code || !form.name || !form.capacity || !form.price) { 
      setError("Vui lòng nhập đầy đủ thông tin!"); 
      return; 
    }

    // Lưu lại thông tin phòng trước khi clear form
    const roomToUpdate = {
      MaPhong: form.code,
      TenPhong: form.name,
      SucChua: form.capacity,
      GiaPhong: form.price
    };

    // Clear form TRƯỚC KHI gọi API sửa
    clearForm();

    try {
      await axios({
        method: SummaryApi.updateRoom.method,
        url: baseURL + SummaryApi.updateRoom.url + `?MaPhong=${roomToUpdate.MaPhong}`,
        data: {
          TenPhong: roomToUpdate.TenPhong,
          SucChua: roomToUpdate.SucChua,
          GiaPhong: roomToUpdate.GiaPhong,
        },
      });
      
      setSuccess("Sửa phòng thành công!");
      await fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Sửa phòng thất bại!");
    }
  };

  const handleDeleteRoom = async () => {
    setError(""); 
    setSuccess("");
    if (selected == null) { 
      setError("Vui lòng chọn phòng để xóa!"); 
      return; 
    }

    // Lưu lại mã phòng trước khi clear form
    const roomCodeToDelete = form.code;

    // Clear form TRƯỚC KHI gọi API xóa
    clearForm();
    
    try {
      console.log("Deleting room:", roomCodeToDelete);
      await axios({
        method: SummaryApi.deleteRoom.method,
        url: baseURL + SummaryApi.deleteRoom.url + `?MaPhong=${roomCodeToDelete}`,
      });
      console.log("Room deleted successfully");
      
      setSuccess("Xóa phòng thành công!");
      
      console.log("Refreshing room list...");
      await fetchRooms();
      console.log("Room list refreshed");
      
    } catch (err) {
      console.error("Error deleting room:", err);
      setError(err.response?.data?.message || "Xóa phòng thất bại!");
    }
  };

  const handleRefresh = () => {
    setError(""); 
    setSuccess("");
    clearForm(); // Gọi hàm clearForm thay vì set trực tiếp
    fetchRooms();
  };

  // Phân trang
  const totalPages = Math.ceil(rows.length / itemsPerPage);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center ">
          <button className="text-4xl mr-10" onClick={() => navigate('/')}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase pl-64">QUẢN LÝ PHÒNG</h1>
        </div>

        {/* Form nhập */}
        <div className="bg-[#E9F6FE] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 px-10">
            {/* Cột trái */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <label className="font-bold mr-2 w-28 text-right">Mã phòng:</label>
                <input className="border rounded py-1 px-2 w-44" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="flex items-center">
                <label className="font-bold mr-2 w-28 text-right">Tên phòng:</label>
                <input className="border rounded py-1 px-2 w-44" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
            {/* Cột phải */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <label className="font-bold mr-2 w-32 text-right">Sức chứa:</label>
                <input className="border rounded py-1 px-2 w-44" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
              </div>
              <div className="flex items-center">
                <label className="font-bold mr-2 w-32 text-right">Giá phòng / tháng:</label>
                <input className="border rounded py-1 px-2 w-44" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
            </div>
          </div>
          {error && <div className="text-red-600 text-center mb-2 font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-center mb-2 font-semibold">{success}</div>}
          <div className="flex flex-wrap gap-4 justify-center mb-2">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded" onClick={handleAddRoom}>Thêm</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded" onClick={handleUpdateRoom}>Sửa</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded" onClick={handleDeleteRoom}>Xóa</button>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded" onClick={handleRefresh}>Làm mới</button>
          </div>
        </div>

        {/* Bảng dữ liệu phòng */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã phòng</th>
                <th className="border px-2 py-1">Tên phòng</th>
                <th className="border px-2 py-1">Sức chứa</th>
                <th className="border px-2 py-1">Giá phòng / tháng</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((row, idx) => (
                <tr
                  key={row.MaPhong}
                  className={selected === row.MaPhong ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                  onClick={() => {
                    if (selected === row.MaPhong) {
                      setSelected(null);
                      setForm({ code: "", name: "", capacity: "", price: "" });
                    } else {
                      setSelected(row.MaPhong);
                      setForm({
                        code: row.MaPhong,
                        name: row.TenPhong,
                        capacity: row.SucChua,
                        price: row.GiaPhong,
                      });
                    }
                  }}
                >
                  <td className="border px-2 py-2 text-left font-medium">
                    <span className="inline-block w-5 text-center mr-2 align-middle">{selected === row.MaPhong ? "▶" : ""}</span>
                    {row.MaPhong}
                  </td>
                  <td className="border px-2 py-2">{row.TenPhong}</td>
                  <td className="border px-2 py-2">{row.SucChua}</td>
                  <td className="border px-2 py-2">{Number(row.GiaPhong).toLocaleString("vi-VN")}</td>
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
                  className={`
                    px-3 py-1 rounded border ${
                      currentPage === p
                        ? "bg-blue-500 text-white border-blue-500"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
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
          <div className="text-sm text-gray-600 mt-2 md:mt-0">
            Trang {currentPage} / {totalPages} ({rows.length} phòng)
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;