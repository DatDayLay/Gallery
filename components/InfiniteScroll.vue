<script setup>
// This component emits "loadMore" when the user scrolls to the bottom.
// It uses IntersectionObserver to detect when the hidden div comes into view.
const emits = defineEmits(["loadMore"]);

const observerRef = ref(null);
// This function runs when the observed div becomes visible, triggering "loadMore".
const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) {
    emits("loadMore");
  }
};

let observer;

if (typeof window !== "undefined" && "IntersectionObserver" in window) {
  observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });
}
// Start observing when the component is mounted, stop when it's removed.
onMounted(() => {
  if (observerRef.value && observer) {
    observer.observe(observerRef.value);
  }
});

onUnmounted(() => {
  if (observerRef.value && observer) {
    observer.unobserve(observerRef.value);
  }
});
</script>

<template>
  <!-- The invisible div at the bottom that triggers the observer -->
  <div ref="observerRef"></div>
</template>
