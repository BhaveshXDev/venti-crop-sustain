
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { updateCO2Threshold, updateHumidityThreshold, updateTemperatureThreshold } from "@/utils/api";
import { toast } from "sonner";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  
  const [tempMin, setTempMin] = useState(18);
  const [tempMax, setTempMax] = useState(28);
  const [humidityMin, setHumidityMin] = useState(50);
  const [humidityMax, setHumidityMax] = useState(70);
  const [co2Min, setCo2Min] = useState(400);
  const [co2Max, setCo2Max] = useState(800);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // In a real app, you would apply the theme change here
    // document.documentElement.classList.toggle('dark');
  };

  const saveTemperatureThresholds = async () => {
    try {
      await updateTemperatureThreshold(tempMin, tempMax);
      toast.success("Temperature thresholds updated");
    } catch (error) {
      toast.error("Failed to update temperature thresholds");
    }
  };

  const saveHumidityThresholds = async () => {
    try {
      await updateHumidityThreshold(humidityMin, humidityMax);
      toast.success("Humidity thresholds updated");
    } catch (error) {
      toast.error("Failed to update humidity thresholds");
    }
  };

  const saveCO2Thresholds = async () => {
    try {
      await updateCO2Threshold(co2Min, co2Max);
      toast.success("CO2 thresholds updated");
    } catch (error) {
      toast.error("Failed to update CO2 thresholds");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 pb-20">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400">
              Customize your experience
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* General Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 px-1 mb-1">
            General
          </h3>
          <div className="venti-card overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-venti-gray-50 dark:hover:bg-venti-gray-800/30 transition-colors border-b border-border/50">
              <div className="flex items-center">
                {darkMode ? (
                  <Moon size={18} className="mr-3 text-venti-gray-600" />
                ) : (
                  <Sun size={18} className="mr-3 text-amber-500" />
                )}
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-venti-gray-200 peer-focus:outline-none rounded-full peer dark:bg-venti-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-venti-green-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-venti-gray-50 dark:hover:bg-venti-gray-800/30 transition-colors border-b border-border/50">
              <div className="flex items-center">
                <Bell size={18} className="mr-3 text-venti-green-500" />
                <span>Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-venti-gray-200 peer-focus:outline-none rounded-full peer dark:bg-venti-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-venti-green-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-venti-gray-50 dark:hover:bg-venti-gray-800/30 transition-colors">
              <div className="flex items-center">
                <Bell size={18} className="mr-3 text-blue-500" />
                <span>Email Alerts</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                />
                <div className="w-11 h-6 bg-venti-gray-200 peer-focus:outline-none rounded-full peer dark:bg-venti-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-venti-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Threshold Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 px-1 mb-1">
            Environmental Thresholds
          </h3>
          
          <div className="venti-card p-4 space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Temperature</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="venti-input w-16 py-1 text-center text-sm"
                    value={tempMin}
                    onChange={(e) => setTempMin(parseInt(e.target.value))}
                    min={10}
                    max={tempMax - 1}
                  />
                  <span className="text-venti-gray-500">-</span>
                  <input 
                    type="number" 
                    className="venti-input w-16 py-1 text-center text-sm"
                    value={tempMax}
                    onChange={(e) => setTempMax(parseInt(e.target.value))}
                    min={tempMin + 1}
                    max={35}
                  />
                  <span className="text-sm">°C</span>
                </div>
              </div>
              <button 
                className="venti-button-outline text-xs w-full py-1.5 mt-1"
                onClick={saveTemperatureThresholds}
              >
                Save
              </button>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Humidity</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="venti-input w-16 py-1 text-center text-sm"
                    value={humidityMin}
                    onChange={(e) => setHumidityMin(parseInt(e.target.value))}
                    min={30}
                    max={humidityMax - 5}
                  />
                  <span className="text-venti-gray-500">-</span>
                  <input 
                    type="number" 
                    className="venti-input w-16 py-1 text-center text-sm"
                    value={humidityMax}
                    onChange={(e) => setHumidityMax(parseInt(e.target.value))}
                    min={humidityMin + 5}
                    max={90}
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <button 
                className="venti-button-outline text-xs w-full py-1.5 mt-1"
                onClick={saveHumidityThresholds}
              >
                Save
              </button>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm">CO2 Level</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="venti-input w-16 py-1 text-center text-sm"
                    value={co2Min}
                    onChange={(e) => setCo2Min(parseInt(e.target.value))}
                    min={300}
                    max={co2Max - 100}
                    step={50}
                  />
                  <span className="text-venti-gray-500">-</span>
                  <input 
                    type="number" 
                    className="venti-input w-16 py-1 text-center text-sm"
                    value={co2Max}
                    onChange={(e) => setCo2Max(parseInt(e.target.value))}
                    min={co2Min + 100}
                    max={1500}
                    step={50}
                  />
                  <span className="text-sm">ppm</span>
                </div>
              </div>
              <button 
                className="venti-button-outline text-xs w-full py-1.5 mt-1"
                onClick={saveCO2Thresholds}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-medium text-venti-gray-600 dark:text-venti-gray-300 px-1 mb-1">
            Account
          </h3>
          <div className="venti-card overflow-hidden">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center justify-between w-full p-4 hover:bg-venti-gray-50 dark:hover:bg-venti-gray-800/30 transition-colors border-b border-border/50 text-left"
            >
              <span>Edit Profile</span>
              <ChevronRight size={18} className="text-venti-gray-400" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-4 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-rose-600 dark:text-rose-400 text-left"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Settings;
