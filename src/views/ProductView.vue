<template id="product_detail">
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <div class="top_pic">
    <img src="../assets/product_bg.png" alt="" class="img-fluid" />
  </div>

  <main id="main-product">
    <div class="container-fluid con-product">
      <div class="row justify-content-center">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">全部商品</li>
          <li class="breadcrumb-item">
            {{ product.category }}
          </li>
          <li class="breadcrumb-item">
            {{ product.title }}
          </li>
        </ol>
        <div class="col-12 col-lg-5 product-pic">
          <img :src="product.imageUrl" :alt="product.title" class="img-fluid" />
        </div>
        <div class="col-12 col-lg-6 product-txt">
          <h2 class="product-title">{{ product.title }}</h2>
          <p class="mb-1">
            <del> {{ $currency(product.origin_price) }}</del>
          </p>
          <p class="h4 fw-bold">{{ $currency(product.price) }}</p>
          <span>數量</span>

          <div class="input-group mt-2">
            <div class="input-group-prepend">
              <button
                class="btn"
                type="button"
                id="button-addon1"
                @click="updateQty('prepend')"
              >
                -
              </button>
            </div>
            <input
              type="text"
              class="form-control text-center product_count"
              placeholder=""
              v-model.number="qty"
              disabled
            />
            <div class="input-group-append">
              <button
                class="btn"
                type="button"
                id="button-addon2"
                @click="updateQty('append')"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            class="btn-add rounded mt-3"
            @click.prevent="addToCart(product.id, qty)"
          >
            加入購物車
          </button>
          <button
            class="btn-wish rounded mt-2"
            @click.prevent="addToWish(product.id)"
          >
            <i class="bi bi-heart-fill" v-if="wishProduct.includes(product.id)">
            </i>
            <i class="bi bi-heart" v-else></i>加入追蹤清單
          </button>
        </div>
        <div class="product-describe">
          <h3>商品描述</h3>
          <div class="product-content">
            {{ tempContent }}
          </div>
        </div>
        <div class="other-product">
          <div class="other-product-title">
            <h3>相關商品</h3>
          </div>
          <div class="other-product-inner">
            <div class="swiper_main">
              <swiper
                :navigation="{
                  nextEl: '.swiper-button-next2',
                  prevEl: '.swiper-button-prev2',
                }"
                :modules="modules"
                :loop="false"
                :loopFillGroupWithBlank="true"
                :slidesPerView="2"
                :spaceBetween="24"
                :slidesPerGroup="2"
                :breakpoints="{
                  540: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                    slidesPerGroup: 2,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    slidesPerGroup: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                    slidesPerGroup: 4,
                  },
                }"
                class="mySwiper"
              >
                <template v-for="item in otherProduct" :key="item.id">
                  <swiper-slide v-if="item.id !== id">
                    <div class="card">
                      <div class="card-pic">
                        <i
                          class="add_to_wishlist bi bi-heart-fill"
                          @click.prevent="addToWish(item.id)"
                          v-if="wishProduct.includes(item.id)"
                        >
                        </i>
                        <i
                          class="add_to_wishlist bi bi-heart"
                          @click.prevent="addToWish(item.id)"
                          v-else
                        >
                        </i>
                        <a
                          class="add_to_cart"
                          href="#"
                          @click.prevent="addToCart(item.id)"
                          >加入購物車</a
                        >
                        <img
                          :src="item.imageUrl"
                          class="card-img-top"
                          :alt="item.title"
                        />
                      </div>
                      <div class="card-body">
                        <RouterLink class="card-title" :to="`./${item.id}`">
                          {{ item.title }}
                        </RouterLink>
                        <span class="card-price">NT {{ item.price }}</span>
                      </div>
                    </div>
                  </swiper-slide>
                </template>
              </swiper>
              <div class="swiper-button">
                <span class="swiper-button-prev2"></span>
                <span class="swiper-button-next2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import addToWish from '@/mixins/addToWish'
import addToCart from '@/mixins/addToCart'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

export default {
  name: 'ProductsView',
  data () {
    return {
      modules: [Navigation],
      id: '',
      product: {},
      otherProduct: [],
      tempContent: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, dolorem praesentium illo facere quiaiste ea quibusdam aspernatur nisi.Odit!',
      isLoading: false,
      qty: 1
    }
  },
  mixins: [addToWish, addToCart],
  components: {
    NavBar,
    Swiper,
    SwiperSlide
  },
  watch: {
    $route (to) {
      // console.log(to)

      if (to.matched[1].path === '/product/:id') {
        this.id = to.params.id
        this.getProductData()
        // console.log('還在商品頁')
      } else {
        // console.log('去別頁了')
      }
    }
  },
  methods: {
    getProductData () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu
      const apiUrl = `${url}/api/${path}/product/${this.id}` // 全部商品

      this.isLoading = true
      this.$http.get(apiUrl)
        .then(res => {
          // console.log(res)
          this.product = res.data.product
          this.isLoading = false
          this.getProducts()
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    getProducts () {
      // console.log(this.product.category)
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu
      const apiUrl = `${url}/api/${path}/products?category=${this.product.category}` // 全部商品

      this.$http.get(apiUrl)
        .then(res => {
          // console.log(res)
          this.otherProduct = res.data.products
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    updateQty (status) {
      if (status === 'append') {
        this.qty++
      } else {
        if (this.qty === 1) {
          return
        }
        this.qty--
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getProductData()
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 0;
  font-weight: 600;
  color: #5d4c46;
  position: relative;
  font-size: 1.3rem;
  position: relative;
  letter-spacing: 1.3px;
  text-align: center;
  display: inline-block;
}

h3::after {
  content: "";
  display: block;
  width: 60%;
  height: 3px;
  position: absolute;
  left: 0;
  bottom: -15px;
  margin: auto;
  background: #5d4c46;
}

@media (min-width: 992px) {
  h3 {
    font-size: 1.8rem;
  }
}

/*=====*/

#main-product {
  padding-bottom: 90px;
}

.con-product {
  background-color: #fff;
  max-width: 1500px;
  margin: auto;
  border-radius: 10px;
  padding: 25px 12px;
  position: relative;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
}

@media (min-width: 992px) {
  .con-product {
    padding: 50px;
  }
}

/*=====*/

.breadcrumb {
  max-width: 1300px;
  margin: auto;
  margin-bottom: 25px;
  padding-left: 12px;
}

/*=====*/

.product-pic {
  text-align: center;
}

.product-title {
  margin-top: 10px;
}

.input-group input {
  border: 1px solid #d8d8d6;
}

.input-group-prepend,
.input-group-append {
  border: 1px solid #d8d8d6;
  border-radius: 5px;
}

.input-group .btn {
  padding: 0.5rem 1rem;
}

.btn-add,
.btn-wish {
  background: #fde310;
  color: #000;
  width: 100%;
  display: block;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  border: 0px;
  transition: 0.3s;
}

.btn-add:hover,
.btn-wish:hover {
  background: #d50000;
  color: #fff;
  transition: 0.3s;
}

.btn-wish:hover {
  background: #e5e5e5;
  color: #000;
  transition: 0.3s;
}

.btn-wish {
  background: #fff;
  display: flex;
  justify-content: center;
}

.btn-wish i {
  padding-right: 10px;
}

.btn-wish .bi-heart,
.btn-wish .bi-heart-fill {
  font-size: 1.1rem;
}

/*=====*/

.product-describe {
  padding: 0;
  max-width: 1300px;
  margin: 50px auto 110px auto;
  padding: 0 12px;
}

.product-content {
  margin-top: 15px;
  padding: 20px 0px;
}

@media (min-width: 992px) {
  .breadcrumb {
    margin-bottom: 50px;
    padding-left: 0;
  }

  .product-title {
    margin-top: 0px;
  }

  .product-describe {
    padding: 0px;
  }
}

/* 相關商品
===============================*/

.other-product-inner {
  padding: 50px 0px;
  max-width: 1300px;
  border-radius: 20px;
  text-align: center;
  margin: auto;
}

.other-product-title {
  max-width: 1300px;
  margin: auto;
  padding: 0 12px;
}

@media (min-width: 992px) {
  .other-product-inner {
    padding: 50px 6px;
  }

  .other-product-title {
    padding: 0px;
  }
}

/* 輪播
===============================*/

.swiper_main {
  position: relative;
  padding: 0 6px;
}

.swiper {
  width: 97%;
  max-width: 1142px;
  height: 100%;
}

.swiper-slide {
  font-size: 18px;
  background: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-button {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  z-index: 1;
}

.swiper-button span {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  background-size: 40%;
  background-position: center;
}

.swiper-button span:hover {
  opacity: 0.8;
}

.swiper-button-prev2 {
  background: url("../assets/caret-left-fill.svg") #5d4c46 no-repeat;
  cursor: pointer;
}

.swiper-button-next2 {
  background: url("../assets/caret-right-fill.svg") #5d4c46 no-repeat;
  cursor: pointer;
}

@media (min-width: 1200px) {
  .swiper-button span {
    width: 50px;
    height: 50px;
  }
}
</style>
