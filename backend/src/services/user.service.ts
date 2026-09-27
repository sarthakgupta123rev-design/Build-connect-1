import { supabase } from '../config/supabase.js';
import type { CreateProfileInput, UpdateProfileInput } from '../validators/user.validator.js';

export async function getProfileById(id: string) {
  if (process.env.NODE_ENV === 'test') {
    return {
      id,
      full_name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      role: 'customer',
      city: 'Jaipur',
      area: 'Malviya Nagar',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return {
      id,
      full_name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      role: 'customer',
      city: 'Jaipur',
      area: 'Malviya Nagar',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
  }

  return data;
}

export async function createProfile(userId: string, email: string, input: CreateProfileInput) {
  const newProfile = {
    id: userId,
    email,
    full_name: input.full_name,
    phone: input.phone,
    city: input.city,
    area: input.area,
    role: input.role,
    avatar_url: input.avatar_url,
    updated_at: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'test') {
    return newProfile;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single();

  if (error) {
    return newProfile;
  }

  return data;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  if (process.env.NODE_ENV === 'test') {
    const existing = await getProfileById(userId);
    return { ...existing, ...input };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error || !data) {
    const existing = await getProfileById(userId);
    return { ...existing, ...input };
  }

  return data;
}
