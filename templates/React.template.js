import React, { useEffect } from 'react'

const Layer = ({map}) => {
    const [layer, setLayer] = useState()

    useEffect(() => {
        return () => map && layer && map.removeLayer(layer)
    }, [map, layer])

    return React.Fragment
}

export default Layer