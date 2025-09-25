import { MapContainer, TileLayer, Polygon, Circle, Polyline } from "react-leaflet";
import React, { useMemo } from "react";

interface Point {
  lat: number;
  lon: number;
  radius: number;
}

interface VPoint { lat: number; lon: number; radius: number } // radius: meters

// --- helpers: WebMercator <-> lat/lon (meters) ---
const R = 6378137;
function toMeters(lat: number, lon: number) {
  const x = (lon * Math.PI) / 180;
  const y = (lat * Math.PI) / 180;
  return {
    x: R * x,
    y: R * Math.log(Math.tan(Math.PI / 4 + y / 2)),
  };
}
function toLatLng(x: number, y: number) {
  const lon = (x / R) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
  return { lat, lon };
}

// --- hình học: tiếp tuyến ngoài chung của 2 đường tròn ---
interface Pt { x: number; y: number }
interface TangentPair { p1: Pt; p2: Pt } // điểm tiếp xúc trên (circle1, circle2)

function externalTangents(c1: Pt, r1: number, c2: Pt, r2: number): TangentPair[] {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const D2 = dx * dx + dy * dy;
  const D = Math.sqrt(D2);

  // Không có tiếp tuyến ngoài nếu một tròn nằm trong tròn kia
  if (D === 0 || D < Math.abs(r2 - r1))
    return [];

  // trục tâm-tâm (đơn vị) và vectơ vuông góc
  const ux = dx / D;
  const uy = dy / D;
  const px = -uy;
  const py = ux;

  // với tiếp tuyến ngoài: n·u = (r2 - r1)/D
  const k = (r2 - r1) / D;
  // h = sqrt(1 - k^2) (kẹp sai số)
  const h2 = Math.max(0, 1 - k * k);
  const h = Math.sqrt(h2);

  const pairs: TangentPair[] = [];
  for (const s of [+1, -1]) {
    // n là PHÁP TUYẾN đơn vị của đường tiếp tuyến
    const nx = ux * k + s * px * h;
    const ny = uy * k + s * py * h;

    // Điểm tiếp xúc là điểm gần đường thẳng: c - r * n
    const p1: Pt = { x: c1.x - r1 * nx, y: c1.y - r1 * ny };
    const p2: Pt = { x: c2.x - r2 * nx, y: c2.y - r2 * ny };

    pairs.push({ p1, p2 });
  }
  return pairs;
}

interface Props {
  points: VPoint[]; // theo thứ tự dọc polyline
  color?: string;
  fillOpacity?: number;
  showEdges?: boolean; // bật để debug hai tiếp tuyến
}

export const VariableRadiusEnvelope: React.FC<Props> = ({
  points,
  color = "#FF6A0088",
  fillOpacity = 0.4,
  showEdges = false,
}) => {
  const strips = useMemo(() => {
    const quads: Array<Array<[number, number]>> = [];
    for (let i = 0; i + 1 < points.length; i++) {
      const a = points[i];
      const b = points[i + 1];
      // bỏ qua khi hai tâm trùng
      if (a.lat === b.lat && a.lon === b.lon)
        continue;

      const c1 = toMeters(a.lat, a.lon);
      const c2 = toMeters(b.lat, b.lon);
      const pairs = externalTangents({ x: c1.x, y: c1.y }, a.radius, { x: c2.x, y: c2.y }, b.radius);
      if (pairs.length !== 2)
        continue;

      // tạo tứ giác: p1a -> p2a -> p2b -> p1b
      const [A, B] = pairs; // hai tiếp tuyến ngoài
      const quad = [A.p1, A.p2, B.p2, B.p1].map((p) => {
        const { lat, lon } = toLatLng(p.x, p.y);
        return [lat, lon] as [number, number];
      });
      quads.push(quad);
    }
    return quads;
  }, [points]);

  return (
    <>
      {/* các “dải” tiếp tuyến nối giữa hai vòng tròn */}
      {strips.map((latlngs, idx) => (
        <Polygon
          key={`strip-${idx}`}
          positions={latlngs}
          pathOptions={{ color, fillColor: color, fillOpacity, weight: 1, opacity: 1 }}
        />
      ))}

      {/* các vòng tròn */}
      {points.map((p, i) =>
        p.radius > 0
          ? (
              <Circle
                key={`c-${i}`}
                center={[p.lat, p.lon]}
                radius={p.radius * 0.95}
                pathOptions={{ color, fillColor: color, fillOpacity, weight: 1, opacity: 1 }}
              />
            )
          : null,
      )}

      {/* optional: vẽ 2 cạnh tiếp tuyến để kiểm tra */}
      {showEdges
        && strips.map((quad, i) => {
          const [p1, p2, p3, p4] = quad;
          return (
            <React.Fragment key={`edge-${i}`}>
              <Polyline positions={[p1, p2]} pathOptions={{ color: "#000", weight: 2, opacity: 0.8 }} />
              <Polyline positions={[p4, p3]} pathOptions={{ color: "#000", weight: 2, opacity: 0.8 }} />
            </React.Fragment>
          );
        })}
    </>
  );
};

export default function Demo() {
  const samplePoints: Point[] = useMemo(() => [
    { lat: 16, lon: 108.8, radius: 0 }, // Điểm đầu tiên có radius = 0
    { lat: 16.5, lon: 108.8, radius: 10000 }, // 2km radius
    { lat: 17, lon: 108.4, radius: 20000 }, // 4km radius
    { lat: 17.5, lon: 108.5, radius: 30000 }, // 6km radius
  ], []);

  return (
    <MapContainer
      center={[16.3, 108.7]}
      zoom={8}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <VariableRadiusEnvelope
        points={samplePoints}
        fillOpacity={1}
      />

    </MapContainer>
  );
}
