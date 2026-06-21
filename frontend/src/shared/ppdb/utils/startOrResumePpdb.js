import { startPendaftaran } from '@/shared/services/ppdb.service';
import { stepIndexFromCurrentStep } from '../config/ppdbWizardConfig';
import { extractApiError } from '../hooks/usePpdbWizard';

export const PATH_FORMULIR_PPDB = '/ppdb/registrasi';
export const PATH_STATUS_PPDB = '/calon-murid/status';

const EDITABLE_STATUSES = ['draft', 'revision', 'revisi'];

/**
 * Algoritma tombol "Mulai Pendaftaran":
 * POST /ppdb/start → buat draft baru ATAU lanjutkan draft → redirect formulir step 1..n
 *
 * @returns {Promise<{ ok: true, path: string, data: object, created: boolean, stepIndex: number } | { ok: false, error: string }>}
 */
export async function startOrResumePpdb() {
  try {
    const data = await startPendaftaran();
    const status = data?.status_pendaftaran || data?.status || 'draft';

    if (!EDITABLE_STATUSES.includes(status)) {
      return {
        ok: true,
        path: PATH_STATUS_PPDB,
        data,
        created: false,
        stepIndex: 0,
      };
    }

    const stepIndex =
      typeof data?.current_step_index === 'number'
        ? Math.max(0, data.current_step_index - 1)
        : stepIndexFromCurrentStep(data?.current_step_key || data?.current_step);

    return {
      ok: true,
      path: data?.redirect_path || PATH_FORMULIR_PPDB,
      data,
      created: Boolean(data?.created),
      resumed: Boolean(data?.resumed),
      stepIndex,
    };
  } catch (err) {
    return {
      ok: false,
      error: extractApiError(err),
    };
  }
}

