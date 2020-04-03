import React, { useEffect } from "react"
import Overlay from 'ol/Overlay'
import PointerInteraction from 'ol/interaction/Pointer'
import Paper from '@material-ui/core/Paper'
import ms from 'milsymbol'

const SymbolClusterOverlay = ({ clusterFeature, map, index }) => {
  useEffect(() => {
    let parent = null
    let popup = null
    let drag = null

    process.nextTick(() => {
      const element = document.getElementById(`${index}`)
      parent = element.parentElement
      
      popup = new Overlay({ element })
      popup.setPosition(clusterFeature.getGeometry().getCoordinates())
      map.addOverlay(popup)
      
      drag = new PointerInteraction({
        handleDownEvent: event => {
          return true
        },
        handleDragEvent: event => {
          const featurePixelCoordinate = event.target.getPixelFromCoordinate(clusterFeature.getGeometry().getCoordinates())
          const eventPixelCoordinate = event.target.getPixelFromCoordinate(event.coordinate)
          popup.setOffset([eventPixelCoordinate[0] - featurePixelCoordinate[0], eventPixelCoordinate[1] - featurePixelCoordinate[1]])
        }
      })
      map.addInteraction(drag)
    })
    return () => {
      //must be in this order
      parent.append(document.getElementById(`${index}`))
      map.removeOverlay(popup)
      map.removeInteraction(drag)
    }
  }, [map, clusterFeature])

  const symbol = (sidc, dtg) => new ms.Symbol(sidc, { dtg })

  return (
    <Paper id={index}>
      {clusterFeature.get("features").map((feature, index) => (
        <div key={`index-${index}`}>
          <img src={symbol(feature.get('sidc'), feature.get('w')).setOptions({ size: 30 }).toDataURL()}></img>
        </div>
      ))}
    </Paper>
  )
}

export default SymbolClusterOverlay