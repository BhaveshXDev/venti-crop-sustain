
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("male");
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password, name, gender, mobile);
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
            Create an Account
          </h1>
          <p className="text-venti-gray-600 dark:text-venti-gray-400 text-sm">
            Sign up to get started with VentriGrow
          </p>
        </div>

        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm mb-4">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="venti-label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="venti-input pl-10 w-full"
                  required
                />
              </div>
            </div>

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
                  placeholder="you@example.com"
                  className="venti-input pl-10 w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mobile" className="venti-label">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="venti-input pl-10 w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="venti-label block mb-2">Gender</label>
              <RadioGroup 
                value={gender} 
                onValueChange={setGender}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="gender-other" />
                  <Label htmlFor="gender-other">Other</Label>
                </div>
              </RadioGroup>
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
              <p className="text-xs text-venti-gray-500 mt-1.5">
                Password must be at least 8 characters
              </p>
            </div>

            <button
              type="submit"
              className="venti-button-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          <span className="text-venti-gray-600 dark:text-venti-gray-400">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-venti-green-600 dark:text-venti-green-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
