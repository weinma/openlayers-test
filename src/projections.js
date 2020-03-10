import proj4 from 'proj4'
import {get as findProjection} from 'ol/proj'
import { register } from 'ol/proj/proj4'

import projections from './projections.json'

const DEFAULT_PROJECTION = {
    projection: "EPSG:3857",
    extent: undefined
}

const defineProjections = () => {
    projections.forEach(({ name, proj4Definition }) => proj4.defs(name, proj4Definition))
    register(proj4)
}

const initialiseExtents = () =>
    projections.forEach(({ name, extent }) => findProjection(name).setExtent(extent))


const initialiseProjections = () => defineProjections() || initialiseExtents()
initialiseProjections()

const getProjection = projectionId => {
    let projection = findProjection(projectionId)

    if (projection) return ({ projection, extent: projection.getExtent() })
    if (!projectionId) console.warn(`No ProjectionId specified. Using: ${DEFAULT_PROJECTION.projection}`)
    else if (!projection) console.warn(`ProjectionId: ${projectionId} not found. Using: ${DEFAULT_PROJECTION.projection}`)

    return DEFAULT_PROJECTION
}


export default getProjection