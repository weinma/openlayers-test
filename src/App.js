import React, { useState, useEffect } from 'react'
import './App.css'

import MapView from './map/MapView'
import OSMLayer from './layers/OSMLayer'
import MilSymbolLayer from './layers/MilSymbolLayer'
import symbolGeojson from './symbols.json'

function App() {
  return (
    <div className="App">
      <MapView
        className="Map"
        initialView={{ center: [16.37, 48.2], zoom: 7 }}
//        projectionId="EPSG:32632"
      >
          <OSMLayer />
          <MilSymbolLayer geojson={symbolGeojson}/>
      </MapView>
    </div>
  )
}

export default App
