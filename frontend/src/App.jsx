import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Plus, Award, Zap, User } from 'lucide-react';

export default function EnhancedLeaderboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [points, setPoints] = useState(null);
  const [newUser, setNewUser] = useState('');

  // Use a base URL that can change depending on the environment (local vs. production)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/leaderboard`);
      setLeaderboard(res.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/claim`, {
        userId: selectedUser,
      });
      setPoints(res.data.points);
      fetchLeaderboard();
    } catch (error) {
      console.error("Error claiming points:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/users`, { name: newUser });
      setNewUser('');
      fetchUsers();
      fetchLeaderboard();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h1 className="text-3xl font-bold text-white text-center">Leaderboard</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative inline-block w-full sm:w-64">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select a User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-5 w-5" />
              </div>
            </div>
            <button
              onClick={handleClaimPoints}
              className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2" />
                Claim Points
              </span>
            </button>
          </div>

          {points !== null && (
            <p className="text-center text-lg font-semibold text-green-600 mb-4">
              Points awarded: {points}
            </p>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Add User</h2>
            <div className="flex">
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="flex-grow mr-2 shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter user name"
              />
              <button
                onClick={handleAddUser}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add User
                </span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h2>
            <ul className="divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <li key={user._id} className="py-4 flex items-center hover:bg-gray-50 transition-colors duration-150 ease-in-out rounded-lg px-2">
                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center mr-4">
                    {index < 3 ? (
                      <Award className={`h-6 w-6 ${index === 0 ? 'text-yellow-300' : index === 1 ? 'text-gray-300' : 'text-yellow-600'}`} />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </span>
                  <div className="flex-grow">
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.totalPoints} points</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Rank {index + 1}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
