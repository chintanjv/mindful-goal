import React, { useState, useEffect } from "react";
import "./index.css";

const goalTypes = [
  { key: "daily", label: "Today" },
  { key: "weekly", label: "This Week" },
  { key: "monthly", label: "This Month" },
  { key: "yearly", label: "This Year" }
];

const GoalCard = ({ label, goal, onEdit, onToggle }) => (
  <div className="border rounded-2xl p-4 shadow-md bg-white">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-semibold">{label}</h2>
      {goal?.completed && <span className="text-green-500">✓</span>}
    </div>
    <p
      className="text-gray-700 cursor-pointer"
      onClick={() => onEdit(label.toLowerCase())}
    >
      {goal?.text || "Tap to add a goal"}
    </p>
    {goal?.text && (
      <button
        className="mt-2 text-sm text-blue-500"
        onClick={() => onToggle(label.toLowerCase())}
      >
        {goal.completed ? "Mark as Incomplete" : "Mark as Complete"}
      </button>
    )}
  </div>
);

export default function App() {
  const [goals, setGoals] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("mindful_goals");
    if (stored) setGoals(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("mindful_goals", JSON.stringify(goals));
  }, [goals]);

  const handleEdit = (key) => {
    setEditingKey(key);
    setInputValue(goals[key]?.text || "");
  };

  const handleSave = () => {
    setGoals({
      ...goals,
      [editingKey]: { text: inputValue, completed: false }
    });
    setEditingKey(null);
    setInputValue("");
  };

  const handleToggle = (key) => {
    setGoals({
      ...goals,
      [key]: { ...goals[key], completed: !goals[key].completed }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Mindful Goal Tracker</h1>
        {goalTypes.map(({ key, label }) => (
          <GoalCard
            key={key}
            label={label}
            goal={goals[key]}
            onEdit={handleEdit}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {editingKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Set your goal</h2>
            <input
              className="w-full border p-2 rounded"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Your goal..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setEditingKey(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
