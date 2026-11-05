/**
 * SmartAssess AI: Auth Router
 * Coordinates separate views for:
 * 1. Landing Page (Informational showcase)
 * 2. Dedicated Login Page (Separate page)
 * 3. Dedicated Create Account Page (Separate page with institution selector)
 */

import React, { useState } from 'react';
import { LandingPage } from './LandingPage.tsx';
import { LoginPage } from './LoginPage.tsx';
import { CreateAccountPage } from './CreateAccountPage.tsx';

type AuthViewMode = 'landing' | 'login' | 'signup';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthViewMode>('landing');

  if (currentView === 'login') {
    return (
      <LoginPage
        onGoToSignup={() => setCurrentView('signup')}
        onGoToLanding={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <CreateAccountPage
        onGoToLogin={() => setCurrentView('login')}
        onGoToLanding={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <LandingPage
      onGoToLogin={() => setCurrentView('login')}
      onGoToSignup={() => setCurrentView('signup')}
    />
  );
};
