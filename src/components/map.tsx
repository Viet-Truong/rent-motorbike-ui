import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Position } from '@/type/shop';
import currentLocation from '@/assets/images/curentLocation.png';
import location from '@/assets/images/location.png';

interface IPositionProps {
  positions: Position[];
}

// Define custom icons
const currentLocationIcon = new L.Icon({
  iconUrl: currentLocation,
  iconSize: [32, 32],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultLocationIcon = new L.Icon({
  iconUrl: location,
  iconSize: [32, 32],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = ({ positions }: IPositionProps) => {
  const defaultCenter: [number, number] = [16.047079, 108.20623];

  const getCenter = (): [number, number] => {
    if (positions.length > 0) {
      const { lat, lng } = positions[0];
      return [lat, lng];
    }
    return defaultCenter;
  };
  return (
    <MapContainer
      center={getCenter()}
      zoom={13}
      style={{ height: '70vh', width: '100%', fontSize: '12px' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      {positions.map((position, index) => (
        <Marker
          key={index}
          position={[position.lat, position.lng] as [number, number]}
          icon={position.isCurrent ? currentLocationIcon : defaultLocationIcon}
        >
          <Popup>
            <h4>{position.isCurrent ? 'Vị trí hiện tại' : `Tên cửa hàng: ${position.name}`} </h4>
            {position.address && <p>Địa chỉ: {position.address}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
