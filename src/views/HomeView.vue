<template>
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <main>
    <div class="container-fluid wrap">
      <img src="../assets/wrap.png" alt="" class="img-fluid mx-auto d-block" />
    </div>
    <div class="promoCode">
      <p>
        <span>7/1~7/15</span>折扣優惠碼輸入「<strong>Ninniku75</strong>」
        全品項享75折
      </p>
    </div>
    <div id="main-index">
      <h2 class="best_seller">熱銷商品</h2>
      <div class="container-fluid con-product">
        <div class="row card-list">
          <template v-for="product in products" :key="product.id">
            <div class="col-6 col-md-4 col-lg-3" v-show="product.is_hot">
              <div class="card">
                <div class="card-pic">
                  <i
                    class="add_to_wishlist bi bi-heart-fill"
                    @click.prevent="addToWish(product.id)"
                    v-if="wishProduct.includes(product.id)"
                  >
                  </i>
                  <i
                    class="add_to_wishlist bi bi-heart"
                    @click.prevent="addToWish(product.id)"
                    v-else
                  >
                  </i>
                  <a
                    class="add_to_cart"
                    href="#"
                    @click.prevent="addToCart(product.id)"
                    >加入購物車</a
                  >
                  <img
                    :src="product.imageUrl"
                    class="card-img-top"
                    :alt="product.title"
                  />
                </div>
                <div class="card-body">
                  <a
                    class="card-title"
                    href="#"
                    @click.prevent="getProduct(product.id)"
                    >{{ product.title }}</a
                  >
                  <span class="card-price">NT {{ product.price }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <router-link class="btn_more" to="/products">VIEW MORE</router-link>
    </div>

    <div class="container-fluid con-service">
      <div class="row">
        <div class="col-sm-4 service_item">
          <div class="pic">
            <img src="../assets/滿額免運.png" alt="" class="img-fluid" />
          </div>
          <div class="txt">
            <span>滿額免運</span>
            <p>消費滿$666免運</p>
          </div>
        </div>
        <div class="col-sm-4 service_item">
          <div class="pic">
            <img src="../assets/快速出貨.png" alt="" class="img-fluid" />
          </div>
          <div class="txt">
            <span>快速配送</span>
            <p>24小時快速出貨</p>
          </div>
        </div>
        <div class="col-sm-4 service_item">
          <div class="pic">
            <img src="../assets/退換貨.png" alt="" class="img-fluid" />
          </div>
          <div class="txt">
            <span>退換貨保證</span>
            <p>商品退換貨保證</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import addToWish from '@/mixins/addToWish'
import addToCart from '@/mixins/addToCart'

export default {
  name: 'HomeView',
  data () {
    return {
      products: [],
      wishCount: 0,
      cartCount: 0,
      carts: [],
      isLoading: false
    }
  },
  mixins: [addToWish, addToCart],
  components: {
    NavBar
  },
  methods: {
    getProducts () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu
      this.isLoading = true
      this.$http.get(`${url}/api/${path}/products/all`)
        .then(res => {
          this.products = res.data.products
          this.isLoading = false
          // console.log(res)
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    getProduct (id) {
      this.$router.push(`/product/${id}`)
    },
    getCart () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.$http.get(`${url}/api/${path}/cart`)
        .then(res => {
          this.carts = res.data.data
          this.cartCount = this.carts.carts.length
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    }
  },
  mounted () {
    this.getProducts()

    // 讀取收藏商品數量
    this.wishCount = this.wishProduct.length

    // 監聽收藏
    // emitter.on('update-wish', (msgData) => (this.wishCount = msgData))
    this.$mitt.on('update-wish', (msgData) => (this.wishCount = msgData))

    // 抓取購物車資料
    this.getCart()

    // 監聽購物車
    // this.$mitt.on('update-cart', () => {
    //   this.getCart()
    // })

    // 合併監聽
    this.$mitt.on('update-count', (data) => {
      if (data === undefined) {
        this.getCart()
        console.log('更新購物車')
      } else {
        this.wishCount = data
        console.log('更新收藏')
      }
    })
  },
  beforeUnmount () {
    // 銷毁監聽
    this.$mitt.off('update-count')
  }
}
</script>

<style scoped>
/* navbar
===============================*/
.navbar {
  margin: auto;
}

.navbar.is-scroll {
  margin-top: 0;
  width: 100%;
  max-width: 100%;
  border-radius: 0px;
  transition: 0.3s;
}

@media (min-width: 992px) {
  .navbar {
    width: 90%;
    max-width: 900px;
    margin-top: 30px;
    border-radius: 15px;
  }

  .navbar.is-scroll {
    border-radius: 0px;
  }
}
/* wrap
===============================*/

.wrap {
  background: #da000d;
  padding: 115px 30px 50px 30px;
}

@media (min-width: 992px) {
  .wrap {
    padding-top: 165px;
  }
}

/* coupon
===============================*/

.promoCode {
  background-color: #000;
  background-position: center 15px;
  padding: 20px 15px;
  color: #fff;
}

.promoCode p {
  font-family: "Dela Gothic One", cursive;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 2.5px;
  margin-bottom: 0;
  transform: scale(1, 1.2);
}

.promoCode span {
  background: #fff;
  color: #000;
  padding: 0 10px;
  margin-right: 10px;
}

.promoCode strong {
  color: #fffc00;
}

@media (min-width: 992px) {
  .promoCode {
    font-size: 2rem;
    padding: 35px 15px;
  }

  .promoCode p {
    font-size: 1.8rem;
  }
}

/* 首頁-熱銷商品
===============================*/

#main-index {
  text-align: center;
  background-color: #ffe900;
  background-image: url(../assets/sec3_bg_pc2.jpg);
  padding: 80px 0;
  padding: 40px 0;
}

.best_seller {
  margin-bottom: 0;
  font-weight: 600;
  color: #5d4c46;
  position: relative;
  font-size: 1.5rem;
  position: relative;
  letter-spacing: 1.3px;
  display: inline-block;
  /* background-color: #000; */
  text-align: center;
  margin-bottom: 55px;
}

.best_seller::after {
  content: "";
  display: block;
  width: 60%;
  height: 3px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -15px;
  margin: auto;
  background: #5d4c46;
}

@media (min-width: 992px) {
  #main-index {
    padding: 100px 0;
  }

  .best_seller {
    font-size: 2.3rem;
  }
}

.con-product {
  text-align: center;
  padding: 13px 25px;
  max-width: 1300px;
  border-radius: 10px;
  background-color: #fff;
}

/*---*/

.btn_more {
  display: inline-block;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  background-color: #5d4c46;
  font-weight: 600;
  padding: 10px 40px;
  border-radius: 50px;
  position: relative;
  box-shadow: 0px 5px 0px 0px #52423c;
  margin-top: 40px;
}

.btn_more:hover {
  top: 5px;
  color: #fff;
  box-shadow: 0px 0px 0px 0px #52423c;
}

@media (min-width: 992px) {
  .btn_more {
    font-size: 1.3rem;
  }
}

/* service
===============================*/

.con-service {
  padding: 50px 15px;
  background-color: #fff;
}

.con-service .row {
  max-width: 1100px;
  margin: auto;
}

.service_item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
}

.service_item:nth-child(even) {
  margin: 20px 0;
}

.service_item .pic {
  width: 40%;
  flex-shrink: 0;
  align-self: center;
  text-align: center;
}

.service_item:nth-child(1) .pic img {
  width: 70%;
}

.service_item .pic img {
  width: 50%;
}

.service_item .txt {
  flex-grow: 1;
  text-align: left;
  padding-left: 20px;
  padding-top: 10px;
}

.service_item .txt span {
  font-size: 1.2rem;
  font-weight: bold;
}

@media (min-width: 576px) {
  .service_item:nth-child(even) {
    margin: 0;
  }

  .service_item .pic {
    width: 100%;
  }

  .service_item:nth-child(1) .pic img,
  .service_item .pic img {
    width: auto;
  }

  .service_item .txt {
    text-align: center;
    padding-left: 0px;
  }
}

@media (min-width: 992px) {
  .con-service {
    padding: 100px 15px;
  }

  .service_item {
    flex-wrap: nowrap;
    align-items: center;
  }

  .service_item .pic {
    width: auto;
    text-align: left;
  }

  .service_item .txt {
    flex-grow: 0;
    padding-left: 20px;
    text-align: left;
    padding-top: 0;
  }

  .service_item .txt span {
    font-size: 1.5rem;
  }
}
</style>
