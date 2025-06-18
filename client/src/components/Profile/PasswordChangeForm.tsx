import React, { useState } from "react";

const PasswordChangeForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("两次输入的新密码不一致！");
      return;
    }
    // 假设后端接口为 /api/users/password
    await fetch("/api/users/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    alert("密码修改成功！");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-semibold mb-2">密码修改</h2>
      <div className="mb-2">
        <label>旧密码：</label>
        <input
          type="password"
          className="border px-2 py-1 rounded"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label>新密码：</label>
        <input
          type="password"
          className="border px-2 py-1 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label>确认新密码：</label>
        <input
          type="password"
          className="border px-2 py-1 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="px-4 py-1 bg-yellow-500 text-white rounded" type="submit">
        修改密码
      </button>
    </form>
  );
};

export default PasswordChangeForm;