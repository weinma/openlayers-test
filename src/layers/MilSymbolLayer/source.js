import ClusterSource from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'

const CLUSTER_DISTANCE = 30 // pixels?

const createSource = (map, features) => {
  const source = new ClusterSource({
    distance: CLUSTER_DISTANCE,
    source: new VectorSource({ features })
  })

  source.on("change", event => {
    const features = event.target.getFeatures()
    features.filter(clusterFeature => clusterFeature.get("features").length > 1)
      .forEach(clusterFeature => {
        console.log(clusterFeature)
      })
  })

  source.forEachFeature(feature => {
    console.log(feature)
    return true
  })
  source.getFeatures()

  return source
}

export default createSource