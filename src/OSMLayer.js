import React, { useEffect, useState } from "react"

import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

const OSMLayer = ({map}) => {
    const [layer, setLayer] = useState()

    useEffect(() => {
        if(map && !layer) {
            const osmLayer = new TileLayer({ source: new OSM() }) 
            map.addLayer(osmLayer)
            setLayer(osmLayer)
        }

        return () => map && layer && map.removeLayer(layer)
    }, [map, layer])

    return React.Fragment
}

export default OSMLayer