import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserSettings {
  profile: {
    displayName: string;
    bio: string;
    profileImageUrl?: string;
  };
  notifications: {
    taskReminders: boolean;
    weeklySummary: boolean;
    overdueTasks: boolean;
    desktopNotifications: boolean;
    taskCompletionAlerts: boolean;
  };
  privacy: {
    privateMode: boolean;
    allowAnalytics: boolean;
  };
  appearance: {
    backgroundColor: string;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    displayName: '',
    bio: '',
  },
  notifications: {
    taskReminders: false,
    weeklySummary: false,
    overdueTasks: false,
    desktopNotifications: false,
    taskCompletionAlerts: false,
  },
  privacy: {
    privateMode: false,
    allowAnalytics: true,
  },
  appearance: {
    backgroundColor: '#ffffff',
  },
};

// Get user settings from Firebase
export const getUserSettings = async (userID: string): Promise<UserSettings> => {
  try {
    const settingsRef = doc(db, 'users', userID, 'settings', 'preferences');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data() as UserSettings;
      // Merge with defaults in case new settings were added
      return {
        ...DEFAULT_SETTINGS,
        ...data,
        profile: { ...DEFAULT_SETTINGS.profile, ...data.profile },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...data.notifications },
        privacy: { ...DEFAULT_SETTINGS.privacy, ...data.privacy },
        appearance: { ...DEFAULT_SETTINGS.appearance, ...data.appearance },
      };
    } else {
      // Create default settings if they don't exist
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error getting user settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Save user settings to Firebase
export const saveUserSettings = async (userID: string, settings: Partial<UserSettings>) => {
  try {
    const settingsRef = doc(db, 'users', userID, 'settings', 'preferences');
    await updateDoc(settingsRef, settings);
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

// Hook for using settings in React components
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export const useUserSettings = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      if (currentUser?.uid) {
        const userSettings = await getUserSettings(currentUser.uid);
        setSettings(userSettings);
      }
      setLoading(false);
    };

    loadSettings();
  }, [currentUser]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!currentUser?.uid) return false;
    
    const success = await saveUserSettings(currentUser.uid, newSettings);
    if (success) {
      setSettings(prev => ({
        ...prev,
        ...newSettings,
        profile: { ...prev.profile, ...newSettings.profile },
        notifications: { ...prev.notifications, ...newSettings.notifications },
        privacy: { ...prev.privacy, ...newSettings.privacy },
        appearance: { ...prev.appearance, ...newSettings.appearance },
      }));
    }
    return success;
  };

  return {
    settings,
    loading,
    updateSettings,
    updateProfile: (profile: UserSettings['profile']) => updateSettings({ profile }),
    updateNotifications: (notifications: UserSettings['notifications']) => updateSettings({ notifications }),
    updatePrivacy: (privacy: UserSettings['privacy']) => updateSettings({ privacy }),
    updateAppearance: (appearance: UserSettings['appearance']) => updateSettings({ appearance }),
  };
};