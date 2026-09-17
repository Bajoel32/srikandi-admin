import ResourcePage from '../components/ResourcePage.jsx';

export default function KnowledgeBase() {
  return (
    <ResourcePage
      title="Knowledge Base (RAG)"
      subtitle="Potongan pengetahuan yang diambil retriever untuk menjawab chatbot Konsultasi."
      endpoint="/api/admin/kb"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Judul' },
        { key: 'text', label: 'Isi', render: (r) => <div className="clamp">{r.text}</div> },
        { key: 'url', label: 'URL', render: (r) => (r.url ? <span className="mono">{r.url}</span> : '—') },
      ]}
      fields={[
        { name: 'title', label: 'Judul', type: 'text', required: true },
        { name: 'text', label: 'Isi', type: 'textarea', required: true, hint: 'Maks 4000 karakter. Tulis fakta ringkas & mandiri.' },
        { name: 'url', label: 'URL sumber (opsional)', type: 'text', placeholder: 'https://…' },
      ]}
    />
  );
}
