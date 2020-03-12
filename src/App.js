import React from 'react'
import './App.css'

import MapView from './map/MapView'
import OSMLayer from './layers/OSMLayer'
import EditLayer from './layers/EditLayer'

function App() {
  return (
    <div className="App">
      <MapView
        className="Map"
        initialView={{ center: [16.37, 48.2], zoom: 7 }}
        projectionId="EPSG:32632">
          <OSMLayer />
          <EditLayer />
      </MapView>
    </div>
  )
}

export default App
