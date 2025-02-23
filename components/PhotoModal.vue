<script setup>
import { usePhotoStore } from "../store/photostore";

const photoStore = usePhotoStore();
const transitionName = ref("slide-right");
const touchStartX = ref(0);
const touchEndX = ref(0);
const isFullScreen = ref(false);

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
};

const closeModal = () => {
  photoStore.clearSelectedPhoto();
};

const nextPhoto = () => {
  if (!isFullScreen.value) {
    transitionName.value = "slide-left";
    photoStore.nextPhoto();
  }
};

const prevPhoto = () => {
  if (!isFullScreen.value) {
    transitionName.value = "slide-right";
    photoStore.prevPhoto();
  }
};

const startTouch = (event) => {
  if (!isFullScreen.value) {
    touchStartX.value = event.touches[0].clientX;
  }
};

const endTouch = (event) => {
  if (!isFullScreen.value) {
    touchEndX.value = event.changedTouches[0].clientX;
    const diff = touchStartX.value - touchEndX.value;
    const swipeThreshold = window.innerWidth * 0.1;

    if (diff > swipeThreshold) {
      nextPhoto();
    } else if (diff < -swipeThreshold) {
      prevPhoto();
    }
  }
};

const handleKeyPress = (event) => {
  if (isFullScreen.value) {
    if (event.key === "Escape") toggleFullScreen();
    return;
  }

  if (event.key === "ArrowRight") nextPhoto();
  if (event.key === "ArrowLeft") prevPhoto();
  if (event.key === "Escape") closeModal();
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
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
      class="relative bg-white w-[80%] h-[90%] max-w-[90%] max-h-[80%] p-2 sm:w-[65%] sm:h-[95%] flex flex-col rounded-lg"
    >
      <sub class="w-[98%] mx-auto flex justify-between p-[0.5%]">
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
        <img
          :key="photoStore.selectedPhoto.id"
          :src="photoStore.selectedPhoto.urls.regular"
          :alt="photoStore.selectedPhoto.description"
          class="object-contain max-w-auto max-h-[90%] m-auto cursor-zoom-in"
          :class="{ 'fullscreen-image': isFullScreen }"
          @click="toggleFullScreen"
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

    <transition name="fullscreen">
      <div
        v-if="isFullScreen"
        class="fullscreen-wrapper"
        @click="toggleFullScreen"
      >
        <img
          :src="photoStore.selectedPhoto.urls.full"
          :alt="photoStore.selectedPhoto.description"
          class="fullscreen-image"
        />
      </div>
    </transition>
  </div>
</template>
<!-- Opted for an individual component styling for the animation cuz this is the only place i'll require it and it's not a large project, libraries felt a bit like overkill. Also just wanted to flex i could get things sorted out libraries or not ;) -->

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fullscreen-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.fullscreen-image {
  width: 100vw;
  height: 95vh;
  object-fit: contain;
  cursor: zoom-out;
}

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fullscreen-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fullscreen-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
