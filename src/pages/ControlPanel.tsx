import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Fan, Thermometer, Droplets, Sliders, Wind as WindIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import GaugeChart from "@/components/GaugeChart";
import { fetchCurrentSensorData, setFanSpeed, SensorData } from "@/utils/api";
import { toast } from "sonner";

const ControlPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");
  const [fanSpeed, setFanSpeedState] = useState(50);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCurrentSensorData();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [user, navigate]);

  const handleFanSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFanSpeedState(parseInt(e.target.value));
  };

  const handleApplyChanges = async () => {
    setIsUpdating(true);
    try {
      await setFanSpeed(fanSpeed);
      toast.success(`Fan speed set to ${fanSpeed}%`);
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-950 dark:to-venti-green-950/40 pb-20">
      <header className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Control Panel</h1>
            <p className="text-sm text-venti-gray-600 dark:text-venti-gray-400">
              Manage ventilation settings
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 mb-4">
        <div className="flex rounded-xl overflow-hidden border border-border">
          <button
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "manual"
                ? "bg-venti-green-500 text-white"
                : "bg-white dark:bg-venti-gray-800 text-venti-gray-600 dark:text-venti-gray-300"
            }`}
            onClick={() => setActiveTab("manual")}
          >
            Manual Control
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "auto"
                ? "bg-venti-green-500 text-white"
                : "bg-white dark:bg-venti-gray-800 text-venti-gray-600 dark:text-venti-gray-300"
            }`}
            onClick={() => setActiveTab("auto")}
          >
            Auto Mode
          </button>
        </div>
      </div>

      <main className="p-4 space-y-5">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venti-green-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "manual" ? (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {sensorData && (
                    <>
                      <GaugeChart
                        value={Math.round(sensorData.temperature)}
                        min={10}
                        max={35}
                        title="Temp"
                        unit="°C"
                        thresholds={{ warning: 60, critical: 80 }}
                      />
                      <GaugeChart
                        value={Math.round(sensorData.humidity)}
                        min={0}
                        max={100}
                        title="Humidity"
                        unit="%"
                        thresholds={{ warning: 70, critical: 85 }}
                      />
                      <GaugeChart
                        value={Math.round(sensorData.co2 / 10)}
                        min={0}
                         
                        title="CO2"
                        unit="x10ppm"
                        thresholds={{ warning: 70, critical: 90 }}
                      />
                    </>
                  )}
                </div>

                <div className="venti-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium flex items-center">
                      <Fan size={18} className="mr-2 text-venti-green-500" />
                      Fan Control
                    </h3>
                    <div className="text-sm font-semibold">
                      {fanSpeed}%
                    </div>
                  </div>

                  <div className="space-y-5">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fanSpeed}
                      onChange={handleFanSpeedChange}
                      className="w-full h-2 bg-venti-gray-100 dark:bg-venti-gray-700 rounded-lg appearance-none cursor-pointer accent-venti-green-500"
                    />
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 25, 50, 75, 100].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setFanSpeedState(speed)}
                          className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                            fanSpeed === speed
                              ? "bg-venti-green-100 dark:bg-venti-green-900/30 text-venti-green-700 dark:text-venti-green-400 border border-venti-green-200 dark:border-venti-green-800"
                              : "bg-white dark:bg-venti-gray-800 text-venti-gray-700 dark:text-venti-gray-300 border border-venti-gray-200 dark:border-venti-gray-700"
                          }`}
                        >
                          {speed}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="venti-button-outline flex-1"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </button>
                  <button
                    onClick={handleApplyChanges}
                    className="venti-button-primary flex-1"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Apply Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="venti-card p-5">
                  <div className="flex items-center mb-4">
                    <Sliders size={18} className="mr-2 text-venti-green-500" />
                    <h3 className="text-base font-medium">
                      Automatic Fan Control
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm">
                        <Thermometer size={16} className="mr-1.5 text-rose-500" />
                        Temperature based
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-9 h-5 bg-venti-gray-200 peer-focus:outline-none rounded-full peer dark:bg-venti-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-venti-green-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm">
                        <Droplets size={16} className="mr-1.5 text-blue-500" />
                        Humidity based
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-9 h-5 bg-venti-gray-200 peer-focus:outline-none rounded-full peer dark:bg-venti-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-venti-green-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm">
                        <WindIcon size={16} className="mr-1.5 text-emerald-500" />
                        CO2 based
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-9 h-5 bg-venti-gray-200 peer-focus:outline-none rounded-full peer dark:bg-venti-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-venti-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="venti-card p-5">
                  <h3 className="text-base font-medium mb-4">Threshold Settings</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-venti-gray-600 dark:text-venti-gray-400">Temperature</span>
                        <span className="text-sm font-medium">22°C - 28°C</span>
                      </div>
                      <div className="h-2 bg-venti-gray-100 dark:bg-venti-gray-700 rounded-lg relative">
                        <div className="absolute top-0 left-[36%] right-[17%] h-full bg-venti-green-500 rounded-lg"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-venti-gray-600 dark:text-venti-gray-400">Humidity</span>
                        <span className="text-sm font-medium">50% - 70%</span>
                      </div>
                      <div className="h-2 bg-venti-gray-100 dark:bg-venti-gray-700 rounded-lg relative">
                        <div className="absolute top-0 left-[50%] right-[30%] h-full bg-venti-green-500 rounded-lg"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-venti-gray-600 dark:text-venti-gray-400">CO2 Level</span>
                        <span className="text-sm font-medium">400 - 800 ppm</span>
                      </div>
                      <div className="h-2 bg-venti-gray-100 dark:bg-venti-gray-700 rounded-lg relative">
                        <div className="absolute top-0 left-[33%] right-[33%] h-full bg-venti-green-500 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  className="venti-button-primary w-full"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Activate Auto Mode
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default ControlPanel;
