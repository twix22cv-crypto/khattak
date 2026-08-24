/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { SubscriberPortal } from './components/subscriber/SubscriberPortal';
import { GeneratorCalculator } from './components/calculator/GeneratorCalculator';
import { NotificationToast } from './components/common/NotificationToast';

const MainContent: React.FC = () => {
  const { role } = useApp();

  return (
    <main className="min-h-[calc(100vh-4rem)] pb-12">
      {role === 'owner' && <OwnerDashboard />}
      {role === 'subscriber' && <SubscriberPortal />}
      {role === 'calculator' && <GeneratorCalculator />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#040710] text-slate-300 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
        <Header />
        <MainContent />
        <NotificationToast />
      </div>
    </AppProvider>
  );
}
