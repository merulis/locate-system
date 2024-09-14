import { useEffect, useState } from "react"
import AdminService from "../../../services/AdminService"
import BeaconTable from "./BeaconTable"
import BeaconCreate from "./BeaconCreateForm"
import BeaconDetail from "./BeaconDetails"

function BeaconPage() {
  const [beacons, setBeacons] = useState([])
  const [show, setShow] = useState(false)
  const [selectedBeacon, setSelectedBeacon] = useState(null)

  async function fetchBeacons() {
    try {
      const response = await AdminService.get_beacons()
      setBeacons(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function sendBeacon(device, mqtt) {
    try {
      const response = await AdminService.create_beacon(device, mqtt)
      if (response.status == 200) {
        fetchBeacons()
        setShow(false)
      }
    } catch (e) {
      console.log(e)
      return
    }
  }

  async function updateBeacon (beacon) {
    try {
      const response = await AdminService.update_beacon(beacon)
      if (response.status == 200) {
        fetchBeacons()
        setSelectedBeacon(null)
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteBeacon(id) {
    try {
      const response = await AdminService.delete_beacon(id)
      if (response.status == 200) {
        fetchBeacons()
        setSelectedBeacon(null)
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchBeacons()
  }, [])

  return (
    <>
      <section>
        <BeaconTable
          beacons={beacons}
          selectedBeacon={selectedBeacon}
          onRowClick={setSelectedBeacon} />
        <button onClick={() => setShow(true)}>Зарегистрировать радиомаяк</button>
      </section>

      <section>
        {show && (
          <BeaconCreate
            sendBeacon={sendBeacon}
            setShow={setShow} />
        )}
      </section>

      <section>
        {selectedBeacon && (
          <BeaconDetail
            beacon={selectedBeacon}
            updateBeacon={updateBeacon}
            deleteBeacon={deleteBeacon} />
        )}
      </section>
    </>
  )
}

export default BeaconPage