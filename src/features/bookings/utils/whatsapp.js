// Buang spasi, "-", dan "+", lalu ganti awalan 0 dengan 62.
export function normalizePhoneNumber(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/[\s\-+]/g, '').replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  return digits;
}

export function buildWhatsAppMessage({ customerName, serviceName }) {
  const nama = customerName || 'Pelanggan';
  const layanan = serviceName || 'booking';
  return `Halo Kak ${nama}, kami dari Toko Srikandi terkait booking ${layanan} Anda. Ada yang bisa kami bantu?`;
}

export function buildWhatsAppUrl({ phoneNumber, customerName, serviceName }) {
  const phone = normalizePhoneNumber(phoneNumber);
  const text = buildWhatsAppMessage({ customerName, serviceName });
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
