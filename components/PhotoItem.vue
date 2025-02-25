<script setup>
import { usePhotoStore } from "../store/photostore";
const photoStore = usePhotoStore();
const { toggleFavorite, isFavorite } = photoStore;
const props = defineProps({
  photo: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["click"]);
</script>
<template>
  <div class="relative cursor-pointer group">
    <div
      class="absolute inset-0 rounded-lg bg-black bg-opacity-40 cursor-zoom-in opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      @click="emits('click', photo)"
    ></div>

    <img
      :src="photo.urls.small"
      :alt="photo.description"
      class="w-full h-auto object-cover rounded-lg"
      loading="lazy"
    />

    <div
      class="absolute bottom-0 left-0 w-full p-2 text-white bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <p class="font-Karla text-xs sm:text-sm text-slate-200">
        {{ photo.user.name }}
      </p>
      <p class="font-Karla text-xs sm:text-sm text-slate-200">
        {{ photo.user.location || "Unknown Location" }}
      </p>
    </div>

    <div
      class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <span
        class="group/icon px-3 py-2 rounded-md h-fit hover:bg-red-300 transition-colors"
        :class="
          isFavorite(photo.id)
            ? 'bg-red-300 hover:bg-red-300'
            : 'bg-slate-200 hover:bg-white'
        "
        @click.stop="toggleFavorite(photo.id)"
      >
        <Icon
          name="fa-solid:heart"
          size="16px"
          class="text-gray-500"
          :class="
            isFavorite(photo.id)
              ? 'text-white'
              : 'text-gray-500 group-hover/icon:text-black'
          "
        />
      </span>

      <span
        class="group/icon bg-slate-200 px-3 py-2 rounded-md h-fit hover:bg-white transition-colors"
      >
        <Icon
          name="mdi:download"
          size="18px"
          class="text-gray-500 group-hover/icon:text-black"
        />
      </span>
    </div>
  </div>
</template>
