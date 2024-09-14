import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider';

import './MapComponent.css'
import '../css/tooltip-style.css'
import '../css/polyline-style.css'


const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const createCustomIcon = (color) => {
  const html = `
      <span style="
        background-color: ${color};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF;
      "></span>
    `;

  return new L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: html
  });
}

export default function MapComponent({ positions, allPositions }) {
  const zoom = 13;
  const center = [53.025937, 158.641719];

  if (allPositions !== null && allPositions?.length > 0) {
    const coloredAllPositions = allPositions.map((group) => ({
      ...group,
      color: getRandomColor()
    }))

    return (
      <>
        <MapContainer center={center} zoom={zoom}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            singleMarkerMode={false}
            maxClusterRadius={60}
            chunkedLoading
          >
            {coloredAllPositions?.map((position) => (
              <Marker
                key={position.id}
                position={[position.latitude, position.longitude]}
                icon = {createCustomIcon(position.color)}
              >
                <Popup>
                  <p>Координаты: {position.latitude}, {position.longitude} </p>
                  <p>Время: {position.date_upload}</p>
                </Popup>
                <Tooltip
                  direction="left"
                  offset={[-15, -30]}
                  opacity={0.6}
                  permanent
                  className="custom-tooltip"
                >
                  Сеанс: {position.id_seance}
                </Tooltip>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </>
    )
  }

  return (
    <MapContainer center={center} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(positions?.length > 0 && Array.isArray(positions)) && (
        <>
          <MarkerClusterGroup
            singleMarkerMode={false}
            maxClusterRadius={60}
            chunkedLoading
          >
            {positions?.map((position, index) => (
              <Marker
                key={position.id}
                position={[position.latitude, position.longitude]}
              >
                <Popup>
                  <p>Координаты: {position.latitude}, {position.longitude} </p>
                  <p>Время: {position.date_upload}</p>
                </Popup>
                {(index === 0 || index === positions.length - 1) && (
                  <Tooltip
                    direction="top"
                    offset={[-10, 0]}
                    opacity={0.9}
                    permanent
                    className="custom-tooltip"
                  >
                    {index === 0 ? 'Начальная точка' : 'Конечная точка'}
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>
          {positions.map((position, index) => {
            if (index === 0) return null;
            const prevPosition = positions[index - 1];
            return (
              <Polyline
                key={index}
                positions={[
                  [prevPosition.latitude, prevPosition.longitude],
                  [position.latitude, position.longitude]
                ]}
                className='polyline'
              />
            )
          })}
        </>
      )}

      {(positions !== null && Object.prototype.toString.call(positions) === '[object Object]') &&
        <>
          <Marker
            key={positions.id}
            position={[positions.latitude, positions.longitude]}
          >
            <Popup>
              <p>Координаты: {positions.latitude}, {positions.longitude} </p>
              <p>Время: {positions.date_upload}</p>
            </Popup>
            <Tooltip
              direction="top"
              offset={[-10, 0]}
              opacity={0.9}
              permanent
              className="custom-tooltip"
            >
              Последняя позиция
            </Tooltip>
          </Marker>
        </>
      }

      {(positions === null) &&
        <>
          <p>Позиций не найдено</p>
        </>
      }
    </MapContainer>
  )
};