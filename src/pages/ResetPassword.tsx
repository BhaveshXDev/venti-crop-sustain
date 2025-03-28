
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a valid password reset URL
    const checkResetToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error("Invalid or expired password reset link");
        setTimeout(() => navigate("/login"), 2000);
      }
    };
    
    checkResetToken();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success("Password has been reset successfully");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-900 dark:to-venti-green-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="/lovable-uploads/fa9ac5dd-b695-4d56-803b-1836e56645fb.png"
              alt="VentiGrow Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="venti-logo-text text-2xl font-semibold mb-1">
            Reset Your Password
          </h1>
          <p className="text-venti-gray-600 dark:text-venti-gray-400 text-sm">
            Enter your new password below
          </p>
        </div>

        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm mb-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-venti-green-100 dark:bg-venti-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-venti-green-600 dark:text-venti-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Password Reset Complete</h3>
              <p className="text-center text-venti-gray-600 dark:text-venti-gray-400">
                Your password has been reset successfully. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="password" className="venti-label">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="venti-input pl-10 pr-10 w-full"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-venti-gray-400 hover:text-venti-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="venti-label">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="venti-input pl-10 w-full"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="venti-button-primary w-full mt-4"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
