export default function SearchBox({ value, onChange }) {
  return (
    <div className="search-box">
      <span className="search-ico">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari nama atau nomor HP…"
        aria-label="Cari booking"
      />
    </div>
  );
}
