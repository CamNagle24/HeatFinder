<template>
  <div ref="mapContainer" style="height: 100vh;"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase_conf'

const mapContainer = ref(null)
const map = ref(null)
const infoWindow = ref(null)

const outfits = ref([]) // all outfits loaded from Firebase

// Reactive form state
const newOutfit = reactive({
  title: '',
  description: '',
  imageUrl: ''
})

// Keep track of clicked location
const clickedLocation = ref(null)

// Load existing outfits
async function loadOutfits() {
  const snapshot = await getDocs(collection(db, 'outfits'))
  snapshot.forEach(doc => {
    const outfit = doc.data()
    outfits.value.push(outfit)
    addMarker(outfit)
  })
}

// Add marker function
function addMarker(outfit) {
  const marker = new google.maps.Marker({
    map: map.value,
    position: { lat: outfit.lat, lng: outfit.lng },
    title: outfit.title
  })

  marker.addListener('click', () => {
    const content = `
      <div>
        <h3>${outfit.title}</h3>
        <p>${outfit.description}</p>
        <img src="${outfit.imageUrl}" style="width:100%;border-radius:5px" />
      </div>
    `
    infoWindow.value.setContent(content)
    infoWindow.value.open(map.value, marker)
  })
}

// Save outfit to Firebase + add marker
async function saveOutfit() {
  if (!newOutfit.title || !clickedLocation.value) return

  const outfitToSave = {
    ...newOutfit,
    lat: clickedLocation.value.lat(),
    lng: clickedLocation.value.lng()
  }

  await addDoc(collection(db, 'outfits'), outfitToSave)

  outfits.value.push(outfitToSave)
  addMarker(outfitToSave)

  infoWindow.value.close()
  newOutfit.title = ''
  newOutfit.description = ''
  newOutfit.imageUrl = ''
}

// Mount a small Vue form inside the InfoWindow
function openFormAtLocation(latLng) {
  clickedLocation.value = latLng

  const container = document.createElement('div')
  container.style.width = '250px'
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:5px">
      <input type="text" placeholder="Title" id="outfit-title" />
      <textarea placeholder="Description" id="outfit-desc"></textarea>
      <input type="text" placeholder="Image URL" id="outfit-img" />
      <button id="save-outfit">Save</button>
    </div>
  `
  infoWindow.value.setContent(container)
  infoWindow.value.setPosition(latLng)
  infoWindow.value.open(map.value)

  // Add event listener for save button
  container.querySelector('#save-outfit').addEventListener('click', async () => {
    newOutfit.title = container.querySelector('#outfit-title').value
    newOutfit.description = container.querySelector('#outfit-desc').value
    newOutfit.imageUrl = container.querySelector('#outfit-img').value || 'https://placehold.co/200x150/cccccc/000000/png?text=No+Image'
    await saveOutfit()
  })
}

// Initialize map
onMounted(() => {
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBicLw4JQTqSTN0gCrX2HpprHM-uLKoIz8&v=weekly`
  script.async = true
  script.defer = true
  script.onload = () => {
    map.value = new google.maps.Map(mapContainer.value, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 12
    })
    infoWindow.value = new google.maps.InfoWindow()

    // Load existing outfits
    loadOutfits()

    // Click map to add new outfit
    map.value.addListener('click', (event) => {
      openFormAtLocation(event.latLng)
    })
  }
  document.head.appendChild(script)
})
</script>

<style scoped>
/* Optional: style InfoWindow inputs */
</style>
