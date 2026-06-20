export function coordsToGeoPoint(coordinates) {
  if (!coordinates?.lat || !coordinates?.lng) return undefined;
  const lat = parseFloat(coordinates.lat);
  const lng = parseFloat(coordinates.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return undefined;
  return { type: "Point", coordinates: [lng, lat] };
}

export function syncGeoFromCoordinates(doc) {
  const geo = coordsToGeoPoint(doc.coordinates);
  if (geo) doc.geo = geo;
}
