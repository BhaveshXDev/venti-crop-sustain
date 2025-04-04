import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.includes('@') || !forgotPasswordEmail.includes('.')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsResettingPassword(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
      setShowForgotPasswordModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setIsResettingPassword(false);
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
            Welcome to VentriGrow
          </h1>
          <p className="text-venti-gray-600 dark:text-venti-gray-400 text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm mb-4">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="venti-label">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="venti-input pl-10 w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="venti-label">
                Password
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

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm text-venti-green-600 dark:text-venti-green-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="venti-button-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          <span className="text-venti-gray-600 dark:text-venti-gray-400">
            Don't have an account?{" "}
          </span>
          <Link
            to="/signup"
            className="text-venti-green-600 dark:text-venti-green-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>

      {showForgotPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="venti-glass dark:venti-glass-dark rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-medium mb-4">Reset Password</h3>
            <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400 mb-4">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="venti-label">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="venti-input pl-10 w-full"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="venti-button-outline flex-1"
                  disabled={isResettingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="venti-button-primary flex-1"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? "Sending..." : "Send Instructions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
