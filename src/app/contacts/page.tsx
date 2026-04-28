import ContactListClient from '@/components/ContactListClient';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function ContactsPage() {
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*, categories(name)')
    .order('level', { ascending: true }); 

  return <ContactListClient initialContacts={contacts || []} />;
}
