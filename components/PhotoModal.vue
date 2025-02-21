<script setup>
import { usePhotoStore } from "../store/photostore";

const photoStore = usePhotoStore();
const transitionName = ref("slide-right"); // Default transition
const touchStartX = ref(0);
const touchEndX = ref(0);

const closeModal = () => {
  photoStore.clearSelectedPhoto();
};

// Move next (slide left)
const nextPhoto = () => {
  transitionName.value = "slide-left";
  photoStore.nextPhoto();
};

// Move previous (slide right)
const prevPhoto = () => {
  transitionName.value = "slide-right";
  photoStore.prevPhoto();
};

// Capture touch start position
const startTouch = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

// Capture touch end position and determine swipe direction
const endTouch = (event) => {
  touchEndX.value = event.changedTouches[0].clientX;
  const diff = touchStartX.value - touchEndX.value;

  if (diff > 50) {
    // Swiped left (next photo)
    nextPhoto();
  } else if (diff < -50) {
    // Swiped right (previous photo)
    prevPhoto();
  }
};
</script>

<template>
  <div
    v-if="photoStore.selectedPhoto"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
    @touchstart="startTouch"
    @touchend="endTouch"
  >
    <span
      class="absolute top-2 right-4 text-3xl text-slate-300 hover:text-white cursor-pointer"
      @click="closeModal"
    >
      &times;
    </span>

    <button
      @click="prevPhoto"
      class="absolute left-5 text-slate-300 hover:text-white text-5xl p-2 hidden md:block"
    >
      &lt;
    </button>

    <div
      class="relative bg-white w-[80%] h-[90%] max-w-[90%] max-h-[80%] sm:w-[65%] sm:h-[95%] flex flex-col rounded-lg"
    >
      <sub class="w-[98%] mx-auto flex justify-between">
        <aside class="flex flex-col p-1">
          <h4 class="font-Karla text-black text-base font-semibold">
            {{ photoStore.selectedPhoto.user.name }}
          </h4>
          <h5 class="font-Karla text-black text-xs">
            {{ photoStore.selectedPhoto.user.location || "Unknown Location" }}
          </h5>
        </aside>
        <aside class="flex p-1">
          <span
            class="group w-fit bg-slate-200 shadow-sm justify-center cursor-pointer mr-2 items-center sm:p-3 p-2 rounded-md hover:bg-black"
          >
            <Icon
              name="fa-solid:heart"
              size="18px"
              class="text-gray-500 group-hover:text-white cursor-pointer"
            />
          </span>
          <span
            class="group w-fit bg-slate-200 shadow-sm justify-center cursor-pointer mr-2 items-center sm:p-3 p-2 rounded-md hover:bg-black"
          >
            <Icon
              name="mdi:download"
              size="18px"
              class="text-gray-500 group-hover:text-white cursor-pointer"
            />
          </span>
        </aside>
      </sub>

      <transition :name="transitionName" mode="out-in">
        <NuxtImg
          :key="photoStore.selectedPhoto.id"
          :src="photoStore.selectedPhoto.urls.regular"
          :alt="photoStore.selectedPhoto.description"
          class="object-contain max-w-auto max-h-[90%] m-auto cursor-zoom-out"
          @click="closeModal"
          loading="lazy"
        />
      </transition>
    </div>

    <button
      @click="nextPhoto"
      class="absolute right-5 text-slate-300 hover:text-white text-5xl p-2 hidden md:block"
    >
      &gt;
    </button>
  </div>
</template>

<!-- Opted for an individual component styling for the animation cuz this is the only place i'll require it and it's not a large project, Using swiperjs or another library felt a bit like overkill -->
<style>
/* Slide left (Next) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(5px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}

/* Slide right (Previous) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-5px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(5px);
}
</style>
