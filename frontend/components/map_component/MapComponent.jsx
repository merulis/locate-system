import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './MapComponent.css'
import { useState, useEffect } from 'react'
import MapService from '../../services/MapService';
import { useAuth } from '../auth_component/AuthProvider';


export default function MapComponent() {
  const [positions, setPositions] = useState([]);
  const zoom = 13;
  const center = [51.505, -0.09];
  const user = useAuth()

  useEffect(() => {
    async function fetchPosition() {
      try {
        const response = await MapService.get_position()
        setPositions(response.data)
      } catch (error) {
        console.log('error')
      }
    }

    fetchPosition();

    const position_interval = setInterval(fetchPosition, 60 * 1000);
    return () => clearInterval(position_interval)
  }, [user])

  if (!user.isAuth) {
    return null
  } else {
    return (
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(positions?.length > 0) ? (
          positions?.map((position) => (
            <Marker key={position.id} position={[position.latitude, position.longitude]}>
              <Popup> {position.latitude} {position.longitude}</Popup>
            </Marker>
          ))
        ) : (
          null
        )
        }
      </MapContainer>
    )
  }

};