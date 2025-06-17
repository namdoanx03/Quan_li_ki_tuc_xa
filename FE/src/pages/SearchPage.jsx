import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

const SearchPage = () => {
  const [form, setForm] = useState({ student: "", service: "", room: "" });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="rounded-xl shadow-lg w-full max-w-4xl p-0 relative bg-[#E8F2F9]">
        {/* Header */}
        <div className="bg-[#F9E9B4] py-5 px-6 text-center flex items-center rounded-t-xl">
          <button className="text-4xl mr-6" onClick={() => navigate("/")}> <TiArrowBack /> </button>
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide uppercase flex-1">TÌM KIẾM</h1>
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
                placeholder="điền mã dịch vụ"
                value={form.service}
                onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mb-8">
            <label className="font-bold mb-2">Tìm kiếm phòng:</label>
            <input
              className="border rounded py-2 px-4 w-64"
              placeholder="điền mã phòng"
              value={form.room}
              onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
            />
          </div>
          <div className="flex justify-center gap-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded">Tìm kiếm</button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded">Hủy</button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row items-center justify-start gap-4 bg-blue-50 border-t px-6 py-4 rounded-b-xl">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded">Trở về</button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-2 rounded">Thoát</button>
          <div className="flex-1 text-right text-base font-medium text-gray-700 pr-4">Tổng số trang: 1</div>
          <div className="flex items-center gap-1">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">&lt;&lt;</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">&lt;</button>
            <span className="px-2">1/1</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">&gt;</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;