
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const { signup, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Signup page mounted, checking user:", user);
    if (user) {
      console.log("User already logged in, navigating to dashboard");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt for:", email);
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(email, password, name, gender, mobile, profileImage || undefined);
      console.log("Signup successful");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-venti-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-venti-gray-600 dark:text-venti-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-venti-green-600 hover:text-venti-green-500 dark:text-venti-green-400 dark:hover:text-venti-green-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="venti-glass dark:venti-glass-dark py-8 px-4 shadow rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="relative rounded-full h-24 w-24 overflow-hidden bg-venti-green-100 dark:bg-venti-green-900/30 border-2 border-venti-green-200 dark:border-venti-green-800 mb-2">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile Preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-venti-green-600 dark:text-venti-green-400">
                    <User size={36} />
                  </div>
                )}
                
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-venti-green-500 text-white p-1.5 rounded-full shadow-md hover:bg-venti-green-600 transition-colors cursor-pointer"
                >
                  <Upload size={14} />
                </label>
                
                {profileImage && (
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute bottom-0 left-0 bg-rose-500 text-white p-1.5 rounded-full shadow-md hover:bg-rose-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                
                <input 
                  id="profile-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-xs text-venti-gray-500 dark:text-venti-gray-400">
                Add a profile picture (optional)
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    className="h-5 w-5 text-venti-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="venti-input pl-10 block w-full"
                  placeholder="Enter Your Name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className="h-5 w-5 text-venti-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="venti-input pl-10 block w-full"
                  placeholder="Enter Your Email"
                />
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
              >
                Gender
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="venti-input block w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Mobile Number Field */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
              >
                Mobile Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone
                    className="h-5 w-5 text-venti-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="venti-input pl-10 block w-full"
                  placeholder="+91"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className="h-5 w-5 text-venti-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="venti-input pl-10 pr-10 block w-full"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-venti-gray-400 hover:text-venti-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className="h-5 w-5 text-venti-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="venti-input pl-10 pr-10 block w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="venti-button-primary w-full py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
