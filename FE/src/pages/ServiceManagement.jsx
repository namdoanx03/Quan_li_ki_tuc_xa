import React, { useState, useEffect } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    MaDV: "",
    TenDV: "",
    GiaDV: "",
    units: ""
  });
  const [errors, setErrors] = useState({});
  const [popupMsg, setPopupMsg] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(services.length / itemsPerPage);

  // Validate input
  const validateForm = () => {
    const newErrors = {};
    if (!form.MaDV) newErrors.MaDV = "Mã dịch vụ không được để trống";
    if (!form.TenDV) newErrors.TenDV = "Tên dịch vụ không được để trống";
    if (!form.GiaDV) newErrors.GiaDV = "Giá dịch vụ không được để trống";
    else if (isNaN(form.GiaDV) || Number(form.GiaDV) <= 0) newErrors.GiaDV = "Giá dịch vụ phải là số dương";
    if (!form.units) newErrors.units = "Đơn vị không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await fetch(`${baseURL}${SummaryApi.getAllService.url}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.result || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Handle service selection
  const handleServiceSelect = async (service) => {
    // Fetch data mới nhất trước
    await fetchServices();
    
    if (selected === service.MaDV) {
      setSelected(null);
      setForm({ MaDV: "", TenDV: "", GiaDV: "", units: "" });
      setErrors({});
    } else {
      setSelected(service.MaDV);
      setForm({
        MaDV: service.MaDV,
        TenDV: service.TenDV,
        GiaDV: service.GiaDV,
        units: service.units
      });
      setErrors({});
    }
  };

  // Add new service
  const handleAddService = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(`${baseURL}${SummaryApi.addService.url}`, {
        method: SummaryApi.addService.method.toUpperCase(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        fetchServices();
        setForm({ MaDV: "", TenDV: "", GiaDV: "", units: "" });
        setSelected(null);
        setErrors({});
        setPopupMsg("Thêm dịch vụ thành công!");
        setTimeout(() => setPopupMsg(""), 2000);
      } else {
        const err = await response.json();
        alert(err.message || "Lỗi khi thêm dịch vụ!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  // Update service
  const handleUpdateService = async () => {
    if (!selected) {
      alert("Vui lòng chọn dịch vụ cần sửa!");
      return;
    }
    if (!validateForm()) return;

    // Chỉ gửi các trường không phải MaDV
    const updatePayload = {
      TenDV: form.TenDV,
      GiaDV: form.GiaDV,
      units: form.units
    };

    try {
      const response = await fetch(`${baseURL}${SummaryApi.updateService.url}?MaDV=${selected}`, {
        method: SummaryApi.updateService.method.toUpperCase(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      if (response.ok) {
        await fetchServices();
        setForm({
          MaDV: form.MaDV,
          TenDV: form.TenDV,
          GiaDV: form.GiaDV,
          units: form.units
        });
        setErrors({});
        setPopupMsg("Đã sửa thành công!");
        setTimeout(() => setPopupMsg(""), 2000);
      } else {
        const err = await response.json();
        alert(err.message || "Lỗi khi cập nhật dịch vụ!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!selected) {
      alert("Vui lòng chọn dịch vụ cần xóa!");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      const response = await fetch(`${baseURL}${SummaryApi.deleteService.url}?MaDV=${selected}`, {
        method: SummaryApi.deleteService.method.toUpperCase()
      });
      if (response.ok) {
        fetchServices();
        setForm({ MaDV: "", TenDV: "", GiaDV: "", units: "" });
        setSelected(null);
        setErrors({});
      } else {
        const err = await response.json();
        alert(err.message || "Lỗi khi xóa dịch vụ!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchServices();
    setForm({ MaDV: "", TenDV: "", GiaDV: "", units: "" });
    setSelected(null);
    setErrors({});
  };

  // Hàm tạo mảng số trang, có thể hiện dấu ...
  function renderPagination() {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      {popupMsg && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-base font-semibold">
            {popupMsg}
          </div>
        </div>
      )}
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-3 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl " onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase flex-1">QUẢN LÝ DỊCH VỤ</h1>
        </div>

        {/* Form dịch vụ */}
        <div className="bg-[#E3F1FB] border border-blue-200 rounded-lg mx-6 mt-4 p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 justify-center items-center max-w-3xl mx-auto">
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Mã dịch vụ:</label>
              <div className="flex flex-col">
                <input className={`border rounded py-1 px-2 w-40 ${errors.MaDV ? 'border-red-500' : 'border-gray-300'}`} name="MaDV" value={form.MaDV} onChange={handleInputChange} />
                {errors.MaDV && <span className="text-red-500 text-xs mt-1">{errors.MaDV}</span>}
              </div>
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Tên dịch vụ:</label>
              <div className="flex flex-col">
                <input className={`border rounded py-1 px-2 w-40 ${errors.TenDV ? 'border-red-500' : 'border-gray-300'}`} name="TenDV" value={form.TenDV} onChange={handleInputChange} />
                {errors.TenDV && <span className="text-red-500 text-xs mt-1">{errors.TenDV}</span>}
              </div>
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Giá dịch vụ:</label>
              <div className="flex flex-col">
                <input className={`border rounded py-1 px-2 w-40 ${errors.GiaDV ? 'border-red-500' : 'border-gray-300'}`} name="GiaDV" value={form.GiaDV} onChange={handleInputChange} />
                {errors.GiaDV && <span className="text-red-500 text-xs mt-1">{errors.GiaDV}</span>}
              </div>
            </div>
            <div className="flex items-center">
              <label className="font-bold mr-2 w-28">Đơn vị:</label>
              <div className="flex flex-col">
                <input className={`border rounded py-1 px-2 w-40 ${errors.units ? 'border-red-500' : 'border-gray-300'}`} name="units" value={form.units} onChange={handleInputChange} />
                {errors.units && <span className="text-red-500 text-xs mt-1">{errors.units}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-6 mb-2">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 rounded" onClick={handleAddService}>Thêm</button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-2 rounded" onClick={handleUpdateService}>Sửa</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-2 rounded" onClick={handleDeleteService}>Xóa</button>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-2 rounded" onClick={handleRefresh}>Làm mới</button>
          </div>
        </div>

        {/* Bảng dịch vụ */}
        <div className="mx-6 mt-6 border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-center">
            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="border px-2 py-1">Mã dịch vụ</th>
                <th className="border px-2 py-1">Tên dịch vụ</th>
                <th className="border px-2 py-1">Giá dịch vụ</th>
                <th className="border px-2 py-1">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((service) => (
                <tr
                  key={service.MaDV}
                  className={selected === service.MaDV ? "bg-yellow-100 cursor-pointer" : "cursor-pointer bg-[#fff]"}
                  onClick={() => handleServiceSelect(service)}
                >
                  <td className="border px-2 py-2 text-left font-medium">
                    <span className="inline-block w-5 text-center mr-2 align-middle">{selected === service.MaDV ? "▶" : ""}</span>
                    {service.MaDV}
                  </td>
                  <td className="border px-2 py-2">{service.TenDV}</td>
                  <td className="border px-2 py-2">{Number(service.GiaDV).toLocaleString("vi-VN")}</td>
                  <td className="border px-2 py-2">{service.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 border-t mt-6 px-6 py-4 rounded-b-xl">
          {/* PHÂN TRANG */}
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
                <span key={idx} className="px-2 text-gray-500">
                  ...
                </span>
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

export default ServiceManagement;