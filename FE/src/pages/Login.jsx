import React, { useState } from "react";
import user from "../assets/user.png";
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios({
        method: SummaryApi.login.method,
        url: baseURL + SummaryApi.login.url,
        data: {
          email: form.email,
          password: form.password,
        },
      });
      console.log(res.data);
      // Nếu login thành công, lưu token/user vào localStorage và chuyển hướng về trang chủ
      if (res.data && res.data.success) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        navigate("/");
      } else {
        setError(res.data?.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className=" rounded-xl shadow-lg w-full max-w-3xl p-0 border-2 border-gray-300" >
        {/* Header */}
        <div className="bg-[#e6f3fb] py-4 px-6 rounded-lg text-center m-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">ĐĂNG NHẬP HỆ THỐNG</h1>
        </div>
        <div className="flex flex-row bg-[#eaf6ff] rounded-b-2xl m-4">
          {/* Avatar bên trái */}
          <div className="flex flex-col items-center justify-center w-1/3  border-r-2 border-red-100">
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
            <form onSubmit={handleLogin}>
              <div className="mb-6 flex items-center">
                <label className="block font-semibold text-base text-right pr-4 w-40" htmlFor="username">Tên đăng nhập:</label>
                <input
                  id="username"
                  className="border rounded-lg py-2 px-2 text-lg border-[#BBD8FB]"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email của bạn"
                />
              </div>
              <div className="mb-6 flex items-center">
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
              <div className="flex items-center mb-4 justify-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={form.remember}
                  onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                  className="mr-2 w-4 h-4"
                />
                <label htmlFor="remember" className="text-gray-700 text-base">Duy trì đăng nhập</label>
              </div>
              {error && <div className="text-red-500 text-center mb-4 font-semibold">{error}</div>}
              <div className="flex flex-row gap-8  justify-center">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2  rounded-lg text-lg">Đăng nhập</button>
                <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg text-lg" onClick={() => { setForm({ username: "", password: "", remember: false }); setError(""); }}>Thoát</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
