import FormInput from '../form/FormInput';
import FormSelect from '../form/FormSelect';
import FormTextarea from '../form/FormTextarea';
import { REVIEW_SECTIONS, STATUS_YATIM_OPTIONS } from '../../config/ppdbWizardConfig';



export function StepKeteranganPribadi({ data, onChange, disabled, errors = {} }) {
  const set = (id, v) => onChange('keteranganPribadi', id, v);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Nama Lengkap" id="nama_lengkap" value={data.nama_lengkap} onChange={set} disabled={disabled} required placeholder="Nama sesuai dokumen" error={errors.nama_lengkap} />
        <FormInput label="Tempat Lahir" id="tempat_lahir" value={data.tempat_lahir} onChange={set} disabled={disabled} required placeholder="Kota kelahiran" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Tanggal Lahir" id="tgl_lahir" type="date" value={data.tgl_lahir?.slice?.(0, 10) || data.tgl_lahir} onChange={set} disabled={disabled} required />
        <FormInput label="Agama" id="agama" value={data.agama} onChange={set} disabled={disabled} required placeholder="Contoh: Islam" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Kewarganegaraan" id="kewarganegaraan" value={data.kewarganegaraan} onChange={set} disabled={disabled} required placeholder="Contoh: Indonesia" />
        <FormInput label="Anak Ke" id="anak_ke" type="number" value={data.anak_ke} onChange={set} disabled={disabled} required placeholder="1" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Jumlah Saudara Kandung" id="jml_saudara_kandung" type="number" value={data.jml_saudara_kandung} onChange={set} disabled={disabled} required />
        <FormInput label="Jumlah Saudara Tiri" id="jml_saudara_tiri" type="number" value={data.jml_saudara_tiri} onChange={set} disabled={disabled} required />
      </div>
      <FormTextarea label="Alamat" id="alamat" value={data.alamat} onChange={set} disabled={disabled} required placeholder="Alamat lengkap tempat tinggal" className="w-full" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="No. Telp" id="no_telp" value={data.no_telp} onChange={set} disabled={disabled} required placeholder="08xxxxxxxxxx" />
        <FormSelect label="Status Yatim" id="status_yatim" value={data.status_yatim} onChange={set} options={STATUS_YATIM_OPTIONS} disabled={disabled} required />
      </div>
    </div>
  );
}

export function StepKesehatan({ data, onChange, disabled, errors = {} }) {
  const set = (id, v) => onChange('kesehatan', id, v);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormInput label="Berat Badan (kg)" id="berat_badan" type="number" value={data.berat_badan} onChange={set} disabled={disabled} required error={errors.berat_badan} />
      <FormInput label="Tinggi Badan (cm)" id="tinggi_badan" type="number" value={data.tinggi_badan} onChange={set} disabled={disabled} required error={errors.tinggi_badan} />
      <FormInput label="Gol. Darah" id="gol_darah" value={data.gol_darah} onChange={set} disabled={disabled} required placeholder="A / B / AB / O" error={errors.gol_darah} />
      <FormInput label="Penyakit Diderita" id="penyakit_diderita" value={data.penyakit_diderita} onChange={set} disabled={disabled} placeholder="Kosongkan jika tidak ada" />
      <FormInput label="Cacat Badan" id="cacat_badan" value={data.cacat_badan} onChange={set} disabled={disabled} placeholder="Kosongkan jika tidak ada" className="md:col-span-2" />
    </div>
  );
}

export function StepPendidikan({ data, onChange, disabled, errors = {} }) {
  const set = (id, v) => onChange('pendidikanAsal', id, v);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormInput label="Sekolah Asal" id="sekolah_asal" value={data.sekolah_asal} onChange={set} disabled={disabled} required error={errors.sekolah_asal} />
      <FormInput label="No. STTB" id="no_sttb" value={data.no_sttb} onChange={set} disabled={disabled} required error={errors.no_sttb} />
      <FormInput label="Pindahan Dari" id="pindahan_dari" value={data.pindahan_dari} onChange={set} disabled={disabled} />
      <FormInput label="No. Surat Pindah" id="no_surat_pindah" value={data.no_surat_pindah} onChange={set} disabled={disabled} />
    </div>
  );
}

export function StepOrtu({ data, onChange, disabled, errors = {} }) {
  const set = (id, v) => onChange('orangTuaWali', id, v);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Nama Ayah" id="nama_ayah" value={data.nama_ayah} onChange={set} disabled={disabled} required error={errors.nama_ayah} />
        <FormInput label="Nama Ibu" id="nama_ibu" value={data.nama_ibu} onChange={set} disabled={disabled} required error={errors.nama_ibu} />
        <FormInput label="Pendidikan Ayah" id="pendidikan_ayah" value={data.pendidikan_ayah} onChange={set} disabled={disabled} />
        <FormInput label="Pendidikan Ibu" id="pendidikan_ibu" value={data.pendidikan_ibu} onChange={set} disabled={disabled} />
        <FormInput label="Pekerjaan Ayah" id="pekerjaan_ayah" value={data.pekerjaan_ayah} onChange={set} disabled={disabled} />
        <FormInput label="Pekerjaan Ibu" id="pekerjaan_ibu" value={data.pekerjaan_ibu} onChange={set} disabled={disabled} />
        <FormInput label="Agama Ortu" id="agama_ortu" value={data.agama_ortu} onChange={set} disabled={disabled} />
        <FormInput label="No. HP Ortu" id="no_hp_ortu" value={data.no_hp_ortu} onChange={set} disabled={disabled} required error={errors.no_hp_ortu} />
      </div>
      <FormTextarea label="Alamat Ortu" id="alamat_ortu" value={data.alamat_ortu} onChange={set} disabled={disabled} className="w-full" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Nama Wali" id="nama_wali" value={data.nama_wali} onChange={set} disabled={disabled} />
        <FormInput label="Pendidikan Wali" id="pendidikan_wali" value={data.pendidikan_wali} onChange={set} disabled={disabled} />
        <FormInput label="Pekerjaan Wali" id="pekerjaan_wali" value={data.pekerjaan_wali} onChange={set} disabled={disabled} />
        <FormInput label="Agama Wali" id="agama_wali" value={data.agama_wali} onChange={set} disabled={disabled} />
      </div>
      <FormTextarea label="Alamat Wali" id="alamat_wali" value={data.alamat_wali} onChange={set} disabled={disabled} className="w-full" />
    </div>
  );
}

export function StepKepribadian({ data, onChange, disabled, errors = {} }) {
  const set = (id, v) => onChange('kepribadian', id, v);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormInput label="Hobi" id="hobi" value={data.hobi} onChange={set} disabled={disabled} required error={errors.hobi} />
      <FormInput label="Cita-cita" id="cita_cita" value={data.cita_cita} onChange={set} disabled={disabled} required error={errors.cita_cita} />
    </div>
  );
}

export function StepDokumen({ data, onChange, disabled, errors = {} }) {
  const set = (id, v) => onChange('dokumen', id, v);
  return (
    <div className="space-y-8">
      <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Isi path atau URL dokumen sementara. Upload file dapat ditambahkan pada tahap berikutnya.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Foto Copy Ijazah" id="foto_copy_ijazah" value={data.foto_copy_ijazah} onChange={set} disabled={disabled} />
        <FormInput label="STK Asli" id="stk_asli" value={data.stk_asli} onChange={set} disabled={disabled} />
        <FormInput label="Pas Foto" id="pas_foto" value={data.pas_foto} onChange={set} disabled={disabled} />
        <FormInput label="NISN (Dokumen)" id="nisn_dokumen" value={data.nisn_dokumen} onChange={set} disabled={disabled} />
        <FormInput label="FC Kartu Keluarga" id="fc_kartu_keluarga" value={data.fc_kartu_keluarga} onChange={set} disabled={disabled} />
        <FormInput label="FC KTP Orang Tua" id="fc_ktp_orang_tua" value={data.fc_ktp_orang_tua} onChange={set} disabled={disabled} />
      </div>
      <FormTextarea label="Catatan Tambahan" id="catatan_tambahan" value={data.catatan_tambahan} onChange={set} disabled={disabled} className="w-full" />
    </div>
  );
}

export function StepReview({ forms }) {
  return (
    <div className="space-y-6">
      {REVIEW_SECTIONS.map(({ title, section, fields }) => (
        <section key={section} className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
          <h3 className="mb-4 text-base font-bold text-emerald-900">{title}</h3>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map(([key, label]) => (
              <div key={key} className="min-w-0">
                <dt className="text-xs font-medium text-gray-500">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-gray-900 break-words">
                  {forms[section]?.[key] ?? '—'}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
