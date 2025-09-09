import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Shift } from '../types';

type ShiftContextType = {
  setShifts: (shifts: Shift[]) => void;
  getShift: (id: string) => Shift | undefined;
  shifts: Shift[] | null;
};

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[] | null>(null);
  const getShift = (id: string) => {
    return shifts?.find(shift => shift.id === id);
  };

  return (
    <ShiftContext.Provider value={{ getShift, setShifts, shifts }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (!context)
    throw new Error('useShift() не может быть использована без ShiftProvider');
  return context;
};
