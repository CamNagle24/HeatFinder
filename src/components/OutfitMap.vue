<template>
  <div ref="mapContainer" style="height: 100vh;"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase_conf'
import { supabase } from '../supabase'

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
      <div style="max-width:240px;font-family:sans-serif">
        <div
          style="
            width:100%;
            height:160px;
            overflow:hidden;
            border-radius:10px;
            background:#eee;
            margin-bottom:6px;
          "
        >
          <img
            src="${outfit.imageUrl}"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
            "
          />
        </div>

        <h3 style="margin:4px 0;font-size:16px">${outfit.title}</h3>
        <p style="margin:0;font-size:13px;color:#555">
          ${outfit.description}
        </p>
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
      <input type="file" id="outfit-img" accept="image/*" />
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

    const fileInput = container.querySelector('#outfit-img')
    const file = fileInput.files[0]
    newOutfit.imageUrl = file ? await uploadImage(file) : 'https://placehold.co/200x150/cccccc/000000/png?text=No+Image'

    await saveOutfit()
  })
}

function centerOnUserLocation() {
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      map.value.setCenter(userLocation)
      map.value.setZoom(14)

      // Optional: marker for user
      new google.maps.Marker({
        map: map.value,
        position: userLocation,
        title: 'You are here',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#fff'
        }
      })
    },
    (error) => {
      console.warn('Geolocation error:', error)
      // Optional fallback location
      map.value.setCenter({ lat: 48.8566, lng: 2.3522 }) // Paris
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  )
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

    // Center on user location
    centerOnUserLocation()

    // Load existing outfits
    loadOutfits()

    // Click map to add new outfit
    map.value.addListener('click', (event) => {
      openFormAtLocation(event.latLng)
    })
  }
  document.head.appendChild(script)
})

async function uploadImage(file) {
  if (!file) return null

  const filePath = `outfits/${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('outfits')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('outfits')
    .getPublicUrl(filePath)

  return data.publicUrl
}

</script>

<style scoped>
/* Optional: style InfoWindow inputs */
</style>
