import ClusterSource from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'

const DEFAULT_DISTANCE = 30 // pixels

const createSource = (map, createClusterOverlays, cleanupClusterOverlays, features, distance = DEFAULT_DISTANCE) => {
  const source = new ClusterSource({ distance, source: new VectorSource({ features }) })

  source.on("change", ({ target }) => {
    const features = target.getFeatures()
    if (features?.length === 0) return

    cleanupClusterOverlays()
    const clusterFeatures = features.filter(clusterFeature => clusterFeature.get("features").length > 1)
    createClusterOverlays(clusterFeatures, map)
  })

  return source
}

export default createSource