import ResourcePage from '../components/ResourcePage.jsx';

const rupiah = (n) => (n == null ? '—' : 'Rp' + Number(n).toLocaleString('id-ID'));

export default function Gallery() {
  return (
    <ResourcePage
      title="Galeri"
      subtitle="Katalog yang tampil di halaman Galeri & dipakai chatbot (tool rekomendasiGaleri)."
      endpoint="/api/admin/gallery"
      columns={[
        {
          key: 'image',
          label: 'Gambar',
          render: (r) => (r.image ? <img className="thumb" src={r.image} alt="" /> : '—'),
        },
        { key: 'title', label: 'Judul' },
        { key: 'category', label: 'Kategori' },
        { key: 'price', label: 'Harga', render: (r) => rupiah(r.price) },
        { key: 'tags', label: 'Tag', render: (r) => (r.tags || []).join(', ') || '—' },
      ]}
      fields={[
        { name: 'title', label: 'Judul', type: 'text', required: true },
        { name: 'image', label: 'URL gambar', type: 'text', required: true, placeholder: 'https://…' },
        { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Cincin / Kalung / …' },
        { name: 'price', label: 'Harga (angka, rupiah)', type: 'number' },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
        {
          name: 'tags',
          label: 'Tag (pisahkan koma)',
          type: 'text',
          placeholder: 'Emas Putih, Klasik',
          deserialize: (v) => (Array.isArray(v) ? v.join(', ') : v || ''),
          serialize: (v) =>
            String(v || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
        },
      ]}
    />
  );
}
