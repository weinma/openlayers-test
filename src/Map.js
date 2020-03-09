import React, { useCallback, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

const OL_CONFIG = {
    pixelRatio: 1,
    maxZoom: 18,
    smoothExtentConstraint: false,
    enableRotation: false,
}

export const MapView = ({className, projection = 'EPSG:3857'}) => {
    const [map, setMap] = useState()
    
    const createMap = target => {
        const map = new Map({
            ...OL_CONFIG,
            target,
            projection ,
            layers: [new TileLayer({ source: new OSM() })],
            view: new View({ center: [0, 0], zoom: 2})
        })
        setMap(map)
    }

    return <div className={className} ref={useCallback(createMap, [])} />
}
export default MapView