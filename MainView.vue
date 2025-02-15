<template>
  <div>
    <header-component title="GPS Tracker">
      <div class="nav-icon" @click="$router.push('/chat')">💬</div>
      <div class="nav-icon" @click="handleLogout">🚪</div>
    </header-component>
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import { mapActions } from 'vuex'
import HeaderComponent from '@/components/HeaderComponent.vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
  name: 'MainView',
  components: {
    HeaderComponent
  },
  setup() {
    const mapContainer = ref(null)
    let map = null
    let marker = null
    let tileLayers = []
    
    onMounted(() => {
      // Initialize map
      map = L.map(mapContainer.value, {
        center: [0, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18
      })
      
      // Add tile layers
      tileLayers = [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }),
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri'
        })
      ]
      
      // Add first tile layer
      tileLayers[0].addTo(map)
      
      // Fallback mechanism
      map.on('tileerror', () => {
        console.warn('Tile loading error, switching layer')
        map.removeLayer(tileLayers[0])
        tileLayers[1].addTo(map)
      })
      
      // Simulate GPS data
      const interval = setInterval(() => {
        const lat = Math.random() * 180 - 90
        const lng = Math.random() * 360 - 180
        updateLocation(lat, lng)
      }, 5000)
      
      // Cleanup
      onUnmounted(() => {
        clearInterval(interval)
        if (map) {
          map.remove()
        }
      })
    })
    
    const updateLocation = (lat, lng) => {
      if (!map) return
      
      // Remove existing marker
      if (marker) {
        map.removeLayer(marker)
      }
      
      // Create new marker with more details
      marker = L.marker([lat, lng]).addTo(map)
      
      // Smooth pan and zoom
      map.setView([lat, lng], 15, {
        animate: true,
        duration: 1
      })
      
      // Add popup with coordinates
      marker.bindPopup(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`).openPopup()
    }
    
    return {
      mapContainer
    }
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
#map {
  height: calc(100vh - 60px);
}
.nav-icon {
  cursor: pointer;
  font-size: 24px;
}
</style>