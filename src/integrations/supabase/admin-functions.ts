
// These functions call the server-side RPC functions to bypass Row Level Security

import { supabase } from "./client";

/**
 * Creates a new admin user bypassing RLS
 */
export async function createAdminUser(username: string, password: string) {
  const userId = crypto.randomUUID();
  
  const { data, error } = await supabase.rpc('create_admin_user', {
    p_username: username,
    p_password: password,
    p_user_id: userId,
    p_role: 'admin'
  });
  
  if (error) throw error;
  return data;
}

/**
 * Updates an admin user's password bypassing RLS
 */
export async function updateAdminPassword(adminId: string, newPassword: string) {
  const { data, error } = await supabase.rpc('update_admin_password', {
    p_admin_id: adminId,
    p_new_password: newPassword
  });
  
  if (error) throw error;
  return data;
}

/**
 * Deletes an admin user bypassing RLS
 */
export async function deleteAdminUser(adminId: string) {
  const { data, error } = await supabase.rpc('delete_admin_user', {
    p_admin_id: adminId
  });
  
  if (error) throw error;
  return data;
}
