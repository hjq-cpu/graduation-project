import AvatarUpload from "@/components/Profile/AvatarUpload";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import PasswordChangeForm from "@/components/Profile/PasswordChangeForm";

const Profile: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-8">
            <h1 className="text-2xl font-bold mb-4">个人信息管理</h1>
            <AvatarUpload />
            <ProfileEditForm />
            <PasswordChangeForm />
        </div>
    );
};

export default Profile;
