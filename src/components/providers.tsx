'use client';

import { createContext, useContext, ReactNode } from 'react';
import { createClientComponentClient } from '@/lib/supabase';

interface AppContextType {
  supabase: ReturnType<typeof createClientComponentClient>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const supabase = createClientComponentClient();

  return (
    <AppContext.Provider value={{ supabase }}>
      {children}
    </AppContext.Provider>
  );
}
