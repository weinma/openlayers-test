import React from 'react'
import './App.css'
import MapView from './MapView'
import OSMLayer from './OSMLayer'

function App() {
  return (
    <div className="App">
      <MapView
        className="Map"
        initialView={{ center: [16.37, 48.2], zoom: 7 }}
        projectionId="EPSG:32632">
          <OSMLayer />
      </MapView>
    </div>
  )
}

export default App
