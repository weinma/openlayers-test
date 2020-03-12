import React, { useEffect, useState } from 'react'

const Layer = ({map}) => {
    const [layer, setLayer] = useState()

    useEffect(() => {
        if(map && !layer) {
/*            
            const newLayer =
            map.addLayer(newLayer)
            setLayer(newLayer)
*/
        }

        return () => map && layer && map.removeLayer(layer)
    }, [map, layer])

    return React.Fragment
}

export default Layer