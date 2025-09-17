import React, { createContext, useContext, useReducer } from 'react';
import { mockUsers, mockPacks, mockPermissions, mockStats, mockAnalytics } from '../data/mockData';

// Create context
const AppContext = createContext();

// Action types
const ACTION_TYPES = {
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
  // Users
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  // Packs
  ADD_PACK: 'ADD_PACK',
  UPDATE_PACK: 'UPDATE_PACK',
  DELETE_PACK: 'DELETE_PACK',
  TOGGLE_PACK_POPULAR: 'TOGGLE_PACK_POPULAR',
  // Permissions
  ADD_PERMISSION: 'ADD_PERMISSION',
  UPDATE_PERMISSION: 'UPDATE_PERMISSION',
  DELETE_PERMISSION: 'DELETE_PERMISSION',
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
};

// Initial state
const initialState = {
  currentView: 'dashboard',
  // Authentication
  isAuthenticated: false,
  currentUser: null,
  sidebarCollapsed: false,
  users: mockUsers,
  packs: mockPacks,
  permissions: mockPermissions,
  stats: mockStats,
  analytics: mockAnalytics,
  settings: {
    companyName: 'E-Commerce SAAS',
    emailNotifications: true,
    smsNotifications: false,
    autoRenewal: true,
    currency: 'USD',
    timezone: 'UTC',
    theme: 'light'
  }
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return { ...state, isAuthenticated: true, currentUser: action.payload };

    case ACTION_TYPES.LOGOUT:
      return { ...state, isAuthenticated: false, currentUser: null };

    case ACTION_TYPES.SET_USER:
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };

    case ACTION_TYPES.SET_CURRENT_VIEW:
      return { ...state, currentView: action.payload };
    
    case ACTION_TYPES.SET_SIDEBAR_COLLAPSED:
      return { ...state, sidebarCollapsed: action.payload };
    
    case ACTION_TYPES.ADD_USER:
      return {
        ...state,
        users: [...state.users, { id: Date.now(), ...action.payload }]
      };
    
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        )
      };
    
    case ACTION_TYPES.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    
    case ACTION_TYPES.ADD_PACK:
      return {
        ...state,
        packs: [...state.packs, { id: Date.now(), ...action.payload }]
      };
    
    case ACTION_TYPES.UPDATE_PACK:
      return {
        ...state,
        packs: state.packs.map(pack =>
          pack.id === action.payload.id ? { ...pack, ...action.payload } : pack
        )
      };
    
    case ACTION_TYPES.DELETE_PACK:
      return {
        ...state,
        packs: state.packs.filter(pack => pack.id !== action.payload)
      };
    
    case ACTION_TYPES.TOGGLE_PACK_POPULAR:
      return {
        ...state,
        packs: state.packs.map(pack => ({
          ...pack,
          popular: pack.id === action.payload ? !pack.popular : false
        }))
      };
    
    case ACTION_TYPES.ADD_PERMISSION:
      return {
        ...state,
        permissions: [...state.permissions, { id: `permission_${Date.now()}`, ...action.payload }]
      };
    
    case ACTION_TYPES.UPDATE_PERMISSION:
      return {
        ...state,
        permissions: state.permissions.map(permission =>
          permission.id === action.payload.id ? { ...permission, ...action.payload } : permission
        )
      };
    
    case ACTION_TYPES.DELETE_PERMISSION:
      return {
        ...state,
        permissions: state.permissions.filter(permission => permission.id !== action.payload)
      };
    
    case ACTION_TYPES.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    state,
    dispatch,
    actions: {
      // Auth actions
      login: (user) => dispatch({ type: ACTION_TYPES.LOGIN, payload: user }),
      logout: () => dispatch({ type: ACTION_TYPES.LOGOUT }),
      setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
      setCurrentView: (view) => dispatch({ type: ACTION_TYPES.SET_CURRENT_VIEW, payload: view }),
      setSidebarCollapsed: (collapsed) => dispatch({ type: ACTION_TYPES.SET_SIDEBAR_COLLAPSED, payload: collapsed }),
      addUser: (user) => dispatch({ type: ACTION_TYPES.ADD_USER, payload: user }),
      updateUser: (user) => dispatch({ type: ACTION_TYPES.UPDATE_USER, payload: user }),
      deleteUser: (userId) => dispatch({ type: ACTION_TYPES.DELETE_USER, payload: userId }),
      addPack: (pack) => dispatch({ type: ACTION_TYPES.ADD_PACK, payload: pack }),
      updatePack: (pack) => dispatch({ type: ACTION_TYPES.UPDATE_PACK, payload: pack }),
      deletePack: (packId) => dispatch({ type: ACTION_TYPES.DELETE_PACK, payload: packId }),
      togglePackPopular: (packId) => dispatch({ type: ACTION_TYPES.TOGGLE_PACK_POPULAR, payload: packId }),
      addPermission: (permission) => dispatch({ type: ACTION_TYPES.ADD_PERMISSION, payload: permission }),
      updatePermission: (permission) => dispatch({ type: ACTION_TYPES.UPDATE_PERMISSION, payload: permission }),
      deletePermission: (permissionId) => dispatch({ type: ACTION_TYPES.DELETE_PERMISSION, payload: permissionId }),
      updateSettings: (settings) => dispatch({ type: ACTION_TYPES.UPDATE_SETTINGS, payload: settings })
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
