<template>
  <VLoading :active="isLoading"></VLoading>
  <NavBar />
  <div class="top_pic">
    <img src="../assets/product_bg.png" alt="" class="img-fluid" />
  </div>
  <main id="main-products">
    <div class="container-fluid con-products">
      <div class="row justify-content-between">
        <div class="col-2 products-category">
          <ul>
            <span class="point"></span>
            <li
              :class="{ active: !pagination.category }"
              @click="getProducts()"
            >
              全部商品
            </li>
            <li
              :class="{ active: pagination.category === category }"
              v-for="category in productCategory"
              :key="category"
              @click="getProducts(1, category)"
            >
              {{ category }}
            </li>
          </ul>
        </div>
        <div class="col-12 col-lg-10 products-all">
          <div class="title">
            <h3 v-if="searchProduct.length !== 0">搜尋結果</h3>
            <h3 v-else>{{ pagination.category || "全部商品" }}</h3>
            <div class="products-search">
              <form class="d-flex">
                <i class="bi bi-search"></i>
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  v-model="search"
                />
              </form>
              <button
                class="btn-search"
                type="button"
                @click.prevent="searchProducts"
                :disabled="!search.replace(/\s/g, '')"
              >
                搜尋
              </button>
            </div>
          </div>
          <div class="products-list">
            <div class="card" v-for="product in products" :key="product.id">
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
                <span class="card-price">NT{{ product.price }}</span>
              </div>
            </div>
          </div>

          <ul class="pagination" v-if="searchProduct.length === 0">
            <li class="page-item" :class="{ disabled: !pagination.has_pre }">
              <a
                class="page-link"
                href="#"
                @click.prevent="
                  getProducts(pagination.current_page - 1, pagination.category)
                "
              >
                Previous
              </a>
            </li>
            <li
              class="page-item"
              :class="{ active: page === pagination.current_page }"
              v-for="(page, index) in pagination.total_pages"
              :key="index"
              @click.prevent="getProducts(page, pagination.category)"
            >
              <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.has_next }">
              <a
                class="page-link"
                href="#"
                @click.prevent="
                  getProducts(pagination.current_page + 1, pagination.category)
                "
              >
                Next
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
// import NavBar from '@/components/NavBar.vue'
import NavBar from '@/components/NavBar.vue'
import addToWish from '@/mixins/addToWish'
import addToCart from '@/mixins/addToCart'

export default {
  name: 'ProductsView',
  data () {
    return {
      productsAll: [],
      products: [],
      pagination: {},
      productCategory: [],
      search: '',
      searchProduct: [],
      isLoading: false
    }
  },
  mixins: [addToWish, addToCart],
  components: {
    NavBar
  },
  methods: {
    getProducts (page = 1, category) {
      this.searchProduct = []
      this.search = ''

      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu
      let apiUrl = `${url}/api/${path}/products?page=${page}` // 全部商品

      if (category) {
        apiUrl = `${url}/api/${path}/products?page=${page}&category=${category}`
      }

      this.isLoading = true

      this.$http.get(apiUrl)
        .then(res => {
          this.products = res.data.products
          this.pagination = res.data.pagination
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
    getCatgory () {
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu
      const apiUrl = `${url}/api/${path}/products/all` // 全部商品

      this.$http.get(apiUrl)
        .then(res => {
          // console.log(res.data.products)

          this.productsAll = res.data.products

          const allCategory = this.productsAll.map(function (item) {
            return item.category
          })

          // console.log('allText', allCategory)
          // ['手機周邊', '手機周邊',.....]

          this.productCategory = allCategory.filter(function (item, index, array) {
            return array.indexOf(item) === index
          })
          // console.log('productCategory', this.productCategory)
          // ['手機周邊', '文書用品', '包包提袋', '居家生活', '服裝配飾', '電腦周邊', '飾品配件']
          // https://ithelp.ithome.com.tw/articles/10242554
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    },
    searchProducts () {
      this.searchProduct = this.productsAll.filter(item => {
        return item.title.match(this.search.replace(/\s/g, ''))
      })

      // if (this.searchProduct.length === 0) {
      //   this.searchProduct = '404'
      // }

      // console.log('searchArr', this.searchProduct)
      this.products = this.searchProduct
      this.pagination.category = ''
    }
  },
  mounted () {
    this.getProducts(1, this.$route.params.category)
    this.getCatgory()
  }
}
</script>

<style scoped>
#main-products {
  padding-bottom: 90px;
}

.con-products {
  background-color: #fff;
  max-width: 1500px;
  margin: auto;
  border-radius: 10px;
  padding: 25px 12px;
  position: relative;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);

  padding: 13px 25px;
}

@media (min-width: 992px) {
  #product_all .navbar,
  #product_detail .navbar,
  #product_wish .navbar,
  #product_cart .navbar {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 0px;
  }

  /* .top_pic {
    padding-top: 100px;
  } */

  .con-products {
    padding: 50px;
  }
}

/* 商品分類
===============================*/
.products-category {
  display: none;
  /* width: 20%; */
  position: relative;
  margin-top: -100px;
}

.point {
  height: 100px;
  display: block;
  visibility: hidden;
  position: relative;
}

.products-category ul {
  padding-left: 0;
  position: sticky;
  top: 0;
}

.products-category ul li {
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}

.products-category ul li:hover {
  background: #d50000;
  color: #fff;
  transition: 0.3s;
}

.products-category ul li.active {
  background-color: #000;
  border-radius: 10px;
  color: #fff;
}

@media (min-width: 992px) {
  .products-category {
    display: block;
  }
}

/* 全部商品
===============================*/

.products-all {
  padding: 0;
}

.products-all .title {
  margin-top: 20px;
  margin-bottom: 25px;
  padding: 0 12px;
}

.products-all .title h3 {
  margin-bottom: 0;
  color: #5d4c46;
  position: relative;
  letter-spacing: 1.3px;
  text-align: center;
  display: inline-block;
  font-weight: bold;
}

.products-all .title h3::after {
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
  .products-all .title {
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

/*search*/
.products-search {
  display: flex;
  margin-top: 30px;
}

.products-search form {
  background-color: rgb(236, 236, 236);
  border-radius: 5px;
}

.bi-search {
  line-height: 36px;
  padding-left: 10px;
  color: rgb(82, 82, 82);
}

.products-search .form-control {
  border: 0px solid #ced4da;
  border-bottom: 0px solid rgb(175, 175, 175);
  border-radius: 0rem;
  background-color: rgb(236, 236, 236);
}

.products-search .form-control:focus {
  background-color: rgb(236, 236, 236);
}

.btn-search {
  display: block;
  width: 50px;
  border: 0;
  background: transparent;
  color:#212529;
}

@media (min-width: 768px) {
  .products-search {
    margin-top: 0px;
  }
}

/*-*/

.products-list {
  display: flex;
  flex-wrap: wrap;
}

.products-list .card {
  margin: 12px;
  width: calc(50% - 24px);
}

@media (min-width: 768px) {
  .products-list .card {
    width: calc(33.333333% - 24px);
  }
}

@media (min-width: 992px) {
  .products-list .card {
    width: calc(50% - 24px);
  }
}

@media (min-width: 1200px) {
  .products-list .card {
    width: calc(33.333333% - 24px);
  }
}

@media (min-width: 1400px) {
  .products-list .card {
    width: calc(25% - 24px);
  }
}

/* 分頁
===============================*/

.pagination {
  justify-content: center;
  margin-top: 30px;
}

.page-link {
  color: #000;
}

.page-item.active .page-link {
  z-index: 3;
  color: #fff;
  background-color: #000;
  border-color: #000;
}
</style>
