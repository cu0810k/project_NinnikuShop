<template id="product_detail">
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <main id="main-checkout">
    <div class="container-fluid con-checkout">
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
          <div class="step-status step-finish">
            <span>3</span>
            完成訂單
          </div>
        </div>
        <div class="con-checkout-inner">
          <div class="row">
            <div class="col-12 col-md-6 order-data" v-show="carts.length !== 0">
              <h3>訂單內容</h3>
              <div class="order-data-inner">
                <div class="mb-2">購物車（{{ carts.length }}件）</div>
                <div class="cart-list-title">
                  <div class="data">商品資料</div>
                  <div class="unitPrice d-none d-sm-block">單價</div>
                  <div class="count d-none d-sm-block">數量</div>
                  <div class="totalPrice d-none d-sm-block">小計</div>
                </div>
                <div class="cart-list-item"
                  v-for="item in carts"
                  :key="item.id">
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
                <div class="p-1 sum">
                  <span>小計：</span>
                  <span>{{ $currency(final_total) }}</span>
                </div>
                <div class="p-1 sum">
                  <span>運費：</span>
                  <span>{{ $currency(fare) }}</span>
                </div>
                <div class="p-1 sum">
                  <span>優惠碼：</span>
                  <span>{{ couponCode }}</span>
                  <span style="color: #777">
                    享{{ couponCode.replace(/[^0-9]/gi, "") }}折
                  </span>
                </div>
                <div class="p-1 sum">
                  <span>合計：</span>
                  <span>{{ $currency(tempTotal) }}</span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 order-tote" v-show="carts.length !== 0">
              <h3>送貨資料</h3>
              <div class="order-tote-inner">
                <v-Form v-slot="{ errors, validate }" @submit="cartEnd">
                  <!-- {{ errors }} {{ values }} -->
                  <div class="mb-3">
                    <label for="consigneeName" class="form-label">
                      收件人名稱
                    </label>
                    <v-Field id="consigneeName"
                      name="姓名"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['姓名'] }"
                      placeholder="請輸入姓名"
                      rules="required"
                      v-model="consigneeForm.user.name"
                    ></v-Field>
                    <error-message
                      name="姓名"
                      class="invalid-feedback"
                    ></error-message>
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">
                      收件人電子信箱
                    </label>
                    <v-Field
                      id="email"
                      name="信箱"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors['信箱'] }"
                      placeholder="請輸入 Email"
                      rules="email|required"
                      v-model="consigneeForm.user.email"
                    ></v-Field>

                    <error-message
                      name="信箱"
                      class="invalid-feedback"
                    ></error-message>
                  </div>

                  <div class="mb-3">
                    <label for="consigneeTel" class="form-label">
                      收件人電話號碼
                    </label>
                    <v-Field
                      id="consigneeName"
                      name="電話"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['電話'] }"
                      placeholder="請輸入姓名"
                      rules="required|min:8|max:10"
                      v-model="consigneeForm.user.tel"
                    ></v-Field>
                    <error-message
                      name="電話"
                      class="invalid-feedback"
                    ></error-message>
                  </div>
                  <div class="mb-3">
                    <label for="consigneeAddress" class="form-label">
                      收件人地</label>
                    <v-Field
                      id="consigneeEmail"
                      name="地址"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors['地址'] }"
                      placeholder="請輸入 地址"
                      rules="required"
                      v-model="consigneeForm.user.address"
                    ></v-Field>
                    <error-message
                      name="地址"
                      class="invalid-feedback"
                    ></error-message>
                  </div>
                  <button type="submit" class="btn btn-next" @click="validate">
                    提交訂單
                  </button>
                  <router-link class="nav-link" to="/cart">
                    返回購物車
                  </router-link>
                </v-Form>
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
      products: [],
      carts: [],
      final_total: 0,
      total: 0,
      couponCode: '',
      fare: false,
      pay: '貨到付款',
      tote: '宅配',
      tempTotal: 0,
      consigneeForm: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      isLoading: false
    }
  },
  components: {
    NavBar
  },
  methods: {
    getCart () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.isLoading = true

      this.$http.get(`${url}/api/${path}/cart`)
        .then(res => {
          this.carts = res.data.data.carts
          this.final_total = res.data.data.final_total
          this.total = res.data.data.total
          console.log(res)
          this.isLoading = false

          this.countTempTotal()
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    countTempTotal () {
      switch (this.couponCode) {
        case 'Ninniku75':
          this.tempTotal = (this.final_total + this.fare) * 0.75
          break
        case 'Ninniku85':
          this.tempTotal = (this.final_total + this.fare) * 0.85
          break
        case 'Ninniku90':
          this.tempTotal = (this.final_total + this.fare) * 0.9
          break
        default:
          this.tempTotal = this.final_total + this.fare
          break
      }
    },
    addToCart (id) {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      const data = {
        data: {
          product_id: id,
          qty: 1
        }
      }

      this.$http.post(`${url}/api/${path}/cart`, data)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    addFare () {
      // 加運費之前必須確保表格都填正確
      // 才能避免最後訂單的部分建立失敗

      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      const data = {
        data: {
          product_id: '-N6i1qTb53JNo27jsmeD',
          qty: 1
        }
      }

      this.$http.post(`${url}/api/${path}/cart`, data)
        .then(res => {
          console.log(res)
          // 加完運費後判斷有沒有優惠券
          if (this.couponCode) {
            this.addCoupon(this.couponCode)
          } else {
            this.createOrder()
          }
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    addCoupon (couponCode) {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      const data = {
        code: couponCode
      }
      this.$http.post(`${url}/api/${path}/coupon`, { data })
        .then(res => {
          console.log(res)
          this.createOrder()
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    cartEnd () {
      console.log('提交')
      // 購物車做最後的整理
      // 運費  -N6i1qTb53JNo27jsmeD
      if (this.fare) {
        this.addFare()
      } else if (this.couponCode) {
        this.addCoupon(this.couponCode)
      } else {
        this.createOrder()
      }
    },
    createOrder () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.consigneeForm.user.tote = this.tote
      this.consigneeForm.user.pay = this.pay

      // console.log(this.consigneeForm)

      const data = this.consigneeForm
      this.$http.post(`${url}/api/${path}/order`, { data })
        .then((res) => {
          // this.$refs.form.resetForm()
          console.log(res)
          this.getOrder()
          this.$router.push(`/order/${res.data.orderId}`)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getOrder () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.$http.get(`${url}/api/${path}/orders`)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getCart()
    const orderData = JSON.parse(localStorage.getItem('orderData'))
    this.couponCode = orderData.couponCode
    this.fare = orderData.fare
    this.pay = orderData.pay
    this.tote = orderData.tote
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
#main-checkout {
  padding-bottom: 50px;
  padding-top: 99px;
}

#main-checkout::after {
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

.con-checkout {
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
  #main-checkout {
    padding-top: 152px;
    padding-bottom: 90px;
  }

  .con-checkout {
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
}

.cart-list-item .count {
  line-height: 30px;
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
    width: 50%;
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
    width: 40%;
    margin-left: 0;
    padding-left: 20px;
  }

  .cart-list-title .unitPrice,
  .cart-list-item .unitPrice {
    width: 10%;
    margin-left: 0;
    text-align: center;
  }

  .cart-list-title .count,
  .cart-list-item .count {
    width: 20%;
    margin-left: 0;
  }

  .cart-list-title .totalPrice,
  .cart-list-item .totalPrice {
    width: 10%;
    text-align: center;
    padding-right: 0px;
  }
}

.btn-next {
  background: #5cb85c;
  color: #fff;
  text-align: center;
  width: 100%;
}
</style>
