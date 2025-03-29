import React, { useState, useRef, useEffect } from "react";
import { Mail, User, Building, MapPin, Phone, Leaf, Upload, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { getGreenhouseData, Greenhouse } from "@/utils/api";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [greenhouse] = useState<Greenhouse>(getGreenhouseData());
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.mobile || "555-123-4567",
    company: "VentiFarms Inc.",
    location: user?.location || "Central Valley, CA"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileImage(publicUrl);
      await updateUserProfile({ profileImage: publicUrl });
      toast.success("Profile image updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfileImage = async () => {
    try {
      if (!user?.profileImage) return;
      
      // Extract file path from URL
      const urlParts = user.profileImage.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('profile-images')).join('/');
      
      // Delete from storage
      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) throw error;

      setProfileImage(undefined);
      await updateUserProfile({ profileImage: undefined });
      toast.success("Profile image removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove image");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        location: formData.location,
        profileImage
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 pb-20">
      <div className="relative h-48 bg-gradient-to-r from-venti-green-600 to-venti-green-400">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b')] bg-cover bg-center opacity-20"></div>
      </div>

      <div className="px-4 -mt-16">
        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-venti-gray-800 bg-venti-green-100 dark:bg-venti-green-900/30">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={user?.name || "User"} />
                ) : (
                  <AvatarFallback className="text-venti-green-600 dark:text-venti-green-400">
                    {user?.name ? (
                      user.name.split(' ').map(n => n[0]).join('')
                    ) : (
                      <User size={48} />
                    )}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {isEditing && (
                <div className="absolute -bottom-1 -right-1 flex space-x-1">
                  <button 
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="bg-venti-green-500 text-white p-1.5 rounded-full shadow-md hover:bg-venti-green-600 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Upload size={14} />
                    )}
                  </button>
                  
                  {profileImage && (
                    <button 
                      onClick={removeProfileImage}
                      disabled={isUploading}
                      className="bg-rose-500 text-white p-1.5 rounded-full shadow-md hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold mt-3">{user?.name || "User"}</h2>
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
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="venti-input pl-10 w-full"
                    disabled
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
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="venti-input pl-10 w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="venti-button-outline flex-1"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="venti-button-primary flex-1"
                  disabled={isUploading}
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
                    <p>{formData.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Phone</p>
                    <p>{formData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Building size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Company</p>
                    <p>{formData.company}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin size={18} className="text-venti-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-venti-gray-500 dark:text-venti-gray-400">Location</p>
                    <p>{formData.location}</p>
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
