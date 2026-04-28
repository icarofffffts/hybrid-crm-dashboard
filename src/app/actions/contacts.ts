'use server';
import { supabase } from '@/lib/supabase';

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function createContact(formData: {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  job_title?: string;
  city?: string;
  how_met?: string;
  date_met?: string;
  category_id?: string;
  level?: string;
  instagram?: string;
  linkedin?: string;
  birthday?: string;
  personal_notes?: string;
  introduced_by?: string;
  custom_fields?: any;
}) {
  try {
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          job_title: formData.job_title,
          city: formData.city,
          how_met: formData.how_met,
          date_met: formData.date_met || null,
          category_id: formData.category_id || null,
          level: formData.level || 'C',
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          birthday: formData.birthday || null,
          personal_notes: formData.personal_notes,
          introduced_by: formData.introduced_by,
          custom_fields: formData.custom_fields || {},
        },
      ])
      .select()
      .single();

    if (contactError) throw contactError;

    // Trigger n8n Scan (Optional)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl && contact) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_id: contact.id, type: 'new_registration' })
      }).catch(err => console.error('n8n trigger error:', err));
    }

    return { success: true, contact };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return { success: false, error: error.message };
  }
}

export async function updateContact(id: string, formData: any) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(formData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteContact(id: string) {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
