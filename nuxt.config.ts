// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  pages: true,
  modules: [
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  googleFonts: {
    families: {
      Manrope: true,
      Poppins: true,
      Karla: true,
    },
  },
  runtimeConfig: {
    public: {
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    },
  },
});