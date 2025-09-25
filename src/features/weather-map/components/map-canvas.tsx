import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function MapCanvas() {
  return (
    <TileLayer
      url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
      attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      subdomains={["mt0", "mt1", "mt2", "mt3"]}
    />
  );
}
