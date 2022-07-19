<template id="product_detail">
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <main id="main-order">
    <div class="container-fluid con-order">
      <div class="row justify-content-center">
        <div class="step">
          <div class="step-status step-confirm finish">
            <span>1</span>
            購物車
          </div>
          <div class="step-status step-fill finish">
            <span>2</span>
            填寫資料
          </div>
          <div class="step-status step-finish finish">
            <span>3</span>
            完成訂單
          </div>
        </div>
        <div class="con-order-inner">
          <div class="row">
            <div class="col-12 col-md-6 order-data">
              <h3>訂單內容</h3>
              <div class="order-data-inner">
                <div class="mb-2">編號 : {{ order.id }}</div>
                <div class="cart-list-title">
                  <div class="data">商品資料</div>
                  <div class="count d-none d-sm-block">數量</div>
                  <div class="count d-none d-sm-block">小計</div>
                </div>
                <template v-for="item in order.products" :key="item.id">
                  <div
                    class="cart-list-item"
                    v-if="item.product.category !== '運費'"
                  >
                    <div class="pic">
                      <img
                        :src="item.product.imageUrl"
                        :alt="item.product.title"
                        class="img-fluid"
                      />
                    </div>
                    <div class="title">
                      {{ item.product.title }}
                    </div>
                    <div class="count">
                      <span class="mb-show">數量 :</span>
                      {{ item.qty }}
                    </div>
                    <div class="totalPrice">
                      <span class="d-sm-none">小計</span>
                      NT$ {{ item.final_total }}
                    </div>
                  </div>
                </template>
                <div class="p-1 sum">
                  <span>運送方式：</span>
                  <span>{{ user.tote }}</span>
                </div>
                <div class="p-1 sum">
                  <span>付款方式：</span>
                  <span>{{ user.pay }}</span>
                </div>
                <div class="p-1 sum">
                  <span>運費：</span>
                  <span>{{ $currency(fare) }}</span>
                </div>
                <div class="p-1 sum">
                  <span>總計：</span>
                  <span>{{ $currency(order.total) }}</span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 order-tote">
              <h3>運送資料</h3>
              <div class="order-data-inner">
                <div class="p-1 sum">
                  <span>收件人名稱 : {{ user.name }}</span>
                </div>
                <div class="p-1 sum">
                  <span>收件人電話 : {{ user.tel }}</span>
                </div>
                <div class="p-1 sum">
                  <span>收件人地址 : {{ user.address }}</span>
                </div>
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

export default {
  name: 'OrderView',
  data () {
    return {
      id: '',
      couponCode: '',
      fare: false,
      isLoading: false,
      order: {},
      user: {}
    }
  },
  components: {
    NavBar
  },
  methods: {
    getOrder () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.isLoading = true

      this.$http.get(`${url}/api/${path}/order/${this.id}`)
        .then((res) => {
          // console.log(res)
          this.isLoading = false
          this.id = res.data.order.id
          this.order = res.data.order
          this.user = res.data.order.user
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getOrder()
    const orderData = JSON.parse(localStorage.getItem('orderData'))
    this.couponCode = orderData.couponCode
    this.fare = orderData.fare
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

.mb-show {
  display: inline;
}

@media (min-width: 576px) {
  .mb-show {
    display: none;
  }
}

/* 購物車
===============================*/
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

/* 訂單內容 */
/* 送貨資料 */
.order-data,
.order-tote {
  margin: 20px 0;
}

@media (min-width: 768px) {
  .order-data,
  .order-tote {
    margin: 30px 0;
  }
}

@media (min-width: 992px) {
  .order-data,
  .order-tote {
    padding: 0 20px;
  }
}

.order-data-inner,
.order-tote-inner {
  margin: 35px 0 0 0;
  border: 1px solid #dee2e6;
  padding: 10px;
  border-radius: 5px;
}

.cart-list-title,
.cart-list-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
  box-sizing: border-box;
  position: relative;
}

.cart-list-title {
  background: #5d4c46;
  color: #fff;
  text-align: center;
}

.cart-list-title .data {
  width: 100%;
}

.cart-list-item .pic {
  width: 30%;
  position: absolute;
  top: 0;
  left: 10px;
  text-align: left;
}

.cart-list-item .pic img {
  width: 63px;
  padding-top: 10px;
}

.cart-list-item .title {
  width: 60%;
  margin-left: 30%;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cart-list-title .unitPrice,
.cart-list-item .unitPrice {
  width: 60%;
  margin-left: 30%;
  text-align: left;
}

.cart-list-title .count,
.cart-list-item .count {
  width: 30%;
  margin-left: 30%;
}

.cart-list-item .count {
  text-align: left;
}

.cart-list-title .totalPrice,
.cart-list-item .totalPrice {
  width: 40%;
  text-align: right;
  padding-right: 10px;
}

@media (min-width: 576px) {
  .cart-list-title,
  .cart-list-item {
    padding: 10px;
  }

  .cart-list-title .data {
    width: 60%;
  }

  .cart-list-item .pic {
    width: 5%;
    position: relative;
    left: 0px;
  }

  .cart-list-item .pic img {
    width: auto;
    padding-top: 0px;
  }

  .cart-list-item .title {
    width: 55%;
    margin-left: 0;
    padding-left: 20px;
  }

  .cart-list-title .unitPrice,
  .cart-list-item .unitPrice {
    width: 20%;
    margin-left: 0;
    text-align: center;
  }

  .cart-list-title .count,
  .cart-list-item .count {
    width: 20%;
    margin-left: 0;
  }

  .cart-list-item .count {
    text-align: center;
  }

  .cart-list-title .totalPrice,
  .cart-list-item .totalPrice {
    width: 20%;
    text-align: center;
    padding-right: 0px;
  }
}
</style>
