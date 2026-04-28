'use server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function approveTask(formData: {
  taskId: string;
  contactId: string;
  channel: 'whatsapp' | 'email';
  message: string;
}) {
  try {
    // 1. Trigger n8n for Sending
    const n8nApprovalWebhook = 'https://n8n.arxsolutions.cloud/webhook/envios-hybrid';
    
    // We send to n8n first
    const n8nResponse = await fetch(n8nApprovalWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: formData.taskId,
        contactId: formData.contactId,
        channel: formData.channel,
        message: formData.message,
        timestamp: new Date().toISOString()
      })
    });

    if (!n8nResponse.ok) {
      throw new Error('Falha ao comunicar com o motor n8n');
    }

    // 2. Update Task Status in Database
    const { error: taskError } = await supabase
      .from('tasks')
      .update({ status: 'concluida', resolved_at: new Date().toISOString() })
      .eq('id', formData.taskId);

    if (taskError) throw taskError;

    // 3. Log Interaction in Timeline
    await supabase.from('interactions').insert([
      {
        contact_id: formData.contactId,
        interaction_type: 'mensagem_enviada',
        notes: `Comunicação via ${formData.channel.toUpperCase()} processada pela Secretária n8n.`,
        created_by: 'Secretária n8n'
      }
    ]);

    revalidatePath('/secretary');
    revalidatePath('/history');
    
    return { success: true };
  } catch (error: any) {
    console.error('Approval Error:', error);
    return { success: false, error: error.message };
  }
}
export async function cancelTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'cancelada', resolved_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) throw error;
    revalidatePath('/secretary');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
