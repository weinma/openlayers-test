import React from 'react'
import './App.css'
import MapView from './Map'

function App() {
  return (
    <div className="App">
      <MapView
        className="Map"
        initialView={{ center: [16.37, 48.2], zoom: 7 }}
        projectionId="EPSG:32632"
      />
    </div>
  )
}

export default App
