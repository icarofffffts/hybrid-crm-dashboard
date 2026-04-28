import UserManagementClient from '@/components/UserManagementClient';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function UsersPage() {
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return <UserManagementClient initialUsers={users || []} />;
}
