'use server';
import { supabase } from '@/lib/supabase';

export async function createContact(formData: {
  name: string;
  category: string;
  priority: string;
  email?: string;
  phone?: string;
  birthday?: string;
}) {
  try {
    // 1. Insert Contact
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert([
        {
          name: formData.name,
          category: formData.category,
          priority: formData.priority,
          email: formData.email,
          phone: formData.phone,
        },
      ])
      .select()
      .single();

    if (contactError) throw contactError;

    // 2. Insert Birthday Event if provided
    if (formData.birthday && contact) {
      const { error: eventError } = await supabase.from('events').insert([
        {
          contact_id: contact.id,
          event_type: 'aniversario',
          event_date: formData.birthday,
        },
      ]);

      if (eventError) throw eventError;
    }


    // 3. Trigger immediate n8n Scan (Optional Webhook)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    console.log('Tentando disparar n8n Webhook para:', n8nWebhookUrl);
    
    if (n8nWebhookUrl) {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_id: contact.id, type: 'new_registration' })
      });
      console.log('Status do Gatilho n8n:', response.status);
    } else {
      console.log('Sem URL de Webhook configurada no env.');
    }

    return { success: true, contact };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return { success: false, error: error.message };
  }
}
