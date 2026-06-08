/**
 * Normalisasi response API { success, message, data, meta? }
 */
export function unwrapResponse(response) {
  const body = response?.data;
  if (!body || body.success === false) {
    const err = new Error(body?.message || 'Permintaan gagal');
    err.response = response;
    throw err;
  }
  return body;
}

export function unwrapData(response) {
  return unwrapResponse(response).data;
}

/** Untuk list — kembalikan array (paginated atau tidak) */
export function unwrapList(response) {
  const body = unwrapResponse(response);
  if (Array.isArray(body.data)) {
    return body.data;
  }
  return body.data ?? [];
}

export function unwrapPaginated(response) {
  const body = unwrapResponse(response);
  return {
    items: body.data ?? [],
    meta: body.meta ?? null,
  };
}
