import { updateProfile, getMe } from './auth.api';

export const profileApi = {
  getProfile: getMe,
  updateProfile: updateProfile
};
