'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createProfile(formData: { full_name: string, email: string, role: 'admin' | 'user' }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: crypto.randomUUID(), // In a real app, this would be the Auth ID
        ...formData
      }])
      .select();

    if (error) throw error;
    revalidatePath('/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProfile(id: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
