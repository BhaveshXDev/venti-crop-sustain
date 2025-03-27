
import React, { useState } from "react";
import { Mail, User, Building, MapPin, Phone, Leaf } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { getGreenhouseData, Greenhouse } from "@/utils/api";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [greenhouse] = useState<Greenhouse>(getGreenhouseData());
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("555-123-4567");
  const [company, setCompany] = useState("VentiFarms Inc.");
  const [location, setLocation] = useState("Central Valley, CA");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 pb-20">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-venti-green-600 to-venti-green-400">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Profile Content */}
      <div className="px-4 -mt-16">
        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-venti-gray-800 overflow-hidden bg-venti-green-100 dark:bg-venti-green-900/30 flex items-center justify-center mb-3">
              <User size={48} className="text-venti-green-600 dark:text-venti-green-400" />
            </div>
            <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
            <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400">
              Greenhouse Manager
            </p>
          </div>

          {isEditing ? (
            <div className="space-y-4">
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
                    className="venti-input pl-10 w-full"
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
                    className="venti-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="venti-label">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="venti-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company" className="venti-label">
                  Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                    <Building size={18} />
                  </div>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="venti-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="location" className="venti-label">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-venti-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="venti-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="venti-button-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="venti-button-primary flex-1"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Email</p>
                    <p>{email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Phone</p>
                    <p>{phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Building size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Company</p>
                    <p>{company}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Location</p>
                    <p>{location}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="venti-button-primary w-full mt-4"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Greenhouse Information */}
        <div className="venti-card p-5 mb-8">
          <h3 className="text-base font-medium flex items-center mb-4">
            <Leaf size={18} className="mr-2 text-venti-green-500" />
            Greenhouse Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-venti-gray-600 dark:text-venti-gray-400">Name</span>
              <span className="font-medium">{greenhouse.name}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-venti-gray-600 dark:text-venti-gray-400">Location</span>
              <span className="font-medium">{greenhouse.location}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-border/50">
              <span className="text-venti-gray-600 dark:text-venti-gray-400">Size</span>
              <span className="font-medium">{greenhouse.size}</span>
            </div>

            <div>
              <p className="text-venti-gray-600 dark:text-venti-gray-400 mb-2">Crops</p>
              <div className="flex flex-wrap gap-2">
                {greenhouse.cropTypes.map((crop, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-venti-green-50 dark:bg-venti-green-900/30 px-3 py-1 text-sm font-medium text-venti-green-700 dark:text-venti-green-300"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-venti-gray-600 dark:text-venti-gray-400 mb-2">Sensors</p>
              <div className="flex flex-wrap gap-2">
                {greenhouse.sensors.map((sensor, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-venti-gray-100 dark:bg-venti-gray-800 px-3 py-1 text-sm font-medium text-venti-gray-700 dark:text-venti-gray-300"
                  >
                    {sensor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
