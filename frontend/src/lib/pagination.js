export function extractPaginatedData(response) {
  const payload = response?.data;
  if (Array.isArray(payload)) {
    return { data: payload, pagination: null };
  }
  if (payload?.data && Array.isArray(payload.data)) {
    return { data: payload.data, pagination: payload.pagination };
  }
  return { data: [], pagination: null };
}
