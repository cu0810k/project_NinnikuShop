<template id="product_detail">
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <main id="main-cart">
    <div class="container-fluid con-cart">
      <div class="row justify-content-center">
        <div class="step">
          <div class="step-status step-confirm finish">
            <span>1</span>
            購物車
          </div>
          <div class="step-status step-fill">
            <span>2</span>
            填寫資料
          </div>
          <div class="step-status step-finish">
            <span>3</span>
            完成訂單
          </div>
        </div>
        <div class="con-cart-inner">
          <div class="row">
            <div class="col-12 order-content">
              <h3>購物車內容</h3>
              <p class="cart-list-title" v-if="carts.length == 0">
                購物車目前空空的QQ
              </p>
              <div class="order-content-inner" v-else>
                <div class="cart-list-title">
                  <div class="data">商品資料</div>
                  <div class="unitPrice d-none d-sm-block">單價</div>
                  <div class="count d-none d-sm-block">數量</div>
                  <div class="totalPrice d-none d-sm-block">小計</div>
                  <div class="btn_del d-none d-sm-block">刪除</div>
                </div>
                <div
                  class="cart-list-item"
                  v-for="item in carts"
                  :key="item.id"
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
                  <div class="unitPrice">
                    {{ $currency(item.product.price) }}
                  </div>
                  <div class="count">
                    <div class="input-group">
                      <div class="input-count-prepend"
                        @click="updateCart(item.id, item.qty - 1)">
                        <button class="btn" type="button">
                          -
                        </button>
                      </div>
                      <input class="form-control text-center input-count"
                        type="text"
                        placeholder=""
                        :value="item.qty"
                      />
                      <div class="input-count-append"
                        @click="updateCart(item.id, item.qty + 1)">
                        <button class="btn" type="button">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="totalPrice">
                    <span class="d-sm-none">小計</span>
                    {{ $currency(item.total) }}
                  </div>
                  <div class="btn_del" @click="delProduct(item.id)">
                    <i class="bi bi-trash"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 order-tote" v-show="carts.length !== 0">
              <h3>選擇送貨及付款方式</h3>
              <div class="order-tote-inner">
                <label for="tote" class="form-label">送貨方式</label>
                <select
                  class="form-select mb-2"
                  id="tote"
                  required=""
                  v-model="tote">
                  <option value="宅配">宅配 (送貨時間1-2工作日假日除外)</option>
                  <option value="離島宅配">離島宅配 (送貨時間3-4日)</option>
                </select>
                <label for="pay" class="form-label">付款方式</label>
                <select class="form-select" id="pay" required="" v-model="pay">
                  <option value="貨到付款">貨到付款</option>
                  <option value="線上付款">線上付款</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-md-6 order-data" v-show="carts.length !== 0">
              <h3>訂單資訊</h3>
              <div class="order-data-inner">
                <div class="p-1 sum">
                  <span>小計：</span>
                  <span>{{ $currency(final_total) }}</span>
                </div>
                <div class="p-1 order-data-fare">
                  <span
                    >運費：{{
                      final_total >= 666 ? $currency(0) : $currency(60)
                    }}</span
                  >
                  <div class="text-end" v-if="final_total < 666">
                    還差{{ $currency(666 - final_total) }}免運
                  </div>
                </div>
                <div class="p-1 order-data-coupon">
                  <div class="pb-1">優惠代碼</div>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Promo code"
                      v-model="couponCode"
                      ref="promoCode"
                    />
                    <button
                      v-if="!couponUse"
                      type="submit"
                      class="btn btn-secondary"
                      @click="addCouponCode"
                    >
                      套用
                    </button>
                    <button
                      v-else
                      type="submit"
                      class="btn btn-secondary"
                      @click="removeCouponCode"
                    >
                      移除
                    </button>
                  </div>
                  <span v-show="couponNG">此優惠代碼無效</span>
                </div>
                <div class="p-1 order-data-amount">
                  <span>合計：</span>
                  <span v-if="!couponUse">
                    {{
                      final_total >= 666
                        ? $currency(final_total)
                        : `${$currency(final_total + 60)}`
                    }}
                  </span>
                  <span v-else>{{ $currency(final_total_coupon) }}</span>
                </div>
                <button type="button" class="btn btn-next" @click="createOrder">
                  前往結帳
                </button>
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
      total: 0,
      final_total: 0,
      final_total_coupon: 0,
      couponCode: '',
      couponUse: false,
      couponNG: false,
      fare: 0,
      tote: '宅配',
      pay: '貨到付款',
      isLoading: false
    }
  },
  components: {
    NavBar
  },
  watch: {
    final_total () {
      if (this.final_total < 666) {
        this.fare = 60
      } else {
        this.fare = 0
      }
      this.addCouponCode()
    }
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
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    updateCart (id, qty) {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      // 當被扣到數量=0，直接刪除該品項
      if (!qty) {
        this.$http.delete(`${url}/api/${path}/cart/${id}`)
          .then(res => {
            console.log(res)
            return this.getCart()
          })
          .catch(err => {
            console.dir(err.response.data.message)
          })
      }

      const data = {
        product_id: id,
        qty: qty
      }

      this.$http.put(`${url}/api/${path}/cart/${id}`, { data })
        .then(res => {
          this.getCart()
          console.log(res)
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    createOrder () {
      const data = {
        fare: this.fare,
        tote: this.tote,
        pay: this.pay,
        couponCode: this.couponCode || ''
      }

      console.log(data)
      this.$router.push('/checkout')
      localStorage.setItem('orderData', JSON.stringify(data))
    },
    delProduct (id) {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      this.$http.delete(`${url}/api/${path}/cart/${id}`)
        .then(res => {
          console.log(res)
          this.getCart()
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    addCouponCode () {
      let fare = 0
      if (this.final_total < 666) {
        fare = 60
      }

      switch (this.couponCode) {
        case 'Ninniku75':
          this.final_total_coupon = (this.final_total + fare) * 0.75
          this.couponUse = true
          this.couponNG = false
          this.$refs.promoCode.disabled = true
          break
        case 'Ninniku85':
          this.final_total_coupon = (this.final_total + fare) * 0.85
          this.couponUse = true
          this.couponNG = false
          this.$refs.promoCode.disabled = true
          break
        case 'Ninniku90':
          this.final_total_coupon = (this.final_total + fare) * 0.9
          this.couponUse = true
          this.couponNG = false
          this.$refs.promoCode.disabled = true
          break
        case '':
          this.couponNG = false
          break
        default:
          this.couponNG = true
          this.couponUse = false
          break
      }
    },
    removeCouponCode () {
      this.couponCode = ''
      this.couponUse = false
      this.$refs.promoCode.disabled = false
    }
  },
  mounted () {
    this.getCart()
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

.input-group {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  max-width: 200px;
  height: 30px;
  margin: auto;
}
.input-group .btn {
  padding: 0 0.5rem;
  box-sizing: border-box;
}

.input-group input {
  border: 1px solid #d8d8d6;
}

/*-----*/

#main-cart {
  padding-bottom: 50px;
  padding-top: 99px;
}

#main-cart::after {
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

.con-cart {
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
  #main-cart {
    padding-top: 152px;
    padding-bottom: 90px;
  }

  .con-cart {
    padding: 50px;
  }
}

/* 購物車 */
.order-content,
.order-tote,
.order-data {
  margin: 20px 0;
}

@media (min-width: 768px) {
  .order-content,
  .order-tote,
  .order-data {
    margin: 30px 0;
  }
}

/* 購物車內容 */
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
  margin: 35px 0 0 0;
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

.input-count-prepend,
.input-count-append {
  border: 1px solid #d8d8d6;
  border-radius: 5px;
}

.input-count {
  padding: 0;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .input-count {
    font-size: 1rem;
  }
}

.cart-list-title .totalPrice,
.cart-list-item .totalPrice {
  width: 40%;
  text-align: right;
  padding-right: 10px;
}

.cart-list-item .btn_del {
  position: absolute;
  top: 10px;
  right: 10px;
}

.bi-trash {
  color: #d50000;
  padding: 0 5px;
  border: 1px solid #d50000;
  border-radius: 5px;
  cursor: pointer;
  transition: .3s;
}

.bi-trash:hover{
  color:#fff;
  background: #d50000;
  transition: .3s;
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
    width: 10%;
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

  .btn_del {
    width: 10%;
  }

  .cart-list-item .btn_del {
    top: 0;
    right: 0;
    position: relative;
  }
}

/* 選擇送貨及付款方式 */
/* 訂單資訊 */

.order-tote-inner,
.order-data-inner {
  margin: 35px 0 0 0;
  border: 1px solid #dee2e6;
  padding: 10px;
  border-radius: 5px;
}

.order-data-amount {
  border-top: 1px solid #dee2e6;
  margin: 10px 0 5px 0;
}

.order-data-coupon .input-group {
  margin-top: 5px;
  max-width: 100%;
}

.btn-next {
  background: #5cb85c;
  color: #fff;
  text-align: center;
  width: 100%;
}
</style>
