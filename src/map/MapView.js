import React, { useCallback, useState, useEffect } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import { transform } from 'ol/proj';

import getProjection from './projections'
import MapViewApi from './MapViewApi'


const OL_CONFIG = {
    pixelRatio: 1,
    maxZoom: 18,
    smoothExtentConstraint: false,
    enableRotation: false,
}


const MapView = ({ className, projectionId, initialView, onMapLoaded = () => {}, children }) => {
    const [map, setMap] = useState()
    const [layerChildren, setlayerChildren] = useState()

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
        })

        setMap(map)
        onMapLoaded(MapViewApi(map))
    }

    useEffect(() => {
        if (!map) return () => {}

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

        // Update Layers
        setlayerChildren(React.Children.map(children, child => React.cloneElement(child, { map })))
    }, [children, map, projectionId])

    return (
        <div className={className} ref={useCallback(createMap, [])}>
            {layerChildren}
        </div>
    )
}

export default MapView