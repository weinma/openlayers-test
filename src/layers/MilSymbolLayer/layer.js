import React, { useEffect, useState } from "react"

import Overlay from 'ol/Overlay'
import { clone } from 'ol/extent'

import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'

import styleFunction from './style'
import createSource from './source'

const DEFAULT_CONFIG = {
  dataProjection: 'EPSG:4326',
  fillOpacity: 1.0,
  iconSize: 35
}

const createOverlay = (clusterFeatures, map) => {
  if(!clusterFeatures) return
  clusterFeatures.forEach(clusterFeature => {
    const parent = document.getElementById('popup').parentNode
    const clonedNode = document.getElementById('popup').cloneNode(true)
  
    clonedNode.id = clusterFeature.ol_uid
    parent.appendChild(clonedNode)
  
    const popup = new Overlay({
      element: clonedNode
    })
    popup.setPosition(clusterFeature.getGeometry().getCoordinates())
    map.addOverlay(popup)  
  })
}

const cleanupOverlays = () => {

}

const MilSymbolLayer = ({ map, geojson, config }) => {
  const { dataProjection, iconSize, fillOpacity } = { ...DEFAULT_CONFIG, ...config }
  const [popups, setPopups] = useState([])
  const [layer, setLayer] = useState(new VectorLayer({
    source: createSource(map, createOverlay, cleanupOverlays),
    style: styleFunction(iconSize, fillOpacity, map)
  }))

  //updateLayer Sideeffect
  useEffect(() => {
    if (!layer) return () => { }
    if (geojson) {
      const features = new GeoJSON().readFeatures(geojson, {
        dataProjection,
        featureProjection: map.getView().getProjection().getCode()
      })
      layer.setSource(createSource(map, createOverlay, cleanupOverlays, features))
    }
    else layer.setSource(createSource(map, createOverlay, cleanupOverlays))
    return () => { }
  }, [map, layer, geojson, dataProjection, iconSize])

  //add / remove Layer Sideeffect
  useEffect(() => {
    if (!map) return () => {}

    map.removeLayer(layer)
    map.addLayer(layer)
    setLayer(layer)
    return () => map.removeLayer(layer)
  }, [map, layer])

  return React.Fragment
}

export default MilSymbolLayer