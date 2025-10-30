import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const shipments = [
    {
      id: "SHP-00123",
      status: "OK",
      origin: "Miami, FL",
      dest: "Atlanta, GA",
      temp: "3.5°C",
      humidity: "85%",
    },
    {
      id: "SHP-00124",
      status: "Alert",
      origin: "Los Angeles, CA",
      dest: "Dallas, TX",
      temp: "8.2°C",
      humidity: "91%",
    },
    {
      id: "SHP-00125",
      status: "Warning",
      origin: "New York, NY",
      dest: "Chicago, IL",
      temp: "5.1°C",
      humidity: "88%",
    },
    {
      id: "SHP-00126",
      status: "OK",
      origin: "Seattle, WA",
      dest: "Denver, CO",
      temp: "2.8°C",
      humidity: "82%",
    },
  ];

  const alerts = [
    {
      type: "High Temperature Alert",
      text: "SHP-00124 exceeded 8°C threshold.",
      time: "2 min ago",
    },
    {
      type: "Low Battery Warning",
      text: "Device DEV-881 is at 18%.",
      time: "10 min ago",
    },
    {
      type: "Light Exposure",
      text: "SHP-00126 light sensor triggered.",
      time: "29 min ago",
    },
    {
      type: "Door Opened",
      text: "SHP-00126 door sensor triggered.",
      time: "45 min ago",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-4">
        <div className="flex flex-row">
          <img src="/image.png" className="w-8 h-8" />

          <h2 className="text-xl font-bold mb-6">ReFrost</h2>
        </div>

        <nav className="space-y-4 text-gray-700">
          <p className="font-semibold text-blue-600">Dashboard</p>
          <p>Shipments</p>
          <p>Devices</p>
          <p>Reports</p>
          <p>Alerts</p>
          <p>Settings</p>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cold Chain Dashboard</h1>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="font-semibold">Temperature</p>
            <p className="text-xl font-bold">3.5°C</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="font-semibold">Humidity</p>
            <p className="text-xl font-bold">85%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="font-semibold">Vibration</p>
            <p className="text-xl font-bold">0.2 G</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="font-semibold">Light Exposure</p>
            <p className="text-xl font-bold text-red-600">Alert</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-bold mb-3">Shipment Overview</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 text-left">Shipment ID</th>
                <th>Status</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Temp</th>
                <th>Humidity</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 text-blue-600">{s.id}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        s.status === "OK"
                          ? "bg-green-200 text-green-700"
                          : s.status === "Warning"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>{s.origin}</td>
                  <td>{s.dest}</td>
                  <td>{s.temp}</td>
                  <td>{s.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold mb-3">Active Alerts</h2>
          <div className="flex flex-row gap-4 overflow-x-auto pb-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg min-w-[200px] bg-white"
              >
                <p className="font-bold text-red-600">{a.type}</p>
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
