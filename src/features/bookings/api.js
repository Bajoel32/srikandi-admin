import { supabase } from '../../lib/supabase.js';

// RLS backend hanya mengizinkan UPDATE pada kolom-kolom ini.
const ALLOWED_UPDATE_FIELDS = ['status', 'estimated_date', 'quantity', 'preferred_payment'];

export async function fetchBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateBooking(id, patch) {
  const invalid = Object.keys(patch).filter((key) => !ALLOWED_UPDATE_FIELDS.includes(key));
  if (invalid.length > 0) {
    throw new Error(`Kolom tidak boleh diubah dari sini: ${invalid.join(', ')}`);
  }
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
