<template>
    <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          type="button"
          data-bs-target="#carouselExampleDark"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-label="'Slide ' + (index + 1)"
        ></button>
      </div>
      <div class="carousel-inner">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-item"
          :class="{ active: index === 0 }"
          :data-bs-interval="slide.interval || 5000"
        >
          <img :src="slide.image" class="d-block w-100" :alt="slide.title" />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ slide.title }}</h5>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      slides: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .carousel-inner img {
    height: 500px;
    object-fit: cover;
  }
  .carousel-caption {
    background: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
  }
  </style>
  