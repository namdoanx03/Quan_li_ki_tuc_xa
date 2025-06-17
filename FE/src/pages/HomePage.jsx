import { IoMdClose } from "react-icons/io";
import { FcSearch, FcDepartment, FcPortraitMode, FcKindle, FcHome, FcComboChart, FcNews, FcServices } from "react-icons/fc";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const functionButtons = [
  {
    name: "Quản lý dãy phòng",
    icon: <FcDepartment size={40} />,
    border: false,
    path: "/building-blocks"
  },
  {
    name: "Quản lý sinh viên",
    icon: <FcPortraitMode size={40} />,
    border: false,
    path: "/students"
  },
  {
    name: "Quản lý dịch vụ",
    icon: <FcServices size={40} />,
    border: true,
    path: "/services"
  },
  {
    name: "Quản lý phòng",
    icon: <FcHome size={40} />,
    border: false,
    path: "/rooms"
  },
  {
    name: "Quản lý thuê phòng",
    icon: <FcNews size={40} />,
    border: false,
    path: "/room-rental"
  },
  {
    name: "Tìm kiếm",
    icon: <FcSearch size={40} />,
    border: false,
    path: "/search"
  },
  {
    name: "Thống kê, báo cáo",
    icon: <FcComboChart size={40} />,
    border: true,
    path: "/data-report"
  },

];

const HomePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutAndGoLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="rounded-xl shadow-lg w-full max-w-5xl p-0 relative bg-blue-100 border-2 border-gray-200" >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          {/* Logo + Trường */}
          <div className="flex items-center space-x-3">
            <img
              src={Logo}
              alt="Logo"
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="font-bold text-blue-900 text-sm leading-tight">Học viện Công nghệ Bưu chính Viễn thông</div>
              <div className="text-blue-900 text-xs leading-tight mt-1">Posts and Telecommunications Institute of Technology (PTIT)</div>
              {/* <div className="text-blue-900 text-xs leading-tight">HCMC University of Education</div> */}
            </div>
          </div>
        </div>
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-md p-2"
          onClick={() => {
            if (isLoggedIn) setShowConfirm(true);
            else navigate('/login');
          }}
        >
          <IoMdClose size={22} />
        </button>

        {/* Modal xác nhận đóng */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center">
              <div className="mb-6 text-lg font-semibold">Bạn có chắc muốn đóng ứng dụng không?</div>
              <div className="flex justify-center gap-6">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
                  onClick={handleLogoutAndGoLogin}
                >
                  Có
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded"
                  onClick={() => setShowConfirm(false)}
                >
                  Không
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tiêu đề */}
        <div className="w-full text-center my-8 ">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">QUẢN LÝ SINH VIÊN KÝ TÚC XÁ</h1>
        </div>

        {/* Grid chức năng */}
        <div className="w-full px-6 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {functionButtons.map((btn) => (
              <button
                key={btn.name}
                className={`bg-white rounded shadow flex  items-center justify-center p-5 min-h-[120px] border-2 transition ${btn.border ? "border-blue-500" : "border-transparent"} hover:shadow-lg`}
                tabIndex={0}
                onClick={() => btn.path && navigate(btn.path)}
              >
                <span className="mb-2 text-gray-800 mr-2">{btn.icon}</span>
                <span className="font-semibold text-lg text-gray-800">{btn.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;