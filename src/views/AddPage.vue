<script setup>
import { ref, reactive, onMounted } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase_conf'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const clickedLocation = ref(null)

const newOutfit = reactive({
  title: '',
  description: '',
  imageFile: null,
  imageUrl: ''
})

function handleFile(e) {
  newOutfit.imageFile = e.target.files[0]
}

function centerOnUserLocation() {
  navigator.geolocation?.getCurrentPosition((pos) => {
    map.value.setCenter({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    })
    map.value.setZoom(14)
  })
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBicLw4JQTqSTN0gCrX2HpprHM-uLKoIz8&v=weekly`
  script.async = true
  script.onload = () => {
    map.value = new google.maps.Map(mapContainer.value, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 12
    })

    centerOnUserLocation()

    map.value.addListener('click', (e) => {
      clickedLocation.value = e.latLng

      if (marker.value) marker.value.setMap(null)

      marker.value = new google.maps.Marker({
        map: map.value,
        position: e.latLng
      })
    })
  }

  document.head.appendChild(script)
})

async function uploadImage() {
  if (!newOutfit.imageFile) {
    return 'https://placehold.co/200x150/cccccc/000000/png?text=No+Image'
  }

  const filePath = `outfits/${Date.now()}_${newOutfit.imageFile.name}`

  await supabase.storage
    .from('outfits')
    .upload(filePath, newOutfit.imageFile)

  return supabase.storage
    .from('outfits')
    .getPublicUrl(filePath)
    .data.publicUrl
}

async function saveOutfit() {
  if (!clickedLocation.value) return

  const imageUrl = await uploadImage()

  await addDoc(collection(db, 'outfits'), {
    title: newOutfit.title,
    description: newOutfit.description,
    imageUrl,
    lat: clickedLocation.value.lat(),
    lng: clickedLocation.value.lng()
  })

  router.push('/') // go back to homepage map
}
</script>

<template>
  <div class="add-layout">
    <!-- LEFT: FORM -->
    <form class="form" @submit.prevent="saveOutfit">
      <h2>Add Outfit</h2>

      <input
        v-model="newOutfit.title"
        placeholder="Title"
        required
      />

      <textarea
        v-model="newOutfit.description"
        placeholder="Description"
      />

      <input type="file" accept="image/*" @change="handleFile" />

      <p v-if="!clickedLocation" class="hint">
        Click on the map to choose a location
      </p>

      <button :disabled="!clickedLocation">
        Save Outfit
      </button>
    </form>

    <!-- RIGHT: MAP -->
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<style scoped>
.add-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  height: 100vh;
}

.form {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-right: 1px solid #ddd;
}

.form input,
.form textarea,
.form button {
  padding: 0.5rem;
  font-size: 14px;
}

.form button {
  background: black;
  color: white;
  cursor: pointer;
}

.form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.map {
  height: 100%;
}

.hint {
  font-size: 12px;
  color: #666;
}

</style>
