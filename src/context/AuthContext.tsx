import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logoutUser } from '../firebase';
import { recordUserLogin, ADMIN_EMAIL } from '../services/firestoreService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  requireAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requireAuthModal, setRequireAuthModal] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await recordUserLogin(user);
          setUserProfile(profile);
        } catch (e) {
          console.warn('Could not sync user profile:', e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogleHandler = async (): Promise<User | null> => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        const profile = await recordUserLogin(user);
        setUserProfile(profile);
      }
      setRequireAuthModal(false);
      return user;
    } catch (error) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  const logoutHandler = async (): Promise<void> => {
    try {
      await logoutUser();
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const isAdmin = Boolean(
    currentUser?.email && 
    (currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || userProfile?.role === 'admin')
  );

  const openAuthModal = () => setRequireAuthModal(true);
  const closeAuthModal = () => setRequireAuthModal(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        loginWithGoogle: loginWithGoogleHandler,
        logout: logoutHandler,
        requireAuthModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

