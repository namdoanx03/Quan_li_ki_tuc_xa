import React, { useState } from "react";
import user from "../assets/user.png";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "", remember: false });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className=" rounded-xl shadow-lg w-full max-w-3xl p-0 border-2 border-gray-300" >
        {/* Header */}
        <div className="bg-[#e6f3fb] py-4 px-6 rounded-lg text-center m-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">ĐĂNG NHẬP HỆ THỐNG</h1>
        </div>
        <div className="flex flex-row bg-[#eaf6ff] rounded-b-2xl m-4">
          {/* Avatar bên trái */}
          <div className="flex flex-col items-center justify-center w-1/3 py-12 border-r-2 border-red-100">
            <div className="bg-white rounded-full p-2 shadow-inner" style={{ boxShadow: '0 0 0 8px #e6f3fb' }}>
              <img
                src={user}
                alt="avatar"
                className="w-40 h-50 object-cover rounded-full"
              />
            </div>
          </div>
          {/* Form bên phải */}

          <div className="flex flex-col justify-center w-2/3 py-12 px-10">
            <div className="mb-8 flex items-center">
              <label className="block font-semibold text-base text-right pr-4 w-40" htmlFor="username">Tên đăng nhập:</label>
              <input
                id="username"
                className="border rounded-lg py-2 px-2 text-lg border-[#BBD8FB]"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Email của bạn"
              />
            </div>
            <div className="mb-8 flex items-center">
              <label className="block font-semibold  text-base text-right pr-4 w-40" htmlFor="password">Mật khẩu:</label>
              <input
                id="password"
                type="password"
                className="border rounded-lg py-2 px-2 text-lg border-[#BBD8FB]"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Mật khẩu của bạn"
              />
            </div>
            <div className="flex items-center mb-10 justify-center">
              <input
                type="checkbox"
                id="remember"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                className="mr-2 w-4 h-4"
              />
              <label htmlFor="remember" className="text-gray-700 text-base">Duy trì đăng nhập</label>
            </div>
            <div className="flex flex-row gap-6 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-lg">Đăng nhập</button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg text-lg">Thoát</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
