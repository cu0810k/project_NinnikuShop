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
            <div class="col-12 order-accordion">
              <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingOne">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                    >
                      <span> 合計：{{ $currency(order.total) }} </span>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div>
                      <div class="cart-list-title">
                        <div class="data">商品資料</div>
                        <div class="unitPrice d-none d-sm-block">單價</div>
                        <div class="count d-none d-sm-block">數量</div>
                        <div class="totalPrice d-none d-sm-block">小計</div>
                      </div>
                      <div class="cart_list">
                        <template v-for="item in order.products" :key="item.id">
                          <div class="cart-list-item"
                            v-show="item.product.category !== '運費'">
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
                            <div class="unitPrice">
                              {{ $currency(item.product.price) }}
                            </div>
                            <div class="count">
                              <span class="mb-show">數量 :</span>
                              {{ item.qty }}
                            </div>
                            <div class="totalPrice">
                              <span class="d-sm-none">小計</span>
                              {{ $currency(item.total) }}
                            </div>
                          </div>
                        </template>
                        <div class="cart-footer">
                          <div>小計 : {{ $currency(order.total) }}</div>
                          <div>運費 : {{ $currency(fare) }}</div>
                          <div>
                            優惠碼 : {{ couponCode }}
                            <span style="color: #777">
                              享{{ couponCode.replace(/[^0-9]/gi, "") }}折
                            </span>
                          </div>
                          <div>合計 : {{ $currency(order.total) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4 order-form">
              <h3>訂單資訊</h3>
              <div class="order-form-inner">
                <div class="p-1 sum">
                  <span>訂單號碼：</span>
                  <span>{{ order.id }}</span>
                </div>
                <div class="p-1 sum">
                  <span>訂單日期：</span>
                  <span>{{ localDate }}</span>
                </div>
                <div class="p-1 sum">
                  <span>訂單狀態：</span>
                  <span>處理中</span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4 order-data">
              <h3>送貨資訊</h3>
              <div class="order-data-inner">
                <div class="p-1 sum">
                  <span>收件人名稱：</span>
                  <span>{{ order.user.name }}</span>
                </div>
                <div class="p-1 sum">
                  <span>收件人電話：</span>
                  <span>{{ order.user.tel }}</span>
                </div>
                <div class="p-1 sum">
                  <span>送貨方式：</span>
                  <span>{{ order.user.tote }}</span>
                </div>
                <div class="p-1 sum">
                  <span>送貨地址：</span>
                  <span>{{ order.user.address }}</span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4 order-pay">
              <h3>付款資訊</h3>
              <div class="order-pay-inner">
                <div class="p-1 sum">
                  <span>付款方式：</span>
                  <span>{{ order.user.pay }}</span>
                </div>
                <div class="p-1 sum">
                  <span>付款狀態：</span>
                  <span>未付款</span>
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
  name: 'CartView',
  data () {
    return {
      id: '',
      order: {
        user: {}
      },
      fare: 0,
      couponCode: '',
      localDate: '',
      isLoading: false
    }
  },
  components: {
    NavBar
  },
  methods: {
    getOrderData () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.isLoading = true

      this.$http.get(`${url}/api/${path}/order/${this.id}`)
        .then(res => {
          // 取得訂單
          this.order = res.data.order
          // 將訂單日期轉換
          const localDate = new Date(res.data.order.create_at * 1000)
          this.localDate = localDate.toLocaleDateString()
          // 取得運費
          this.getFare(res.data.order.products)
          // 取的優惠券
          this.getCoupon(res.data.order.products)
          console.log(res.data.order)
          this.isLoading = false
        })
        .catch(err => {
          console.dir(err.response)
        })
    },
    getFare (orderProducts) {
      const res = Object.entries(orderProducts)
      console.log(res)
      // console.log(res[0][1].product.category)

      // res.forEach((item, index) => {
      //   console.log(item[1].product.category)
      // })

      let arr = res.filter(item => item[1].product.category === '運費')
      console.log(arr)
      if (arr.length !== 0) {
        arr = [].concat.apply([], arr)
        this.fare = arr[1].final_total
      }
    },
    getCoupon (orderProducts) {
      const res = Object.entries(orderProducts)
      if (!res[0][1].coupon) {
        return console.log('沒有優惠券')
      }
      this.couponCode = res[0][1].coupon.code
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getOrderData()
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

/* 購物車 */
.accordion-button {
  background: #fff;
  color: #000;
}

.accordion-button span {
  width: 100%;
  text-align: center;
}

.accordion-button:focus {
  border-color: transparent;
  box-shadow: 0 0 0 0 transparent;
}

.accordion-button:not(.collapsed)::after {
  filter: grayscale(100%);
}

.order-accordion,
.order-form,
.order-data,
.order-pay {
  margin: 20px 0;
}

@media (min-width: 768px) {
  .order-accordion,
  .order-form,
  .order-data,
  .order-pay {
    margin: 30px 0;
  }
}

@media (min-width: 992px) {
  .order-accordion {
    padding: 0 20px;
  }
}

/* 單筆項目 */
.accordion-button:not(.collapsed) {
  box-shadow: 0 0 0;
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
  margin: 0px 0 0 0;
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
  width: 72px;
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
  text-align: left;
  line-height: 30px;
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
    width: 40%;
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
    width: 35%;
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
    text-align: center;
  }

  .cart-list-title .totalPrice,
  .cart-list-item .totalPrice {
    width: 20%;
    text-align: center;
  }
}

.cart-footer {
  padding: 10px;
}

.order-form-inner,
.order-data-inner,
.order-pay-inner {
  margin: 35px 0 0 0;
  border: 1px solid #dee2e6;
  padding: 10px;
  border-radius: 5px;
}
</style>
