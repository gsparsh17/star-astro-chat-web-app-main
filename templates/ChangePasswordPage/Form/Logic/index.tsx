import { useState } from "react";
import Field from "@/components/Field";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.BACKEND_URL}/auth/change-password`,
        {
          password: currentPassword,
          new_password: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Password changed successfully");
        
        // Custom toast for password change success
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="mt-1 text-base text-white text-center">
                    Your cosmic security shield has been upgraded! 🚀✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        ));
        
        // Redirect to profile or home page
        router.push("/");
      } else {
        throw new Error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while changing your password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field
        className="mb-4"
        label="Current Password"
        placeholder="Enter current password"
        type="password"
        icon="lock"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      
      <Field
        className="mb-4"
        label="New Password"
        placeholder="Enter new password"
        type="password"
        icon="lock"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      
      <Field
        className="mb-6"
        label="Confirm New Password"
        placeholder="Confirm new password"
        type="password"
        icon="lock"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-600 rounded-md dark:bg-red-900/50 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        className="btn-blue btn-large w-full"
        type="submit"
        disabled={loading}
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;