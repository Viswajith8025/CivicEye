import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const SEVERITY_COLORS = {
  Low: "#64748b",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapPicker({ lat, lng, onLocationChange, nearby = [], height = "320px" }) {
  const center = lat && lng ? [lat, lng] : [20.5937, 78.9629];
  const zoom = lat && lng ? 15 : 5;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 z-0" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onClick={onLocationChange} />
        {lat && lng && <Marker position={[lat, lng]} />}
        {nearby.map((r) =>
          r.coordinates?.lat ? (
            <CircleMarker
              key={r._id}
              center={[r.coordinates.lat, r.coordinates.lng]}
              radius={8}
              pathOptions={{ color: SEVERITY_COLORS[r.severity] || "#f59e0b", fillOpacity: 0.7 }}
            >
              <Popup>
                <strong>{r.type}</strong>
                <br />
                {r.status} · {r.severity}
              </Popup>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}

export function ReportsMap({ reports, onMarkerClick, height = "500px", center }) {
  const mapCenter = center || (reports[0]?.coordinates
    ? [reports[0].coordinates.lat, reports[0].coordinates.lng]
    : [20.5937, 78.9629]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height }}>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {reports.map((r) =>
          r.coordinates?.lat ? (
            <CircleMarker
              key={r._id}
              center={[r.coordinates.lat, r.coordinates.lng]}
              radius={10}
              pathOptions={{
                color: SEVERITY_COLORS[r.severity] || "#0d9488",
                fillColor: SEVERITY_COLORS[r.severity] || "#0d9488",
                fillOpacity: 0.75,
                weight: 2,
              }}
              eventHandlers={{ click: () => onMarkerClick?.(r) }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{r.type}</p>
                  <p className="text-slate-500">{r.location}</p>
                  <p>{r.status} · {r.severity}</p>
                  {r.upvoteCount > 0 && <p>{r.upvoteCount} supports</p>}
                </div>
              </Popup>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}

export function SingleReportMap({ lat, lng, height = "240px" }) {
  if (!lat || !lng) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height }}>
      <MapContainer center={[lat, lng]} zoom={16} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}
