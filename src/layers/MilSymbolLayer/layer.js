import React, { useEffect, useState } from "react"

import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'

import styleFunction from './style'
import createSource from './source'

const DEFAULT_CONFIG = {
  dataProjection: 'EPSG:4326',
  fillOpacity: 1.0,
  iconSize: 35
}

const MilSymbolLayer = ({ map, geojson, config }) => {
  const { dataProjection, iconSize, fillOpacity } = { ...DEFAULT_CONFIG, ...config }
  const [layer, setLayer] = useState(new VectorLayer({
    source: createSource(map),
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
      layer.setSource(createSource(map, features))
    }
    else layer.setSource(createSource(map))
    return () => { }
  }, [map, layer, geojson, dataProjection, iconSize])

  //add / remove Layer Sideeffect
  useEffect(() => {
    if (!map) return () => { }

    map.removeLayer(layer)
    map.addLayer(layer)
    setLayer(layer)
    return () => map.removeLayer(layer)
  }, [map, layer])

  return React.Fragment
}

export default MilSymbolLayer