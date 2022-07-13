<template id="product_detail">
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <div class="top_pic">
    <img src="../assets/product_bg.png" alt="" class="img-fluid" />
  </div>

  <main id="main-wishList">
    <div class="container-fluid con-wishList">
      <div class="row justify-content-center">
        <div class="wishList-inner">
          <h3>追蹤清單</h3>
          <div class="pic" v-if="wishProduct.length === 0">
            <img src="../assets/noProduct.png" alt="" class="img-fluid">
          </div>
          <div v-else>
            <table class="table table-hover align-middle wishList-table">
              <thead>
                <tr>
                  <th scope="col">商品圖片</th>
                  <th scope="col">商品名稱</th>
                  <th scope="col">價格</th>
                  <th scope="col">刪除</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in tempFavProduct" :key="product.id">
                  <td>
                    <img
                      :src="product.imageUrl"
                      :alt="product.title"
                      class="img-fluid"
                    />
                  </td>
                  <td>
                    <RouterLink :to="`/product/${product.id}`">
                      {{ product.title }}
                    </RouterLink>
                  </td>
                  <td>{{ $currency(product.price) }}</td>
                  <td>
                    <!-- https://v1-cn.vuejs.org/guide/forms.html -->
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="checkboxNoLabel"
                      :value="product.id"
                      v-model="temDelProduct"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="btn-delGroup">
              <button type="button" class="btn" @click="selectAll">全選</button>
              <button type="button" class="btn" @click="DelFavProduct">
                刪除
              </button>
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

export default {
  name: 'ProductsView',
  data () {
    return {
      products: [],
      tempFavProduct: [],
      temDelProduct: [],
      isLoading: false
    }
  },
  mixins: [addToWish],
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
          // console.log(res)
          this.FavProducts()
          this.isLoading = false
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    FavProducts () {
      this.wishProduct.forEach(item => {
        this.tempFavProduct.push(this.products.filter((value, index, arrSelf) => {
          return this.products[index].id === item
        }))
      }) // [[],[],[]]
      // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
      this.tempFavProduct = this.tempFavProduct.flat()
    },
    DelFavProduct (id) {
      // https://www.796t.com/post/NmF5MzI=.html
      this.wishProduct = this.wishProduct.filter(id => {
        return !this.temDelProduct.includes(id)
      }
      )
      this.tempFavProduct = []
      this.FavProducts()
    },
    selectAll () {
      console.log('selectAll')
      this.temDelProduct = [...this.wishProduct]
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>

<style scoped>
/* 追蹤清單
===============================*/
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

#main-wishList {
  padding-bottom: 90px;
}

.con-wishList {
  background-color: #fff;
  max-width: 1500px;
  margin: auto;
  border-radius: 10px;
  padding: 25px 12px;
  position: relative;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
}

@media (min-width: 992px) {
  .con-wishList {
    padding: 50px;
  }
}

/*-----*/
.wishList-inner .pic{
  margin: 50px 0;
  text-align: center;
}

.wishList-inner .pic img{
  width: 600px;
}

.table > :not(:first-child) {
  border-top: 0;
}

.wishList-table,
.wishList-inner p {
  margin: 35px 0 20px 0;
  text-align: center;
}

.wishList-table thead {
  background: #5d4c46;
  border: 0;
}

.wishList-table thead tr th {
  color: #fff;
  font-weight: normal;
}

.wishList-table thead tr th:nth-child(1) {
  width: 80px;
}

.wishList-table thead tr th:nth-child(3) {
  max-width: 100px;
}

.wishList-table thead tr th:nth-child(4) {
  max-width: 100px;
}

.wishList-inner a{
  color:#000;
}

@media (min-width: 992px) {
  .wishList-inner {
    padding: 0 20px;
  }

  .wishList-table thead tr th:nth-child(1) {
    width: 150px;
  }
}

/*-----*/

.btn-delGroup {
  display: flex;
  justify-content: center;
}

.btn-delGroup .btn {
  background: #5d4c46;
  border: 0;
  margin: 0 10px;
  color: #fff;
}

.btn-delGroup .btn:hover {
  background: #666666;
  color: #fff;
}
</style>
