<template>
  <div id="app">
    
    <template v-if="!$route.meta.hideLayout">
      <HeaderComponent :isHome="$route.meta.isHome" />
    </template>

    <router-view />

    <template v-if="!$route.meta.hideLayout">
      <FooterComponent />
    </template>

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
