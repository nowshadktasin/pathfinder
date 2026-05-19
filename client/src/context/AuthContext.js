import React, { createContext, useState, useContext } from 'react';
import { mockShortlist } from '../services/mockData';

const AuthContext = createContext(null);

// Mock student user — used when no Firebase/backend is configured
const MOCK_USER = {
  _id: 'mock_student_001',
  email: 'student@pathfinder.dev',
  role: 'student',
  isPremium: false,
  profile: {
    firstName: 'Alex',
    lastName: 'Morgan',
    nationality: 'Bangladesh',
    dateOfBirth: '2001-03-15',
  },
  academicHistory: {
    gpa: 3.7,
    major: 'Computer Science',
    institution: 'BRAC University',
    graduationYear: 2024,
  },
  testScores: {
    ielts: 7.0,
    sat: 1380,
  },
  preferences: {
    desiredDegree: 'Masters',
    budget: 40000,
    countries: ['United States', 'Canada', 'United Kingdom'],
  },
  shortlistedUniversities: mockShortlist,
  firebaseUid: 'mock_uid',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);
  const [loading] = useState(false);

  const login = async (email, password) => {
    // Mock login — any credentials work in preview mode
    const loggedIn = { ...MOCK_USER, email };
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (userData) => {
    const newUser = {
      ...MOCK_USER,
      email: userData.email,
      role: userData.role || 'student',
      profile: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
