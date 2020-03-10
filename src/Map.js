import React, { useCallback, useState, useEffect } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'

import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

import getProjection from './projections'

const OL_CONFIG = {
    pixelRatio: 1,
    maxZoom: 18,
    smoothExtentConstraint: false,
    enableRotation: false,
}


export const MapView = ({ className, projectionId }) => {
    const [map, setMap] = useState()

    const createMap = target => {
        const map = new Map({
            ...OL_CONFIG,
            target,
            layers: [new TileLayer({ source: new OSM() })],
        })
        setMap(map)
    }

    useEffect(() => {
        if (!map) return

        const { center, zoom } = map.getView()
        map.setView(new View({
            ...getProjection(projectionId),
            center: center || [0, 0], 
            zoom: zoom || 2 
        }))
    })

    return <div className={className} ref={useCallback(createMap, [])} />
}
export default MapView