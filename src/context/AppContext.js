import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import packsService from '../services/packs';
import { mockUsers, mockPermissions, mockStats, mockAnalytics } from '../data/mockData';

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
  SET_PACKS: 'SET_PACKS',
  UPDATE_PACK: 'UPDATE_PACK',
  DELETE_PACK: 'DELETE_PACK',
  TOGGLE_PACK_POPULAR: 'TOGGLE_PACK_POPULAR',
  // Permissions
  ADD_PERMISSION: 'ADD_PERMISSION',
  UPDATE_PERMISSION: 'UPDATE_PERMISSION',
  DELETE_PERMISSION: 'DELETE_PERMISSION',
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
  ,
  // Auto-updater
  UPDATE_CHECKING: 'UPDATE_CHECKING',
  UPDATE_AVAILABLE: 'UPDATE_AVAILABLE',
  UPDATE_NOT_AVAILABLE: 'UPDATE_NOT_AVAILABLE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  UPDATE_DOWNLOADED: 'UPDATE_DOWNLOADED',
  UPDATE_ERROR: 'UPDATE_ERROR',
  SET_APP_VERSION: 'SET_APP_VERSION'
};

// Initial state
const persistedTheme = typeof window !== 'undefined' ? localStorage.getItem('app_theme') : null;

const initialState = {
  currentView: 'dashboard',
  // Authentication
  isAuthenticated: false,
  currentUser: null,
  sidebarCollapsed: false,
  users: mockUsers,
  packs: [],
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
    theme: persistedTheme || 'light'
  }
  ,
  // Global update state available to the whole app
  update: {
    status: 'idle', // idle, checking, available, downloading, downloaded, installing, error
    version: null,
    progress: 0,
    speed: 0,
    transferred: 0,
    total: 0,
    error: null,
    appVersion: null
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
      if (!action.payload || action.payload.id == null) return state;
      return {
        ...state,
        users: state.users.map(user =>
          user && user.id === action.payload.id ? { ...user, ...action.payload } : user
        )
      };
    
    case ACTION_TYPES.DELETE_USER:
      if (action.payload == null) return state;
      return {
        ...state,
        users: state.users.filter(user => user && user.id !== action.payload)
      };
    
    case ACTION_TYPES.ADD_PACK:
      return {
        ...state,
        packs: [...state.packs, { id: Date.now(), ...action.payload }]
      };

    case ACTION_TYPES.SET_PACKS:
      return { ...state, packs: Array.isArray(action.payload) ? action.payload : state.packs };
    
    case ACTION_TYPES.UPDATE_PACK:
      if (!action.payload || action.payload.id == null) return state;
      return {
        ...state,
        packs: state.packs.map(pack =>
          pack && pack.id === action.payload.id ? { ...pack, ...action.payload } : pack
        )
      };
    
    case ACTION_TYPES.DELETE_PACK:
      if (action.payload == null) return state;
      return {
        ...state,
        packs: state.packs.filter(pack => pack && pack.id !== action.payload)
      };
    
    case ACTION_TYPES.TOGGLE_PACK_POPULAR:
      return {
        ...state,
        packs: state.packs.map(pack => (
          pack ? { ...pack, popular: pack.id === action.payload ? !pack.popular : false } : pack
        ))
      };
    
    case ACTION_TYPES.ADD_PERMISSION:
      return {
        ...state,
        permissions: [...state.permissions, { id: `permission_${Date.now()}`, ...action.payload }]
      };
    
    case ACTION_TYPES.UPDATE_PERMISSION:
      if (!action.payload || action.payload.id == null) return state;
      return {
        ...state,
        permissions: state.permissions.map(permission =>
          permission && permission.id === action.payload.id ? { ...permission, ...action.payload } : permission
        )
      };
    
    case ACTION_TYPES.DELETE_PERMISSION:
      if (action.payload == null) return state;
      return {
        ...state,
        permissions: state.permissions.filter(permission => permission && permission.id !== action.payload)
      };
    
    case ACTION_TYPES.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case ACTION_TYPES.UPDATE_CHECKING:
      return { ...state, update: { ...state.update, status: 'checking', error: null } };

    case ACTION_TYPES.UPDATE_AVAILABLE:
      return { ...state, update: { ...state.update, status: 'available', version: action.payload } };

    case ACTION_TYPES.UPDATE_NOT_AVAILABLE:
      return { ...state, update: { ...state.update, status: 'idle', version: null, progress: 0 } };

    case ACTION_TYPES.UPDATE_PROGRESS:
      return { ...state, update: { ...state.update, status: 'downloading', progress: action.payload.percent ? Math.round(action.payload.percent) : state.update.progress, speed: action.payload.bytesPerSecond || 0, transferred: action.payload.transferred || 0, total: action.payload.total || 0 } };

    case ACTION_TYPES.UPDATE_DOWNLOADED:
      return { ...state, update: { ...state.update, status: 'downloaded', version: action.payload } };

    case ACTION_TYPES.UPDATE_ERROR:
      return { ...state, update: { ...state.update, status: 'error', error: action.payload } };

    case ACTION_TYPES.SET_APP_VERSION:
      return { ...state, update: { ...state.update, appVersion: action.payload } };
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Register electron auto-updater event listeners so the whole app knows about updates
  useEffect(() => {
    if (!window || !window.electronAPI) return;

    // Helper wrappers to dispatch actions
    const onChecking = () => dispatch({ type: ACTION_TYPES.UPDATE_CHECKING });
    const onAvailable = (info) => dispatch({ type: ACTION_TYPES.UPDATE_AVAILABLE, payload: info && info.version ? info.version : null });
    const onNotAvailable = () => dispatch({ type: ACTION_TYPES.UPDATE_NOT_AVAILABLE });
    const onProgress = (progress) => dispatch({ type: ACTION_TYPES.UPDATE_PROGRESS, payload: progress });
    const onDownloaded = (info) => dispatch({ type: ACTION_TYPES.UPDATE_DOWNLOADED, payload: info && info.version ? info.version : null });
    const onError = (error) => dispatch({ type: ACTION_TYPES.UPDATE_ERROR, payload: error && error.message ? error.message : (error || 'Update error') });

    // Register
    window.electronAPI.onUpdateChecking(onChecking);
    window.electronAPI.onUpdateAvailable(onAvailable);
    window.electronAPI.onUpdateNotAvailable(onNotAvailable);
    window.electronAPI.onDownloadProgress(onProgress);
    window.electronAPI.onUpdateDownloaded(onDownloaded);
    window.electronAPI.onUpdateError(onError);

    // Also fetch app version if available
    try {
      window.electronAPI.getVersion().then(v => dispatch({ type: ACTION_TYPES.SET_APP_VERSION, payload: v })).catch(() => {});
    } catch (e) {}

    return () => {
      try {
        window.electronAPI.removeAllListeners && window.electronAPI.removeAllListeners('update-checking');
        window.electronAPI.removeAllListeners && window.electronAPI.removeAllListeners('update-available');
        window.electronAPI.removeAllListeners && window.electronAPI.removeAllListeners('update-not-available');
        window.electronAPI.removeAllListeners && window.electronAPI.removeAllListeners('download-progress');
        window.electronAPI.removeAllListeners && window.electronAPI.removeAllListeners('update-downloaded');
        window.electronAPI.removeAllListeners && window.electronAPI.removeAllListeners('update-error');
      } catch (e) {}
    };
  }, []);

  // no session restore - using mock login locally

  const value = {
    state,
    dispatch,
    actions: {
      // Auth actions
      login: (user) => dispatch({ type: ACTION_TYPES.LOGIN, payload: user }),
  logout: () => { dispatch({ type: ACTION_TYPES.LOGOUT }); },
      setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
      setCurrentView: (view) => dispatch({ type: ACTION_TYPES.SET_CURRENT_VIEW, payload: view }),
      setSidebarCollapsed: (collapsed) => dispatch({ type: ACTION_TYPES.SET_SIDEBAR_COLLAPSED, payload: collapsed }),
      addUser: (user) => dispatch({ type: ACTION_TYPES.ADD_USER, payload: user }),
      updateUser: (user) => dispatch({ type: ACTION_TYPES.UPDATE_USER, payload: user }),
      deleteUser: (userId) => dispatch({ type: ACTION_TYPES.DELETE_USER, payload: userId }),
      addPack: (pack) => dispatch({ type: ACTION_TYPES.ADD_PACK, payload: pack }),
      updatePack: (pack) => dispatch({ type: ACTION_TYPES.UPDATE_PACK, payload: pack }),
      deletePack: (packId) => dispatch({ type: ACTION_TYPES.DELETE_PACK, payload: packId }),
      // Async pack actions (backend)
      fetchPacks: async () => {
        try {
          const data = await packsService.listPacks();
            if (Array.isArray(data)) {
              dispatch({ type: ACTION_TYPES.SET_PACKS, payload: data });
            } else {
              // No packs in backend — clear packs so UI shows empty state
              dispatch({ type: ACTION_TYPES.SET_PACKS, payload: [] });
            }
        } catch (e) {
            // backend error — clear packs so UI shows empty state
            dispatch({ type: ACTION_TYPES.SET_PACKS, payload: [] });
        }
      },
      createPack: async (payload) => {
        try {
          const created = await packsService.createPack(payload);
          dispatch({ type: ACTION_TYPES.ADD_PACK, payload: created });
          return created;
        } catch (e) {
          // fallback to local
          const local = { id: Date.now(), ...payload };
          dispatch({ type: ACTION_TYPES.ADD_PACK, payload: local });
          return local;
        }
      },
      savePack: async (id, payload) => {
        try {
          const updated = await packsService.updatePack(id, payload);
          // If backend returns no body (null/undefined), fall back to local merged object
          const toDispatch = (updated && updated.id != null) ? updated : { id, ...payload };
          dispatch({ type: ACTION_TYPES.UPDATE_PACK, payload: toDispatch });
          return toDispatch;
        } catch (e) {
          dispatch({ type: ACTION_TYPES.UPDATE_PACK, payload: { id, ...payload } });
          return { id, ...payload };
        }
      },
      removePack: async (id) => {
        try {
          await packsService.deletePack(id);
          dispatch({ type: ACTION_TYPES.DELETE_PACK, payload: id });
        } catch (e) {
          dispatch({ type: ACTION_TYPES.DELETE_PACK, payload: id });
        }
      },
      togglePackPopular: (packId) => dispatch({ type: ACTION_TYPES.TOGGLE_PACK_POPULAR, payload: packId }),
      addPermission: (permission) => dispatch({ type: ACTION_TYPES.ADD_PERMISSION, payload: permission }),
      updatePermission: (permission) => dispatch({ type: ACTION_TYPES.UPDATE_PERMISSION, payload: permission }),
      deletePermission: (permissionId) => dispatch({ type: ACTION_TYPES.DELETE_PERMISSION, payload: permissionId }),
      updateSettings: (settings) => dispatch({ type: ACTION_TYPES.UPDATE_SETTINGS, payload: settings })
      ,
      // Theme helpers
      toggleTheme: () => {
        const newTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
        // persist
        try { localStorage.setItem('app_theme', newTheme); } catch (e) { /* ignore */ }
        dispatch({ type: ACTION_TYPES.UPDATE_SETTINGS, payload: { theme: newTheme } });
      }
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
