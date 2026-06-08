export default function FormBiodata({ form, onChange, disabled }) {
  return (
    <div className="form-section">
      <h3>Data Pribadi Calon Murid</h3>
      <div className="form-grid">
        <Field id="nama_lengkap" label="Nama Lengkap" form={form} onChange={onChange} disabled={disabled} full />
        <Field id="nisn" label="NISN" form={form} onChange={onChange} disabled={disabled} />
        <JenisKelaminField form={form} onChange={onChange} disabled={disabled} />
        <Field id="tempat_lahir" label="Tempat Lahir" form={form} onChange={onChange} disabled={disabled} />
        <Field id="tanggal_lahir" label="Tanggal Lahir" type="date" form={form} onChange={onChange} disabled={disabled} />
        <AgamaField form={form} onChange={onChange} disabled={disabled} />
        <AlamatField form={form} onChange={onChange} disabled={disabled} />
        <Field id="asal_sekolah" label="Asal Sekolah" form={form} onChange={onChange} disabled={disabled} />
        <Field id="tahun_lulus" label="Tahun Lulus" form={form} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}

function Field({ id, label, form, onChange, disabled, type = 'text', full }) {
  return (
    <div className={`input-group${full ? ' full' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} value={form[id] || ''} onChange={onChange} disabled={disabled} required />
    </div>
  );
}

function JenisKelaminField({ form, onChange, disabled }) {
  return (
    <div className="input-group">
      <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
      <select id="jenis_kelamin" value={form.jenis_kelamin || ''} onChange={onChange} disabled={disabled} required>
        <option value="">Pilih</option>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
    </div>
  );
}

function AgamaField({ form, onChange, disabled }) {
  return (
    <div className="input-group">
      <label htmlFor="agama">Agama</label>
      <select id="agama" value={form.agama || ''} onChange={onChange} disabled={disabled} required>
        <option value="">Pilih Agama</option>
        <option value="Islam">Islam</option>
        <option value="Kristen">Kristen</option>
        <option value="Katolik">Katolik</option>
        <option value="Hindu">Hindu</option>
        <option value="Budha">Budha</option>
      </select>
    </div>
  );
}

function AlamatField({ form, onChange, disabled }) {
  return (
    <div className="input-group full">
      <label htmlFor="alamat">Alamat</label>
      <textarea id="alamat" value={form.alamat || ''} onChange={onChange} disabled={disabled} required />
    </div>
  );
}
