<script setup>
// This component emits "loadMore" when the user scrolls to the bottom.
// It uses IntersectionObserver to detect when the hidden div comes into view.
const emits = defineEmits(["loadMore"]);
const observerRef = ref(null);
const observer = shallowRef(null);

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) {
    emits("loadMore");
  }
};

onMounted(() => {
  if ("IntersectionObserver" in window) {
    observer.value = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (observerRef.value) {
      observer.value.observe(observerRef.value);
    }
  }
});

onUnmounted(() => {
  if (observer.value && observerRef.value) {
    observer.value.unobserve(observerRef.value);
  }
});

// Ensure the observer updates if `observerRef` changes dynamically
watchEffect(() => {
  if (observer.value && observerRef.value) {
    observer.value.observe(observerRef.value);
  }
});
</script>

<template>
  <div ref="observerRef"></div>
</template>
