export default function BeaconTable({ beacons, selectedBeacon, onRowClick }) {
  return (
    <>
      <h1>Список маяков</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Код прибора</th>
            <th>Код MQTT</th>
          </tr>
        </thead>
        <tbody>
          {beacons.map((beacon) => (
            <tr 
            key={beacon.id} 
            onClick={() => onRowClick(beacon)}
            style={{ backgroundColor: beacon.id === selectedBeacon?.id ? '#f0f0f0' : 'transparent' }}>
              <td>{beacon.id}</td>
              <td>{beacon.id_device}</td>
              <td>{beacon.id_mqtt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}