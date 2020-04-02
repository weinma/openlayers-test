import React, { useState, useEffect } from 'react'
import './App.css'
import '@material-ui/core/styles/'
import MapView from './map/MapView'
import OSMLayer from './layers/OSMLayer'
import MilSymbolLayer from './layers/MilSymbolLayer/index'
import symbolGeojson from './symbols.json'

import Avatar from '@material-ui/core/Avatar'
import AssignmentIcon from '@material-ui/icons/Assignment'

function App() {
  return (
    <div id="App" className="App">
      <div id="popup">
        <Avatar variant="rounded">
          <AssignmentIcon />
        </Avatar>
    </div>

      <MapView
        className="Map"
        initialView={{ center: [16.37, 48.2], zoom: 7 }}
      //        projectionId="EPSG:32632"
      >
        <OSMLayer />
        <MilSymbolLayer geojson={symbolGeojson} config={{ fillOpacity: 0.5 }} />
      </MapView>
    </div>
  )
}

export default App
