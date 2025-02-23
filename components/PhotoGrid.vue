<script setup>
import { storeToRefs } from "pinia";
import { usePhotoStore } from "../store/photostore";

const photoStore = usePhotoStore();
const { photos, loading } = storeToRefs(photoStore);

const openModal = photoStore.selectPhoto;
</script>

<template>
  <div
    class="p-4 -mt-4 md:-mt-8 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
  >
    <template v-if="loading && photos.length === 0">
      <LoadingPlaceholder v-for="n in 12" :key="n" class="mb-4" />
    </template>

    <template v-else>
      <PhotoItem
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
        @click="openModal(photo)"
        class="mb-4 shadow-lg"
      />
    </template>

    <InfiniteScroll @loadMore="photoStore.loadMorePhotos" />
  </div>
</template>
