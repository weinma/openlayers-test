import React, { useEffect, useState } from "react"

import GeoJSON from 'ol/format/GeoJSON'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

const MilSymbolLayer = ({ map, geojson, dataProjection = 'EPSG:4326' }) => {
    const [layer, setLayer] = useState()

    useEffect(() => {
        if (map && !layer && geojson) {
            const vectorLayer = new VectorLayer({
                source: new VectorSource(),
                //style: styleFunction
            })

            map.addLayer(vectorLayer)
            setLayer(vectorLayer)
        }

        if (layer && geojson) {
            const features = new GeoJSON().readFeatures(geojson, {
                dataProjection,
                featureProjection: map.getView().getProjection().getCode()
            })
            console.log(features)
            layer.setSource(new VectorSource({ features }))
        }

        return () => map && layer && map.removeLayer(layer)
    }, [map, layer, geojson, dataProjection])

    return React.Fragment
}

export default MilSymbolLayer