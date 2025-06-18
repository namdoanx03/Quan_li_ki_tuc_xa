import React, { useState, useEffect } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const RoomManagement = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",           // Tên phòng
    block: "",          // Mã dãy phòng
    type: "",           // Loại phòng (Nam/Nữ)
    capacity: "",       // Sức chứa
    currentStudents: "0", // Số SV đang ở (readonly)
    price: ""           // Giá phòng
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [rowRooms, setRowRooms] = useState([]);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Hàm tạo mã phòng mới
  const generateNewRoomCode = (existingRooms) => {
    // Lấy tất cả mã phòng hiện có
    const existingCodes = existingRooms.map(room => room.MaPhong);
    
    // Tìm số lớn nhất trong các mã phòng hiện có
    let maxNumber = -1;
    existingCodes.forEach(code => {
      if (code.startsWith('P')) {
        const number = parseInt(code.substring(1));
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    // Tạo mã phòng mới
    const newNumber = maxNumber + 1;
    return `P${String(newNumber).padStart(2, '0')}`;
  };

  // Hàm validate form
  const validateForm = () => {
    if (!form.name.trim()) return "Vui lòng nhập tên phòng!";
    if (!form.block) return "Vui lòng chọn dãy phòng!";
    if (!form.type) return "Vui lòng chọn loại phòng!";
    if (!form.capacity || parseInt(form.capacity) <= 0) 
      return "Sức chứa phải lớn hơn 0!";
    if (!form.price || parseInt(form.price) <= 0) 
      return "Giá phòng phải lớn hơn 0!";
    
    const capacity = parseInt(form.capacity);
    const currentStudents = parseInt(form.currentStudents) || 0;
    
    if (currentStudents < 0) 
      return "Số sinh viên đang ở không thể âm!";
    if (currentStudents > capacity)
      return "Số sinh viên đang ở không thể vượt quá sức chứa!";
    
    return "";
  };

  // Hàm clear form
  const clearForm = () => {
    setForm({
      name: "",
      block: "",
      type: "",
      capacity: "",
      currentStudents: "0",
      price: ""
    });
    setSelected(null); // Reset selected room
  };

  // Fetch danh sách dãy phòng
  useEffect(() => {
    const fetchRowRooms = async () => {
      try {
        const res = await axios({
          method: SummaryApi.getAllRowRoom.method,
          url: baseURL + SummaryApi.getAllRowRoom.url,
        });
        if (res.data && res.data.result) {
          setRowRooms(res.data.result);
        }
      } catch (err) {
        console.error("Error fetching row rooms:", err);
        setError("Không thể lấy danh sách dãy phòng!");
      }
    };
    fetchRowRooms();
  }, []);

  // Fetch danh sách phòng
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
        
        // Đảm bảo trang hiện tại hợp lệ
        const newTotalPages = Math.ceil(res.data.result.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
          setCurrentPage(1);
        }
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Không thể lấy danh sách phòng!");
    }
  };

  const handleAddRoom = async () => {
    setError("");
    setSuccess("");
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Tạo mã phòng mới
      const newRoomCode = generateNewRoomCode(rows);

      // Lưu thông tin phòng
      const roomToAdd = {
        MaPhong: newRoomCode,
        TenPhong: form.name.trim(),
        MaDayPhong: form.block,
        LoaiPhong: form.type,
        SucChua: parseInt(form.capacity),
        GiaPhong: parseInt(form.price),
        SoSVDangOHienTai: parseInt(form.currentStudents) || 0 // Sử dụng giá trị từ form
      };

      // Clear form trước khi gọi API
      clearForm();

      await axios({
        method: SummaryApi.addRoom.method,
        url: baseURL + SummaryApi.addRoom.url,
        data: roomToAdd,
      });

      setSuccess("Thêm phòng thành công!");
      await fetchRooms();
    } catch (err) {
      console.error("Error adding room:", err);
      setError(err.response?.data?.message || "Thêm phòng thất bại!");
    }
  };

  const handleUpdateRoom = async () => {
    setError("");
    setSuccess("");
    
    if (!selected) {
      setError("Vui lòng chọn phòng để sửa!");
      return;
    }

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Lưu thông tin phòng trước khi clear form
      const roomToUpdate = {
        MaPhong: selected.MaPhong,
        TenPhong: form.name.trim(),
        MaDayPhong: form.block,
        LoaiPhong: form.type,
        SucChua: parseInt(form.capacity),
        GiaPhong: parseInt(form.price),
        SoSVDangOHienTai: parseInt(form.currentStudents) // Giữ nguyên số sinh viên hiện tại
      };

      // Clear form trước khi gọi API
      clearForm();

      await axios({
        method: SummaryApi.updateRoom.method,
        url: baseURL + SummaryApi.updateRoom.url + `?MaPhong=${roomToUpdate.MaPhong}`,
        data: roomToUpdate,
      });

      setSuccess("Sửa phòng thành công!");
      setSelected(null);
      await fetchRooms();
    } catch (err) {
      console.error("Error updating room:", err);
      setError(err.response?.data?.message || "Sửa phòng thất bại!");
    }
  };

  const handleDeleteRoom = async () => {
    setError("");
    setSuccess("");
    
    if (!selected) {
      setError("Vui lòng chọn phòng để xóa!");
      return;
    }

    try {
      // Lưu mã phòng từ selected room
      const roomCodeToDelete = selected.MaPhong;
      const roomDayPhong = selected.MaDayPhong;

      console.log("Deleting room:", { roomCodeToDelete, roomDayPhong, selected });

      // Clear form trước khi gọi API
      clearForm();

      const deleteUrl = baseURL + SummaryApi.deleteRoom.url + `?MaPhong=${roomCodeToDelete}&MaDayPhong=${roomDayPhong}`;
      console.log("Delete URL:", deleteUrl);

      await axios({
        method: SummaryApi.deleteRoom.method,
        url: deleteUrl,
      });

      setSuccess("Xóa phòng thành công!");
      setSelected(null); // Reset selected room
      await fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Xóa phòng thất bại!");
    }
  };

  const handleRefresh = () => {
    setError("");
    setSuccess("");
    clearForm();
    fetchRooms();
  };

  // Phân trang
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rows.slice(startIndex, endIndex);
  };

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
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <label className="font-bold mr-2 w-28 text-right">Tên phòng:</label>
                <input 
                  className="border rounded py-1 px-2 w-44" 
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="flex items-center">
                <label className="font-bold mr-2 w-28 text-right">Dãy phòng:</label>
                <select 
                  className="border rounded py-1 px-2 w-44"
                  value={form.block}
                  onChange={e => setForm(f => ({ ...f, block: e.target.value }))}
                >
                  <option value="">Chọn dãy phòng</option>
                  {rowRooms.map(row => (
                    <option key={row.MaDayPhong} value={row.MaDayPhong}>
                      {row.MaDayPhong} - {row.TenDayPhong}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="font-bold mr-2 w-28 text-right">Loại phòng:</label>
                <select 
                  className="border rounded py-1 px-2 w-44"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="">Chọn loại phòng</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            {/* Cột phải */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <label className="font-bold mr-2 w-32 text-right">Sức chứa:</label>
                <input 
                  type="number" 
                  min="0"
                  className="border rounded py-1 px-2 w-44" 
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                />
              </div>
              <div className="flex items-center">
                <label className="font-bold mr-2 w-32 text-right">Số SV đang ở:</label>
                <input 
                  type="number"
                  min="0"
                  className="border rounded py-1 px-2 w-44" 
                  value={form.currentStudents}
                  onChange={e => setForm(f => ({ ...f, currentStudents: e.target.value }))}
                />
              </div>
              <div className="flex items-center">
                <label className="font-bold mr-2 w-32 text-right">Giá phòng / tháng:</label>
                <input 
                  type="number"
                  min="0"
                  className="border rounded py-1 px-2 w-44" 
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                />
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
                <th className="border px-2 py-1">Dãy phòng</th>
                <th className="border px-2 py-1">Loại phòng</th>
                <th className="border px-2 py-1">Sức chứa</th>
                <th className="border px-2 py-1">Số sinh viên đang ở</th>
                <th className="border px-2 py-1">Giá phòng / tháng</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((row) => {
                // Tìm tên dãy phòng tương ứng
                const rowRoomInfo = rowRooms.find(r => r.MaDayPhong === row.MaDayPhong);
                const rowRoomDisplay = rowRoomInfo ? `${row.MaDayPhong} - ${rowRoomInfo.TenDayPhong}` : row.MaDayPhong;

                return (
                  <tr
                    key={row.MaPhong}
                    className={selected && selected.MaPhong === row.MaPhong ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                    onClick={() => {
                      if (selected && selected.MaPhong === row.MaPhong) {
                        clearForm();
                      } else {
                        setSelected(row);
                        setForm({
                          name: row.TenPhong,
                          block: row.MaDayPhong,
                          type: row.LoaiPhong,
                          capacity: row.SucChua,
                          currentStudents: row.SoSVDangOHienTai || "0",
                          price: row.GiaPhong
                        });
                      }
                    }}
                  >
                    <td className="border px-2 py-2 text-left font-medium">
                      <span className="inline-block w-5 text-center mr-2 align-middle">
                        {selected && selected.MaPhong === row.MaPhong ? "▶" : ""}
                      </span>
                      {row.MaPhong}
                    </td>
                    <td className="border px-2 py-2">{row.TenPhong}</td>
                    <td className="border px-2 py-2">{rowRoomDisplay}</td>
                    <td className="border px-2 py-2">{row.LoaiPhong}</td>
                    <td className="border px-2 py-2">{row.SucChua}</td>
                    <td className="border px-2 py-2">{row.SoSVDangOHienTai || 0}</td>
                    <td className="border px-2 py-2">{Number(row.GiaPhong).toLocaleString("vi-VN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer - Phân trang */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 border-t mt-6 px-6 py-4 rounded-b-xl">
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              &larr; Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Sau &rarr;
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