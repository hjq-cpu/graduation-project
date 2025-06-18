import React, { useState } from "react";

const ProfileEditForm: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  // 这里可以用 useEffect 拉取用户信息并填充

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 假设后端接口为 /api/users/profile
    await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nickname, email }),
    });
    alert("资料修改成功！");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-semibold mb-2">个人资料编辑</h2>
      <div className="mb-2">
        <label>昵称：</label>
        <input
          className="border px-2 py-1 rounded"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label>邮箱：</label>
        <input
          className="border px-2 py-1 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="px-4 py-1 bg-green-500 text-white rounded" type="submit">
        保存
      </button>
    </form>
  );
};

export default ProfileEditForm;