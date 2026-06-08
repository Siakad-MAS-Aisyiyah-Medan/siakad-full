export default function FormOrangTua({ form, onChange, disabled }) {
  return (
    <div className="form-section">
      <h3>Data Orang Tua / Wali</h3>
      <div className="form-grid">
        <Field id="nama_ayah" label="Nama Ayah" form={form} onChange={onChange} disabled={disabled} />
        <Field id="pekerjaan_ayah" label="Pekerjaan Ayah" form={form} onChange={onChange} disabled={disabled} />
        <Field id="nama_ibu" label="Nama Ibu" form={form} onChange={onChange} disabled={disabled} />
        <Field id="pekerjaan_ibu" label="Pekerjaan Ibu" form={form} onChange={onChange} disabled={disabled} />
        <Field id="no_hp_ortu" label="No. HP Orang Tua" form={form} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}

function Field({ id, label, form, onChange, disabled }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input type="text" id={id} value={form[id] || ''} onChange={onChange} disabled={disabled} required />
    </div>
  );
}
