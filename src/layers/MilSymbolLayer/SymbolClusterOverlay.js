import React, { useEffect } from "react"
import Overlay from 'ol/Overlay'

const SymbolClusterOverlay = ({ clusterFeature, map, index }) => {
  useEffect(() => {
    let parent = null
    let popup = null
    process.nextTick(() => {
      const element = document.getElementById(`${index}`)
      parent = element.parentElement
      popup = new Overlay({ element })
      popup.setPosition(clusterFeature.getGeometry().getCoordinates())
      map.addOverlay(popup)
    })
    return () => {
      //must be in this order
      parent.append(document.getElementById(`${index}`))
      map.removeOverlay(popup)
    }
  }, [map, clusterFeature])

  return <div><div id={index}>Hello</div></div>
}

export default SymbolClusterOverlay