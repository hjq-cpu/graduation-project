import React, { useState } from "react";

const AvatarUpload: React.FC = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAvatar(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);

        // 假设后端接口为 /api/users/avatar
        await fetch("/api/users/avatar", {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        alert("头像上传成功！");
    };

    return (
        <div>
            <h2 className="font-semibold mb-2">头像上传</h2>
            <img
                src={avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-24 h-24 rounded-full mb-2 object-cover"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
                className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
                onClick={handleUpload}
                disabled={!file}
            >
                上传
            </button>
        </div>
    );
};

export default AvatarUpload;