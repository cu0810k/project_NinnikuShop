<template id="product_detail">
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <main id="main-order">
    <div class="container-fluid con-order">
      <div class="row justify-content-center">
        <div class="noProduct">
          <img src="../assets/underConstruction.png" alt="" class="img-fluid" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'OrderView',
  data () {
    return {
      isLoading: false
    }
  },
  components: {
    NavBar
  },
  watch: {
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped>
#main-order {
  padding-bottom: 50px;
  padding-top: 99px;
}

#main-order::after {
  content: "";
  background-color: #d50000;
  width: 100%;
  display: block;
  height: 338px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.con-order {
  background-color: #fff;
  max-width: 1500px;
  margin: auto;
  border-radius: 10px;
  padding: 25px 12px;
  position: relative;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

@media (min-width: 992px) {
  #main-order {
    padding-top: 152px;
    padding-bottom: 90px;
  }

  .con-order {
    padding: 50px;
  }
}

.noProduct {
  margin: 50px 0;
  text-align: center;
}

.noProduct img {
  width: 600px;
}
</style>
