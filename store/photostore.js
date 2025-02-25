import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { useRuntimeConfig } from "#imports";

export const usePhotoStore = defineStore("photoStore", () => {
  const config = useRuntimeConfig();
  const photos = ref([]);
  const loading = ref(true); //  Starts as true for initial fetch
  const loadingMore = ref(false);
  const page = ref(1);
  const selectedPhoto = ref(null);
  const query = ref("african"); //  Default query
  const favorites = ref(new Set());

  const fetchPhotos = async (newQuery = null, reset = false) => {
    if (newQuery) {
      query.value = newQuery;
      page.value = 1;
      photos.value = [];
      loading.value = true; //  Show loading during search
    } else if (reset) {
      loading.value = true; //  Show loading for initial fetch
    } else {
      loadingMore.value = true; //  Show loadingMore for infinite scroll
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query.value}&page=${page.value}&per_page=12&client_id=${config.public.unsplashAccessKey}`
      );
      const data = await response.json();

      if (reset || newQuery) {
        photos.value = data.results; //  Replace photos for search/reset
      } else {
        photos.value = [...photos.value, ...data.results]; //  Append photos for infinite scroll
      }

      page.value++;
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      loading.value = false; //  Ensure loading stops after data arrives
      loadingMore.value = false; //  Ensure loadingMore stops
    }
  };

  //  Fetch initial photos on mount
  onMounted(() => {
    fetchPhotos(null, true);
  });

  const loadMorePhotos = () => {
    if (!loadingMore.value) {
      fetchPhotos(null, false);
    }
  };

  const selectPhoto = (photo) => {
    selectedPhoto.value = photo;
  };

  const clearSelectedPhoto = () => {
    selectedPhoto.value = null;
  };

  const currentIndex = computed(() =>
    photos.value.findIndex((photo) => photo === selectedPhoto.value)
  );

  const prevPhoto = () => {
    if (currentIndex.value > 0) {
      selectedPhoto.value = photos.value[currentIndex.value - 1];
    }
  };

  const nextPhoto = () => {
    if (currentIndex.value < photos.value.length - 1) {
      selectedPhoto.value = photos.value[currentIndex.value + 1];
    }
  };
  const toggleFavorite = (photoId) => {
    if (favorites.value.has(photoId)) {
      favorites.value.delete(photoId);
    } else {
      favorites.value.add(photoId);
    }
  };

  const isFavorite = (photoId) => favorites.value.has(photoId);

  return {
    photos,
    loading,
    loadingMore,
    selectedPhoto,
    fetchPhotos,
    loadMorePhotos,
    selectPhoto,
    clearSelectedPhoto,
    prevPhoto,
    nextPhoto,
    toggleFavorite,
    isFavorite,
  };
});
