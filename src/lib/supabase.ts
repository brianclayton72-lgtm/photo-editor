import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateSubscriptionStatus = async (userId: string, status: string, endDate?: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      subscription_status: status,
      subscription_end_date: endDate 
    })
    .eq('id', userId);
  return { data, error };
};

export const saveEditHistory = async (userId: string, imageName: string, operations: string[]) => {
  const { data, error } = await supabase
    .from('edit_history')
    .insert({
      user_id: userId,
      image_name: imageName,
      operations: operations
    });
  return { data, error };
};

export const getEditHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('edit_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  return { data, error };
};