<template>
  <div id="map" style="height: 60vh"></div>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const { zonas } = defineProps(["zonas"]);

const centerCoordinates = [21.0165, -101.2574];
const zoomLevel = 7.5; // Ajusta el nivel de zoom para acercar un poco menos

// Datos de colores para municipios
const getColor = (municipioNumberStr) => {
  if (
    typeof municipioNumberStr !== "string" ||
    municipioNumberStr.length !== 5 ||
    !/^\d+$/.test(municipioNumberStr)
  ) {
    throw new Error("El número debe ser una cadena de 5 dígitos.");
  }

  const hash = parseInt(municipioNumberStr, 10);
  const r = (hash * 13) % 256;
  const g = (hash * 23) % 256;
  const b = (hash * 37) % 256;

  const hexColor = `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;

  return hexColor;
};

// Función para cargar datos GeoJSON
const loadGeoJSON = async () => {
  const files = [
    "/geojson/guanajuato.json",
    "/geojson/queretaro.json",
    "/geojson/aguascalientes.json",
    "/geojson/jalisco.json",
    "/geojson/michoacan.json",
    "/geojson/potosi.json",
    "/geojson/zacatecas.json",
  ];

  try {
    const responses = await Promise.all(files.map((file) => fetch(file)));
    const data = await Promise.all(
      responses.map((response) => {
        if (!response.ok) {
          throw new Error(
            `Error loading GeoJSON from ${response.url}: ${response.statusText}`
          );
        }
        return response.json();
      })
    );

    const combinedData = {
      type: "FeatureCollection",
      features: data.flatMap((d) => d.features),
    };
    return combinedData;
  } catch (error) {
    console.error("Error loading GeoJSON:", error);
  }
};

const normalizeString = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const filterGeoJSON = (geojsonData, zonas) => {
  if (!geojsonData || !zonas || !Array.isArray(zonas)) return null;

  const zonaNames = new Set(zonas.map((z) => normalizeString(z.name)));

  return {
    type: "FeatureCollection",
    features: geojsonData.features.filter((feature) =>
      zonaNames.has(normalizeString(feature.properties.NOMGEO))
    ),
  };
};

// Inicializar el mapa
const initMap = async () => {
  const map = L.map("map").setView(centerCoordinates, zoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const geojsonData = await loadGeoJSON();
  const filteredData = filterGeoJSON(geojsonData, zonas);

  if (filteredData) {
    L.geoJSON(filteredData, {
      style: (feature) => ({
        color: "#000000",
        weight: 2,
        fillColor: getColor(feature.properties.CVEGEO),
        fillOpacity: 0.6,
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          click: () => {},
        });
        layer.bindPopup(`<b>${feature.properties.NOMGEO}</b>`);
      },
    }).addTo(map);
  }
};

onMounted(() => {
  initMap();
});
</script>
