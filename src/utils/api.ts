
// Mock API data for demonstration purposes

export interface SensorData {
  temperature: number;
  humidity: number;
  co2: number;
  timestamp: string;
}

export interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    condition: string;
    high: number;
    low: number;
  }>;
}

export interface EnergyData {
  daily: {
    labels: string[];
    data: number[];
  };
  weekly: {
    labels: string[];
    data: number[];
  };
  monthly: {
    labels: string[];
    data: number[];
  };
}

export interface Greenhouse {
  id: string;
  name: string;
  location: string;
  size: string;
  cropTypes: string[];
  sensors: string[];
}

export const getGreenhouseData = (): Greenhouse => {
  return {
    id: "gh1",
    name: "Main Greenhouse",
    location: "North Field",
    size: "2000 sq ft",
    cropTypes: ["Tomatoes", "Cucumbers", "Peppers"],
    sensors: ["Temperature", "Humidity", "CO2", "Light"],
  };
};

export const fetchCurrentSensorData = (): Promise<SensorData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temperature: 22 + Math.random() * 6,
        humidity: 55 + Math.random() * 20,
        co2: 400 + Math.random() * 200,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const fetchHistoricalSensorData = (): Promise<SensorData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: SensorData[] = [];
      const now = new Date();
      
      for (let i = 24; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
        data.push({
          temperature: 22 + Math.random() * 6,
          humidity: 55 + Math.random() * 20,
          co2: 400 + Math.random() * 200,
          timestamp,
        });
      }
      
      resolve(data);
    }, 800);
  });
};

export const fetchWeatherData = (): Promise<WeatherData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        condition: "Sunny",
        temperature: 24,
        humidity: 45,
        windSpeed: 8,
        forecast: [
          { day: "Today", condition: "Sunny", high: 25, low: 14 },
          { day: "Tomorrow", condition: "Partly Cloudy", high: 23, low: 12 },
          { day: "Wed", condition: "Cloudy", high: 21, low: 11 },
          { day: "Thu", condition: "Rainy", high: 19, low: 10 },
          { day: "Fri", condition: "Sunny", high: 22, low: 12 },
        ],
      });
    }, 700);
  });
};

export const fetchEnergyData = (): Promise<EnergyData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        daily: {
          labels: ["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"],
          data: [5, 3, 7, 12, 10, 8],
        },
        weekly: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [45, 52, 49, 60, 55, 48, 50],
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [250, 300, 280, 320, 340, 310],
        },
      });
    }, 600);
  });
};

export const setFanSpeed = (speed: number): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    console.log(`Setting fan speed to: ${speed}%`);
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const updateTemperatureThreshold = (
  min: number,
  max: number
): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    console.log(`Setting temperature threshold: ${min}°C - ${max}°C`);
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const updateHumidityThreshold = (
  min: number,
  max: number
): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    console.log(`Setting humidity threshold: ${min}% - ${max}%`);
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const updateCO2Threshold = (
  min: number,
  max: number
): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    console.log(`Setting CO2 threshold: ${min}ppm - ${max}ppm`);
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
