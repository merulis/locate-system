import MapComponent from "./MapComponent"
import { useEffect, useState } from 'react';
import AdminService from '../../services/AdminService';
import MapService from "../../services/MapService.js";
import Selection from './Selection.jsx';

import './MapComponent.css';


function Map() {
  const [showSelect, setShowSelect] = useState(false);
  const [seances, setSeances] = useState([]);
  const [lastPosition, setLastPosition] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [allPosition, setAllPosition] = useState([])

  async function getSeanses() {
    try {
      const response = await AdminService.get_seances()
      setSeances(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  async function fetchPosition() {
    try {
      const response = await MapService.get_position_for_current_user()
      setAllPosition([])
      setLastPosition(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchAllLastPosition() {
    try {
      const response = await MapService.get_all_last_position()
      setSelectedPositions([])
      setAllPosition(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSeanses()
    fetchPosition()

    const position_interval = setInterval(fetchPosition, 60 * 1000);
    return () => clearInterval(position_interval)
  }, [])


  async function fetchPositionBySelect(seance) {
    try {
      const response = await MapService.get_positions_by_select(seance)
      if (response.status == 200) {
        setSelectedPositions(response.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <section>
        {(selectedPositions?.length > 0) ? (
          <MapComponent
            center={[selectedPositions[0].latitude, selectedPositions[0].longitude]}
            zoom={13}
            positions={selectedPositions} />
        ) : (allPosition?.length > 0) ? (
          <MapComponent
            center={[51.505, -0.09]}
            zoom={13}
            allPositions={allPosition}
            />
        ) : (
          <MapComponent
            center={[51.505, -0.09]}
            zoom={13}
            positions={lastPosition} />
        )}
      </section>

      <section className="flex-box">
        <button
          className="register-button"
          onClick={() => setShowSelect(true)}
        >
          Выборка
        </button>
        <button
          className="register-button"
          onClick={() => fetchAllLastPosition()}
        >
          Последние позиции всех пользователей
        </button>
      </section>

      {showSelect &&
        <section>
          <Selection
            seances={seances}
            fetchPositionBySelect={fetchPositionBySelect}
            setShow={setShowSelect} />
        </section>
      }
    </>
  )
}

export default Map