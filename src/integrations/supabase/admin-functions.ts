
// These functions call the server-side functions to bypass Row Level Security

import { supabase } from "./client";

/**
 * Creates a new admin user bypassing RLS
 */
export async function createAdminUser(username: string, password: string) {
  // Generate a random UUID string for user_id that isn't linked to any auth.users table
  // This is because we're not using actual auth users, only admin users in a separate table
  const userId = crypto.randomUUID();
  
  try {
    const { data, error } = await supabase.functions.invoke('create_admin_user', {
      body: {
        username,
        password,
        user_id: userId,
        role: 'admin'
      }
    });
    
    if (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Exception creating admin user:", error);
    throw error;
  }
}

/**
 * Updates an admin user's password bypassing RLS
 */
export async function updateAdminPassword(adminId: string, newPassword: string) {
  try {
    const { data, error } = await supabase.functions.invoke('update_admin_password', {
      body: {
        admin_id: adminId,
        new_password: newPassword
      }
    });
    
    if (error) {
      console.error("Error updating admin password:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Exception updating admin password:", error);
    throw error;
  }
}

/**
 * Deletes an admin user bypassing RLS
 */
export async function deleteAdminUser(adminId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('delete_admin_user', {
      body: {
        admin_id: adminId
      }
    });
    
    if (error) {
      console.error("Error deleting admin user:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Exception deleting admin user:", error);
    throw error;
  }
}
