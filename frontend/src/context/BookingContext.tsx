import React, { createContext, useContext, useState } from 'react';
import type { Worker, Booking } from '../types';

interface BookingDraft {
  worker: Worker | null;
  serviceType: string;
  bookingDate: string;
  timeSlot: string;
  problemDescription: string;
  customerAddress: string;
  city: string;
}

interface BookingContextType {
  draft: BookingDraft;
  setDraft: React.Dispatch<React.SetStateAction<BookingDraft>>;
  latestBooking: Booking | null;
  setLatestBooking: (b: Booking | null) => void;
  selectWorkerForBooking: (worker: Worker) => void;
}

const DEFAULT_DRAFT: BookingDraft = {
  worker: null,
  serviceType: 'Electrical Repair',
  bookingDate: new Date().toISOString().split('T')[0],
  timeSlot: '10:00 AM - 11:30 AM',
  problemDescription: '',
  customerAddress: 'House 42, Sector 3, Malviya Nagar, Jaipur',
  city: 'Jaipur'
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draft, setDraft] = useState<BookingDraft>(DEFAULT_DRAFT);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  const selectWorkerForBooking = (worker: Worker) => {
    setDraft((prev) => ({
      ...prev,
      worker,
      serviceType: `${worker.profession} General Service`
    }));
  };

  return (
    <BookingContext.Provider value={{ draft, setDraft, latestBooking, setLatestBooking, selectWorkerForBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
