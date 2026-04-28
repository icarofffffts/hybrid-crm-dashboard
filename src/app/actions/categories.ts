'use server';
import { supabase } from '@/lib/supabase';

export async function createCategory(name: string) {
  try {
    const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
