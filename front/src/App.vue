<template>
  <div id="app">
    <HeaderComponent :isHome="$route.meta.isHome" />
    <router-view />
    <FooterComponent />
  </div>
</template>


<script>
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
import FooterComponent from '@/components/layout/FooterComponent.vue'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>
