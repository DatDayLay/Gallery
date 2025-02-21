<script setup>
import { usePhotoStore } from "../store/photostore";

const searchQuery = ref(""); // User's current input
const lastSearchedQuery = ref("african"); // Stores the last submitted search query
const photoStore = usePhotoStore();

// Performs the search only when the user enters something.
const performSearch = () => {
  if (searchQuery.value) {
    lastSearchedQuery.value = searchQuery.value; // Store the last search term and only update after search is performed
    photoStore.fetchPhotos(searchQuery.value);
  }
};
</script>
<template>
  <header class="flex flex-col w-full bg-slate-100 shadow-xl">
    <div
      class="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 relative z-10"
    >
      <h2 class="text-xl md:text-3xl font-Manrope font-semibold text-sky-950">
        Gallery
      </h2>

      <div class="relative w-3/5 sm:w-[70%]">
        <Icon
          name="mdi:magnify"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black text-lg cursor-pointer"
          @click="performSearch"
        />

        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          placeholder="Search photos..."
          class="w-full p-2 sm:p-3 pl-10 sm:pl-12 border rounded-full text-sm text-gray-800 font-karla outline-none"
        />
        <span
          v-show="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-3xl hover:text-black cursor-pointer"
          >&times;</span
        >
      </div>

      <h2
        class="text-xs sm:text-sm font-medium font-karla cursor-pointer text-sky-950"
      >
        Gallery+
      </h2>
    </div>

    <p
      class="py-4 mb-1 px-4 ml-2 sm:ml-[4.5%] font-karla text-xs sm:text-sm text-gray-400"
    >
      {{
        photoStore.loading
          ? `Searching for "${lastSearchedQuery}"...`
          : `Search results for "${lastSearchedQuery}"`
      }}
    </p>
  </header>
</template>
