<template>
  <nav class="navbar navbar-expand-lg fixed-top" id="navbar" ref="navBar">
    <a class="navbar-brand" href="#">
      <img src="../assets/logo.svg" alt="" class="img-fluid" />
    </a>
    <ul class="navbar-btn">
      <li class="collect">
        <router-link to="/wishList">
          <i class="bi bi-heart"></i>
          <span class="count">{{ wishCount }}</span>
        </router-link>
      </li>
      <li class="cart">
        <router-link to="/cart">
          <i class="bi bi-cart"></i>
          <span class="count">{{ cartCount }}</span>
        </router-link>
      </li>
      <li class="d-lg-none ham">
        <a class="" href="#" @click.prevent="open">
          <i class="bi bi-list"></i>
        </a>
      </li>
    </ul>

    <div
      class="collapse navbar-collapse"
      id="navbarNavDropdown"
      ref="navbarNavDropdown"
    >
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <!-- <a class="nav-link" href="#">全部商品</a> -->
          <router-link class="nav-link" to="/products"> 全部商品 </router-link>
        </li>
        <li class="nav-item">
          <!-- <a class="nav-link" href="#">訂單查詢</a> -->
          <router-link class="nav-link" to="/order"> 訂單查詢 </router-link>
        </li>
        <!-- <li class="nav-item">
          <a class="nav-link" href="#">常見問題</a>
          <router-link class="nav-link" to="/faq"> 常見問題 </router-link>
        </li> -->
      </ul>
    </div>
  </nav>
</template>

<script>
import Collapse from 'bootstrap/js/dist/collapse'
import addToWish from '@/mixins/addToWish'

export default {
  name: 'NavBar',
  data () {
    return {
      bsCollapse: {},
      nav: {
        classList: ''
      },
      wishCount: 0,
      cartCount: 0,
      carts: []
    }
  },
  mixins: [addToWish],
  methods: {
    handleScroll () {
      const scrollPostionY = window.pageYOffset
      // console.log(scrollPostionY)
      // console.log(this.$refs.navBar)

      const nav = document.querySelector('#navbar')

      if (scrollPostionY > 0) {
        nav.classList.add('is-scroll')
      } else {
        nav.classList.remove('is-scroll')
      }
    },
    open () {
      this.bsCollapse.toggle()
    },
    updateCount () {

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
    window.addEventListener('scroll', this.handleScroll, true)
    const myCollapse = this.$refs.navbarNavDropdown
    const bsCollapse = new Collapse(myCollapse, {
      toggle: false
    })
    this.bsCollapse = bsCollapse

    // 讀取收藏商品數量
    this.wishCount = this.wishProduct.length
    // 監聽收藏
    // this.$mitt.on('update-wish', (msgData) => (this.wishCount = msgData))

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

<style>
.bi-heart,
.bi-list {
  color: #000;
}

/* navbar
===============================*/

.collect {
  background: #fde310;
  position: relative;
}

.cart {
  background: #000;
  position: relative;
}

.collect .count,
.cart .count {
  background: red;
  color: #fff;
  display: inline-block;
  border-radius: 100%;
  font-size: 0.5rem;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  position: absolute;
  top: 8px;
  right: 8px;
  overflow: hidden;
}

.ham a {
  /* background-color: #1745c8; */
  color: #000;
}

.navbar {
  margin: auto;
  background: #fff;
  padding: 0;
  overflow: hidden;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  /* border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px; */
}

.navbar.is-scroll {
  margin-top: 0;
  width: 100%;
  max-width: 100%;
  border-radius: 0px;
  /* border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px; */
  transition: 0.3s;
}

.navbar-brand {
  margin-right: 0;
  padding: 0 0.8rem;
  font-size: 0;
}

.navbar-brand img {
  width: 150px;
}

.navbar-expand-lg .navbar-nav .nav-link {
  color: #000;
  padding: 1.1rem 1.5rem;
}

.navbar-expand-lg .navbar-nav .nav-item:nth-child(even) .nav-link {
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
}

@media (min-width: 992px) {
  .collect .count,
  .cart .count {
    top: 15px;
    right: 8px;
  }

  .navbar {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 0px;
  }

  .navbar.is-scroll {
    border-radius: 0px;
  }

  .navbar-brand {
    padding: 0 1.3rem;
  }

  .navbar-expand-lg .navbar-nav .nav-item:nth-child(even) .nav-link {
    border-top: 0px solid #ededed;
    border-bottom: 0px solid #ededed;
    border-left: 1px solid #ededed;
    border-right: 1px solid #ededed;
  }
}

.navbar-btn {
  display: flex;
  margin-bottom: 0;
  padding-left: 0;
}

.navbar-btn a {
  display: block;
  padding: 0.8rem 1rem;
  display: flex;
  text-decoration: none;
  color: #fff;
}

.navbar-btn img {
  width: 20px;
}

@media (min-width: 992px) {
  .navbar-brand img {
    width: 247px;
  }

  .navbar-btn {
    order: 1;
  }

  .navbar-btn a {
    padding: 1.3rem;
  }
}
</style>
