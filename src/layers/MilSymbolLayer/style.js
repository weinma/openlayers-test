import Style from "ol/style/Style"
import Icon from 'ol/style/Icon'
import CircleStyle from 'ol/style/Circle'
import Text from 'ol/style/Text'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'

import ms from 'milsymbol'

import XmlParser from 'fast-xml-parser'

const EMPTY_STYLE = new Style({})

const modifyTextInSymbol = svgSymbol => {
  try {
    const xmlOptions = {
      attributeNamePrefix: "",
      attrNodeName: "attributes",
      ignoreAttributes: false,
      //      arrayMode: true
    }

    const svg = XmlParser.parse(svgSymbol, xmlOptions)
    const jsParser = new XmlParser.j2xParser(xmlOptions)

    const textClone = { ...svg.svg.text }
    textClone.attributes = { ...svg.svg.text.attributes }
    textClone.attributes["stroke-width"] = 10
    textClone.attributes.stroke = "white"
    textClone.attributes.fill = "white"

    svg.svg.text.attributes["stroke-width"] = 1
    svg.svg.text.attributes.fill = "black"
    svg.svg.text.attributes.stroke = "black"

    svg.svg.text = [textClone, svg.svg.text]
    return jsParser.parse(svg)
  } catch (error) {
    console.error(error.message)
    return svgSymbol
  }
}

const symbolStyle = (iconSize, fillOpacity) => feature => {
  //Filter all non Point geometry
  if (feature.getGeometry().getType() !== "Point") return EMPTY_STYLE

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

const clusterStyle = (map, features) => {
  const center = map.getPixelFromCoordinate(features.getGeometry().getCoordinates())
  const distance = features.get('features')
    .filter(feature => feature.getGeometry().getType() === "Point")
    .map(feature => feature.getGeometry().getCoordinates())
    .map(coordinates => map.getPixelFromCoordinate(coordinates))
    .map(coordinates => {
      const distanceVector = [
        coordinates[0] - center[0],
        coordinates[1] - center[1]
      ]
      return Math.sqrt(distanceVector[0] * distanceVector[0] + distanceVector[1] * distanceVector[1])
    })
    .reduce((prev, current) => current > prev ? current : prev, 0)

  return new Style({
    image: new CircleStyle({
      radius: distance,
      stroke: new Stroke({ color: '#000000' }),
      fill: new Fill({ color: '#3399CC' })
    }),
    text: (distance > 7) ? new Text({
      text: features.get("features").length.toString(),
      fill: new Fill({
        color: '#fff'
      })
    }) : null
  })
}

const styleFunction = (iconSize, fillOpacity, map) => features => {
  const size = features.get('features').length
  if (size !== 1) return clusterStyle(map, features)
  return symbolStyle(iconSize, fillOpacity)(features.get('features')[0])
}

export default styleFunction