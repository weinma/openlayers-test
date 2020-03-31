import React, { useEffect, useState } from "react"

import GeoJSON from 'ol/format/GeoJSON'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from "ol/style/Style"
import Icon from 'ol/style/Icon'
import ms from 'milsymbol'

import XmlParser from 'fast-xml-parser'
import { j2xParser } from 'fast-xml-parser'

const DEFAULT_CONFIG = {
  dataProjection: 'EPSG:4326',
  fillOpacity: 1.0,
  iconSize: 35
}

const modifyTextInSymbol = svgSymbol => {
  try {
    const xmlOptions = {
      attributeNamePrefix: "",
      attrNodeName: "attributes",
      ignoreAttributes: false,
      //      arrayMode: true
    }

    const svg = XmlParser.parse(svgSymbol, xmlOptions)
    const jsParser = new j2xParser(xmlOptions)

    const textClone = { ...svg.svg.text }
    textClone.attributes = { ...svg.svg.text.attributes }
    textClone.attributes["stroke-width"] = 10
    textClone.attributes.stroke="white"
    textClone.attributes.fill="white"
    
    svg.svg.text.attributes["stroke-width"] = 1
    svg.svg.text.attributes.fill="black"
    svg.svg.text.attributes.stroke="black"

    svg.svg.text = [textClone, svg.svg.text]
    return jsParser.parse(svg)
  } catch (error) {
    console.log(error.message)
    return svgSymbol
  }
}

const styleFunction = (iconSize, fillOpacity) => feature => {
  //Filter all non Point geometry
  if (feature.getGeometry().getType() !== "Point") return

  const symbol = new ms.Symbol(feature.getProperties().sidc, {
    fillOpacity,
    dtg: feature.get("w")
  })

  const svgSymbol = symbol.setOptions({ size: iconSize }).asSVG()
  const modifiedSymbol = modifyTextInSymbol(svgSymbol)
  return new Style({
    image: new Icon(({
      scale: 1,
      anchor: [symbol.getAnchor().x, symbol.getAnchor().y],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'data:image/svg+xml;base64,' + btoa(modifiedSymbol)
    }))
  })
}

const MilSymbolLayer = ({ map, geojson, config }) => {
  const { dataProjection, iconSize, fillOpacity } = { ...DEFAULT_CONFIG, config }
  const [layer, setLayer] = useState(new VectorLayer({
    source: new VectorSource(),
    style: styleFunction(iconSize, fillOpacity)
  }))

  //updateLayer Sideeffect
  useEffect(() => {
    if (!layer) return () => { }
    if (geojson) {
      const features = new GeoJSON().readFeatures(geojson, {
        dataProjection,
        featureProjection: map.getView().getProjection().getCode()
      })
      layer.setSource(new VectorSource({ features }))
    }
    else layer.setSource(new VectorSource())
    return () => { }
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