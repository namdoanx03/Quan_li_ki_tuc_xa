import React, { useState, useEffect } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import SummaryApi, { baseURL } from "../common/SummaryApi.js";

const RoomRentalManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    rentalId: "",
    date: new Date().toISOString().split('T')[0],
    contractStartDate: new Date().toISOString().split('T')[0],
    studentId: "",
    roomCode: "",
  });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [extendDate, setExtendDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to convert dd/mm/yyyy to yyyy-mm-dd for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.student-dropdown-container')) {
        setShowStudentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch rooms
      const roomsResponse = await fetch(`${baseURL}${SummaryApi.getAllRoom.url}`);
      if (!roomsResponse.ok) {
        throw new Error(`Lỗi tải danh sách phòng: ${roomsResponse.status}`);
      }
      const roomsData = await roomsResponse.json();

      // Fetch contracts
      const contractsResponse = await fetch(`${baseURL}${SummaryApi.getAllContract.url}`);
      if (!contractsResponse.ok) {
        throw new Error(`Lỗi tải danh sách hợp đồng: ${contractsResponse.status}`);
      }
      const contractsData = await contractsResponse.json();

      // Fetch students
      const studentsResponse = await fetch(`${baseURL}${SummaryApi.getAllStudent.url}`);
      if (!studentsResponse.ok) {
        throw new Error(`Lỗi tải danh sách sinh viên: ${studentsResponse.status}`);
      }
      const studentsData = await studentsResponse.json();

      if (roomsData.result) setRooms(roomsData.result);
      if (contractsData.hopdong) setContracts(contractsData.hopdong);
      if (studentsData.result) setStudents(studentsData.result);

      console.log('Data loaded successfully:', {
        rooms: roomsData.result?.length || 0,
        contracts: contractsData.hopdong?.length || 0,
        students: studentsData.result?.length || 0
      });
    } catch (err) {
      setError(`Không thể tải dữ liệu từ máy chủ: ${err.message}`);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCreateContract = async () => {
    if (!form.studentId || !form.roomCode) {
      showMessage('error', 'Vui lòng nhập đầy đủ thông tin sinh viên và phòng');
      return;
    }

    // Check if student exists
    const studentExists = students.find(student => student.MaSV === form.studentId);
    if (!studentExists) {
      showMessage('error', 'Mã sinh viên không tồn tại trong hệ thống');
      return;
    }

    // Check if room exists
    const selectedRoom = rooms.find(room => room.MaPhong === form.roomCode);
    if (!selectedRoom) {
      showMessage('error', 'Mã phòng không tồn tại trong hệ thống');
      return;
    }

    // Check if room is full
    if (getRoomStatus(selectedRoom) === "Đã đầy") {
      showMessage('error', 'Phòng đã đầy, không thể tạo hợp đồng mới');
      return;
    }

    // Check if student already has a contract
    const existingContract = contracts.find(contract => contract.MaSV === form.studentId);
    if (existingContract) {
      showMessage('error', 'Sinh viên này đã có hợp đồng thuê phòng');
      return;
    }

    // Check if room already has this student
    const roomContract = contracts.find(contract =>
      contract.MaPhong === form.roomCode && contract.MaSV === form.studentId
    );
    if (roomContract) {
      showMessage('error', 'Sinh viên này đã có hợp đồng với phòng này');
      return;
    }

    try {
      const response = await fetch(`${baseURL}${SummaryApi.createContract.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MaSV: form.studentId,
          MaPhong: form.roomCode,
          MaQl: "QL1", // Use the correct manager ID that exists in database
          NgayBatDau: form.contractStartDate
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Tạo hợp đồng thành công!');
        setForm({
          rentalId: "",
          date: new Date().toISOString().split('T')[0],
          contractStartDate: new Date().toISOString().split('T')[0],
          studentId: "",
          roomCode: "",
        });
        setSelected(null);
        setStudentSearchTerm('');
        await fetchData(); // Refresh data
      } else {
        console.error('Contract creation error:', data);
        let errorMessage = 'Tạo hợp đồng thất bại';
        if (data.message) {
          errorMessage += `: ${data.message}`;
        }
        if (data.error && typeof data.error === 'object') {
          console.error('Detailed error:', data.error);
          if (data.error.code === 'ER_DUP_ENTRY') {
            errorMessage = 'Hợp đồng đã tồn tại cho sinh viên này';
          }
        }
        showMessage('error', errorMessage);
      }
    } catch (err) {
      showMessage('error', 'Lỗi kết nối máy chủ');
      console.error("Error creating contract:", err);
    }
  };

  const handleExtendContract = async () => {
    if (!form.rentalId) {
      showMessage('error', 'Vui lòng nhập ID hợp đồng cần gia hạn');
      return;
    }

    if (!extendDate) {
      showMessage('error', 'Vui lòng chọn ngày hết hạn mới');
      return;
    }

    // Check if contract exists
    const existingContract = contracts.find(contract => contract.MaHD === form.rentalId);
    if (!existingContract) {
      showMessage('error', 'ID hợp đồng không tồn tại trong hệ thống');
      return;
    }

    try {
      const response = await fetch(`${baseURL}${SummaryApi.extendContract.url}?MaHD=${form.rentalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NgayHetHan: extendDate
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Gia hạn hợp đồng thành công!');
        setForm({
          rentalId: "",
          date: new Date().toISOString().split('T')[0],
          contractStartDate: new Date().toISOString().split('T')[0],
          studentId: "",
          roomCode: "",
        });
        setExtendDate('');
        setSelectedContract(null);
        fetchData(); // Refresh data
      } else {
        showMessage('error', data.message || 'Gia hạn hợp đồng thất bại');
        console.error('Contract extension error:', data);
      }
    } catch (err) {
      showMessage('error', 'Lỗi kết nối máy chủ');
      console.error("Error extending contract:", err);
    }
  };

  const handleCreateBill = async () => {
    if (!selectedContract) {
      showMessage('error', 'Vui lòng chọn hợp đồng để tạo hóa đơn');
      return;
    }

    try {
      const response = await fetch(`${baseURL}${SummaryApi.createBill.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MaHD: selectedContract.MaHD,
          MaSV: selectedContract.MaSV,
          MaPhong: selectedContract.MaPhong,
          NgayLap: new Date().toISOString().split('T')[0],
          MaQl: "QL001"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Tạo hóa đơn thành công!');
        setForm({
          rentalId: "",
          date: new Date().toISOString().split('T')[0],
          contractStartDate: new Date().toISOString().split('T')[0],
          studentId: "",
          roomCode: "",
        });
        setSelectedContract(null);
      } else {
        showMessage('error', data.message || 'Tạo hóa đơn thất bại');
      }
    } catch (err) {
      showMessage('error', 'Lỗi kết nối máy chủ');
      console.error("Error creating bill:", err);
    }
  };

  const handleCancel = () => {
    setForm({
      rentalId: "",
      date: new Date().toISOString().split('T')[0],
      contractStartDate: new Date().toISOString().split('T')[0],
      studentId: "",
      roomCode: "",
    });
    setSelected(null);
    setSelectedContract(null);
    setMessage({ type: '', text: '' });
  };

  const handleDeleteContract = async () => {
    if (!selectedContract) {
      showMessage('error', 'Vui lòng chọn hợp đồng cần xóa');
      return;
    }

    setShowDeleteModal(true);
  };

  const confirmDeleteContract = async () => {
    try {
      const response = await fetch(`${baseURL}${SummaryApi.cancelContract.url}?MaPhong=${selectedContract.MaPhong}&MaSV=${selectedContract.MaSV}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Xóa hợp đồng thành công!');
        setSelectedContract(null);
        setForm({
          rentalId: "",
          date: new Date().toISOString().split('T')[0],
          contractStartDate: new Date().toISOString().split('T')[0],
          studentId: "",
          roomCode: "",
        });
        setShowDeleteModal(false);
        await fetchData(); // Refresh data
      } else {
        showMessage('error', data.message || 'Xóa hợp đồng thất bại');
        console.error('Contract deletion error:', data);
        setShowDeleteModal(false);
      }
    } catch (err) {
      showMessage('error', 'Lỗi kết nối máy chủ');
      console.error("Error deleting contract:", err);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteContract = () => {
    setShowDeleteModal(false);
  };

  const handleContractClick = (contract) => {
    if (selectedContract?.MaHD === contract.MaHD) {
      setSelectedContract(null);
    } else {
      setSelectedContract(contract);
      setForm(f => ({ ...f, rentalId: contract.MaHD }));
    }
  };

  const getRoomStatus = (room) => {
    const currentOccupancy = room.SoSVDangOHienTai || 0;
    const capacity = room.SucChua || 0;
    return currentOccupancy >= capacity ? "Đã đầy" : "Còn trống";
  };

  const getRoomStatusColor = (status) => {
    return status === "Đã đầy" ? "text-red-600 font-semibold" : "text-green-600 font-semibold";
  };

  const getContractStatus = (contract) => {
    if (!contract.NgayHetHan) return { status: 'Không xác định', color: 'text-gray-600' };

    const today = new Date();
    const expiryDate = new Date(contract.NgayHetHan);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'Đã hết hạn', color: 'text-red-600 font-semibold' };
    } else if (daysUntilExpiry <= 30) {
      return { status: `Sắp hết hạn (${daysUntilExpiry} ngày)`, color: 'text-orange-600 font-semibold' };
    } else {
      return { status: 'Còn hiệu lực', color: 'text-green-600 font-semibold' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
        <div className="text-xl font-semibold">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#dbeafe]">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="rounded-xl shadow-lg w-full max-w-6xl p-0 mx-10 my-4 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-10" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase flex-1">QUẢN LÝ THUÊ PHÒNG</h1>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold"
            title="Làm mới dữ liệu"
          >
            Làm mới
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mx-6 mt-4 p-3 rounded-lg text-center font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
              message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                'bg-blue-100 text-blue-800 border border-blue-300'
            }`}>
            {message.text}
          </div>
        )}

        {/* Form thuê phòng */}
        <div className="bg-[#e3f1fb] border border-blue-200 rounded-lg mx-6 mt-4 p-6">

          <div className="flex flex-wrap  gap-x-8 gap-y-4 items-center mb-2">
            <div className="flex items-center mb-2">
              <label className="font-bold w-24">Mã phòng:</label>
              <input
                className="border rounded py-1 px-2 w-40"
                value={form.roomCode}
                onChange={e => setForm(f => ({ ...f, roomCode: e.target.value }))}
                placeholder="Chọn từ bảng bên dưới"
                readOnly
              />
            </div>
            <div className="flex items-center mb-2">
              <label className="font-bold w-16 ">Mã SV:</label>
              <div className="relative student-dropdown-container">
                <input
                  className="border rounded py-1 px-2 w-44"
                  value={form.studentId}
                  onChange={e => {
                    setForm(f => ({ ...f, studentId: e.target.value }));
                    setStudentSearchTerm(e.target.value);
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  placeholder="Nhập mã sinh viên"
                />
                {showStudentDropdown && students.length > 0 && (
                  <div className="absolute z-50 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {students
                      .filter(student =>
                        student.MaSV?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                        student.HoTen?.toLowerCase().includes(studentSearchTerm.toLowerCase())
                      )
                      .slice(0, 5)
                      .map(student => (
                        <div
                          key={student.MaSV}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                          onClick={() => {
                            setForm(f => ({ ...f, studentId: student.MaSV }));
                            setStudentSearchTerm(student.MaSV);
                            setShowStudentDropdown(false);
                          }}
                        >
                          <div className="font-medium">{student.MaSV}</div>
                          <div className="text-sm text-gray-600">{student.HoTen}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center mb-2">
              <label className="font-bold w-32">Ngày bắt đầu:</label>
              <input
                type="date"
                className="border rounded py-1 px-2 w-40"
                value={form.contractStartDate}
                onChange={e => setForm(f => ({ ...f, contractStartDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-2 ml-1">(Chọn một mã ở bảng phía dưới)</div>
          <div className="flex flex-wrap gap-4 justify-end ">
            <button
              className="border border-blue-400 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
              onClick={handleCreateContract}
            >
              Tạo hợp đồng
            </button>
            <button
              className="border border-green-400 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
              onClick={handleExtendContract}
            >
              Gia hạn
            </button>
            <button
              className="border border-purple-400 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded"
              onClick={handleCreateBill}
            >
              Tạo hóa đơn
            </button>
            <button
              className="border border-gray-400 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </div>

        {/* Bảng phòng */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full text-center">
              <thead className="bg-[#F9E9B4] sticky top-0 z-10">
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
                {rooms.map((room) => {
                  const status = getRoomStatus(room);
                  const isSelected = selected === room.MaPhong;

                  return (
                    <tr
                      key={room.MaPhong}
                      className={`cursor-pointer ${isSelected ? "bg-yellow-100" :
                          getRoomStatus(room) === "Đã đầy" ? "bg-gray-100 opacity-75" :
                            "bg-white hover:bg-gray-50"
                        }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelected(null);
                          setForm(f => ({ ...f, roomCode: "" }));
                        } else {
                          setSelected(room.MaPhong);
                          setForm(f => ({ ...f, roomCode: room.MaPhong }));
                        }
                      }}
                    >
                      <td className="border px-2 py-2 text-left font-medium">
                        <span className="inline-block w-5 text-center mr-2 align-middle">
                          {isSelected ? "▶" : ""}
                        </span>
                        {room.MaPhong}
                        {getRoomStatus(room) === "Đã đầy" && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            ĐẦY
                          </span>
                        )}
                      </td>
                      <td className="border px-2 py-2">{room.TenPhong}</td>
                      <td className="border px-2 py-2">{room.LoaiPhong}</td>
                      <td className="border px-2 py-2">{room.SucChua}</td>
                      <td className="border px-2 py-2">{room.SoSVDangOHienTai || 0}</td>
                      <td className="border px-2 py-2">{room.GiaPhong?.toLocaleString()} đồng</td>
                      <td className={`border px-2 py-2 ${getRoomStatusColor(status)}`}>
                        {status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="mx-6 mt-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-lg font-semibold text-gray-700">Tổng số phòng</div>
            <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-lg font-semibold text-gray-700">Phòng còn trống</div>
            <div className="text-2xl font-bold text-green-600">
              {rooms.filter(room => getRoomStatus(room) === "Còn trống").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-lg font-semibold text-gray-700">Phòng đã đầy</div>
            <div className="text-2xl font-bold text-red-600">
              {rooms.filter(room => getRoomStatus(room) === "Đã đầy").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-lg font-semibold text-gray-700">Hợp đồng hiện tại</div>
            <div className="text-2xl font-bold text-purple-600">{contracts.length}</div>
          </div>
        </div>

        {/* Bảng hợp đồng hiện tại */}
        {contracts.length > 0 && (
          <div className="mx-6 mt-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh sách hợp đồng hiện tại</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[200px] overflow-y-auto">
                <table className="w-full text-center">
                  <thead className="bg-[#F9E9B4] sticky top-0 z-10">
                    <tr>
                      <th className="border px-2 py-1">Mã hợp đồng</th>
                      <th className="border px-2 py-1">Mã sinh viên</th>
                      <th className="border px-2 py-1">Tên sinh viên</th>
                      <th className="border px-2 py-1">Mã phòng</th>
                      <th className="border px-2 py-1">Ngày lập</th>
                      <th className="border px-2 py-1">Ngày hết hạn</th>
                      <th className="border px-2 py-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr
                        key={contract.MaHD}
                        className={`cursor-pointer ${selectedContract?.MaHD === contract.MaHD ? "bg-blue-100" : "bg-white hover:bg-gray-50"
                          }`}
                        onClick={() => handleContractClick(contract)}
                      >
                        <td className="border px-2 py-2 font-medium">
                          <span className="inline-block w-5 text-center mr-2 align-middle">
                            {selectedContract?.MaHD === contract.MaHD ? "▶" : ""}
                          </span>
                          {contract.MaHD}
                        </td>
                        <td className="border px-2 py-2">{contract.MaSV}</td>
                        <td className="border px-2 py-2">{contract.TenSV}</td>
                        <td className="border px-2 py-2">{contract.MaPhong}</td>
                        <td className="border px-2 py-2">
                          {formatDate(contract.NgayLap)}
                        </td>
                        <td className="border px-2 py-2">
                          {formatDate(contract.NgayHetHan)}
                        </td>
                        <td className={`border px-2 py-2 ${getContractStatus(contract).color}`}>
                          {getContractStatus(contract).status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chi tiết hợp đồng được chọn */}
            {selectedContract && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Chi tiết hợp đồng: {selectedContract.MaHD}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Mã sinh viên:</strong> {selectedContract.MaSV}</p>
                    <p><strong>Tên sinh viên:</strong> {selectedContract.TenSV}</p>
                    <p><strong>Email:</strong> {selectedContract.email || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {selectedContract.SDT || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Mã phòng:</strong> {selectedContract.MaPhong}</p>
                    <p><strong>Tên phòng:</strong> {selectedContract.TenPhong || 'N/A'}</p>
                    <p><strong>Ngày lập:</strong> {formatDate(selectedContract.NgayLap)}</p>
                    <p><strong>Ngày hết hạn hiện tại:</strong> {formatDate(selectedContract.NgayHetHan)}</p>
                  </div>
                </div>

                {/* Ngày hết hạn mới */}
                <div className="mt-4 p-3 bg-white rounded border">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chọn ngày hết hạn mới:
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="date"
                      value={extendDate}
                      onChange={(e) => setExtendDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Chọn ngày hết hạn mới"
                    />
                    {extendDate && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {formatDate(extendDate)}
                      </span>
                    )}
                  </div>

                  {/* Quick selection buttons */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setMonth(date.getMonth() + 1);
                        setExtendDate(formatDateForInput(date));
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      +1 tháng
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setMonth(date.getMonth() + 3);
                        setExtendDate(formatDateForInput(date));
                      }}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      +3 tháng
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setMonth(date.getMonth() + 6);
                        setExtendDate(formatDateForInput(date));
                      }}
                      className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                    >
                      +6 tháng
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const date = new Date();
                        date.setFullYear(date.getFullYear() + 1);
                        setExtendDate(formatDateForInput(date));
                      }}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                    >
                      +1 năm
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Ngày hết hạn mới: <span className="font-semibold">{extendDate ? formatDate(extendDate) : 'Chưa chọn'}</span>
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                    onClick={() => {
                      setForm(f => ({ ...f, rentalId: selectedContract.MaHD }));
                      // Set default extend date to current expiry date + 3 months
                      const currentExpiry = selectedContract.NgayHetHan ? new Date(selectedContract.NgayHetHan) : new Date();
                      const defaultExtend = new Date(currentExpiry);
                      defaultExtend.setMonth(defaultExtend.getMonth() + 3);
                      setExtendDate(formatDateForInput(defaultExtend));
                      showMessage('info', 'Đã chọn hợp đồng để gia hạn. Chọn ngày hết hạn mới và nhấn "Gia hạn" để tiếp tục.');
                    }}
                  >
                    Gia hạn hợp đồng này
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    onClick={handleDeleteContract}
                  >
                    Xóa hợp đồng
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
                    onClick={() => {
                      setSelectedContract(null);
                      setExtendDate('');
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa hợp đồng */}
      {showDeleteModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="text-red-500 text-2xl mr-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800">Xác nhận xóa hợp đồng</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Bạn có chắc chắn muốn xóa hợp đồng này?
              </p>
              <div className="bg-gray-50 p-3 rounded border">
                <p><strong>Mã hợp đồng:</strong> {selectedContract.MaHD}</p>
                <p><strong>Sinh viên:</strong> {selectedContract.TenSV} ({selectedContract.MaSV})</p>
                <p><strong>Phòng:</strong> {selectedContract.MaPhong}</p>
                <p><strong>Ngày hết hạn:</strong> {formatDate(selectedContract.NgayHetHan)}</p>
              </div>
              <p className="text-red-600 text-sm mt-3 font-semibold">
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteContract}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteContract}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
              >
                Xóa hợp đồng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomRentalManagement;