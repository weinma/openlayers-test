import React, { useEffect, useState } from "react"

import GeoJSON from 'ol/format/GeoJSON'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from "ol/style/Style"
import Icon from 'ol/style/Icon'
import ms from 'milsymbol'

const DEFAULT_CONFIG = {
  dataProjection: 'EPSG:4326',
  iconSize: 35
}

const styleFunction = (iconSize) => feature => {
  //Filter all non Point geometry
  if (feature.getGeometry().getType() !== "Point") return

  const symbol = new ms.Symbol(feature.getProperties().sidc, {})
  const symbolCanvas = symbol.setOptions({ size: iconSize }).asCanvas()

  return new Style({
    image: new Icon(({
      scale: 1,
      anchor: [symbol.getAnchor().x, symbol.getAnchor().y],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      imgSize: [Math.floor(symbol.getSize().width), Math.floor(symbol.getSize().height)],
      img: symbolCanvas
    }))
  })
}

const MilSymbolLayer = ({ map, geojson, config }) => {
  const { dataProjection, iconSize } = { ...DEFAULT_CONFIG, config }
  const [layer, setLayer] = useState(new VectorLayer({
    source: new VectorSource(),
    style: styleFunction(iconSize)
  }))

  //updateLayer Sideeffect
  useEffect(() => {
    if(!layer) return () => {}
    if (geojson) {
      const features = new GeoJSON().readFeatures(geojson, {
        dataProjection,
        featureProjection: map.getView().getProjection().getCode()
      })
      layer.setSource(new VectorSource({ features }))
    }
    else layer.setSource(new VectorSource())
    return () => {}
  }, [geojson, dataProjection, iconSize])

  //add / remove Layer Sideeffect
  useEffect(() => {
    if (!map) return () => { }

    map.removeLayer(layer)
    map.addLayer(layer)

    return () => map.removeLayer(layer)
  }, [map, layer])
  
  return React.Fragment
}

export default MilSymbolLayer