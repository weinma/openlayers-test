import React, { useCallback, useState, useEffect } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import { transform } from 'ol/proj';

import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

import getProjection from './projections'
import MapControl from './MapControl';
// assuming that OpenLayers knows about EPSG:21781, see above
const OL_CONFIG = {
    pixelRatio: 1,
    maxZoom: 18,
    smoothExtentConstraint: false,
    enableRotation: false,
}

export const MapView = ({ className, projectionId, initialView, onMapLoaded }) => {
    const [map, setMap] = useState()

    const createMap = target => {
        const projection = getProjection(projectionId)
        const view = new View({
            ...projection,
            center: initialView?.center ? transform(initialView.center, "EPSG:4326", projection.projection) : [0, 0],
            zoom: initialView?.zoom || 2
        })

        const map = new Map({
            ...OL_CONFIG,
            view,
            target,
            layers: [new TileLayer({ source: new OSM() })],
        })
        setMap(map)

        onMapLoaded && onMapLoaded(MapControl(map))
    }

    useEffect(() => {
        if (!map) return

        // Update view
        const { projection, extent } = getProjection(projectionId)
        if (projection !== map.getView().getProjection().getCode()) {
            map.setView(new View({
                projection,
                extent,
                center: map.getView().getCenter(),
                zoom: map.getView().getZoom()
            }))
        }

    })

    return <div className={className} ref={useCallback(createMap, [])} />
}
export default MapView