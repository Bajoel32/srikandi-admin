import { describe, expect, it } from 'vitest';
import { buildWhatsAppMessage, buildWhatsAppUrl, normalizePhoneNumber } from './whatsapp.js';

describe('normalizePhoneNumber', () => {
  it('mengganti awalan 0 dengan 62', () => {
    expect(normalizePhoneNumber('081234567890')).toBe('6281234567890');
  });

  it('membuang spasi, strip, dan plus', () => {
    expect(normalizePhoneNumber('+62 812-3456-7890')).toBe('6281234567890');
  });

  it('membuang spasi pada nomor berawalan 0', () => {
    expect(normalizePhoneNumber('0812 3456 7890')).toBe('6281234567890');
  });

  it('membiarkan nomor yang sudah berawalan 62', () => {
    expect(normalizePhoneNumber('6281234567890')).toBe('6281234567890');
  });

  it('membuang karakter non-digit lain', () => {
    expect(normalizePhoneNumber('(0812) 3456-7890')).toBe('6281234567890');
  });

  it('mengembalikan string kosong untuk input kosong', () => {
    expect(normalizePhoneNumber('')).toBe('');
    expect(normalizePhoneNumber(null)).toBe('');
    expect(normalizePhoneNumber(undefined)).toBe('');
  });
});

describe('buildWhatsAppMessage', () => {
  it('menyertakan nama pelanggan dan nama layanan', () => {
    const msg = buildWhatsAppMessage({ customerName: 'Siti', serviceName: 'Rias Pengantin' });
    expect(msg).toContain('Siti');
    expect(msg).toContain('Rias Pengantin');
  });

  it('punya fallback saat nama atau layanan kosong', () => {
    const msg = buildWhatsAppMessage({});
    expect(msg).toContain('Pelanggan');
    expect(msg).toContain('booking');
  });
});

describe('buildWhatsAppUrl', () => {
  it('menyusun URL wa.me dengan nomor ternormalisasi dan pesan ter-encode', () => {
    const url = buildWhatsAppUrl({
      phoneNumber: '081234567890',
      customerName: 'Siti',
      serviceName: 'Rias Pengantin',
    });
    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);

    const decoded = decodeURIComponent(url.split('?text=')[1]);
    expect(decoded).toContain('Siti');
    expect(decoded).toContain('Rias Pengantin');
  });
});
