export type Profession = 
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Painter'
  | 'AC Repair'
  | 'Appliance Repair'
  | 'Skilled Helper'
  | 'Mason';

export interface Skill {
  id: string;
  name: string;
  level: 'Basic' | 'Intermediate' | 'Expert';
}

export interface Review {
  id: string;
  workerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  qualityRating: number;
  punctualityRating: number;
  professionalismRating: number;
  comment: string;
  date: string;
  verifiedBooking: boolean;
  serviceType: string;
}

export interface Worker {
  id: string;
  name: string;
  profession: Profession;
  avatar: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  completedJobs: number;
  onTimePercentage: number;
  distanceKm: number;
  city: string;
  area: string;
  hourlyRate: number;
  fixedRateMin: number;
  fixedRateMax: number;
  verified: boolean;
  trustScore: number; // 0-100 score
  availability: 'Available Today' | 'Available Tomorrow' | 'Busy';
  skills: string[];
  bio: string;
  badge?: 'Top Rated' | 'Most Experienced' | 'Fastest Arrival' | 'Best Value';
  phone?: string;
  languages: string[];
  completedReviewList?: Review[];
}

export interface AIMatchResult {
  workerId: string;
  matchScore: number; // 0 - 100%
  reasons: string[];
  worker: Worker;
}

export interface Booking {
  id: string;
  workerId: string;
  workerName: string;
  workerProfession: Profession;
  workerAvatar: string;
  workerPhone: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  serviceType: string;
  bookingDate: string;
  timeSlot: string;
  problemDescription: string;
  serviceCost: number;
  platformFee: number;
  totalCost: number;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Cash on Service';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'worker';
  city: string;
  phone: string;
  avatar?: string;
  profession?: Profession;
}

export interface FilterOptions {
  category: string;
  searchQuery: string;
  city: string;
  maxDistanceKm: number;
  minRating: number;
  maxPrice: number;
  minExperience: number;
  verifiedOnly: boolean;
  availableTodayOnly: boolean;
  sortBy: 'recommended' | 'rating' | 'distance' | 'priceAsc' | 'experience';
}

export interface WorkerEarnings {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  completedJobsCount: number;
  platformFeePaid: number;
  weeklyHistory: { day: string; amount: number }[];
}
