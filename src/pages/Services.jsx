import ResourcePage from '../components/ResourcePage.jsx';

export default function Services() {
  return (
    <ResourcePage
      title="Layanan"
      subtitle="Jenis jasa yang tampil di storefront & dipakai chatbot (tool infoLayanan)."
      endpoint="/api/admin/services"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'icon', label: 'Ikon' },
        { key: 'name', label: 'Nama' },
        { key: 'description', label: 'Deskripsi', render: (r) => <div className="clamp">{r.description || '—'}</div> },
      ]}
      fields={[
        { name: 'name', label: 'Nama layanan', type: 'text', required: true },
        { name: 'icon', label: 'Ikon (emoji)', type: 'text', placeholder: '💍', hint: 'Maks 8 karakter.' },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
      ]}
    />
  );
}
