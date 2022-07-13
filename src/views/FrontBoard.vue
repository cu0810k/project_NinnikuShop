<template>
  <router-view />
  <Footer />
</template>

<script>
import Footer from '@/components/FooterCom.vue'

export default {
  name: 'HomeView',
  components: {
    Footer
  }
}
</script>

<style>
body,
html {
  font-size: 14px;
}

@media (min-width: 992px) {
  body,
  html {
    font-size: 16px;
  }
}

a {
  text-decoration: none;
}

main {
  background: #ffea42;
}

.top_pic {
  padding: 100px 20px 0 20px;
}

.top_pic img {
  display: block;
  margin: auto;
  position: relative;
  z-index: 1;
}

.top_pic::after {
  content: "";
  background-color: #d50000;
  width: 100%;
  display: block;
  height: 400px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

@media (min-width: 992px) {
  .top_pic {
    padding-top: 100px;
  }
}

.bi-heart {
  color: #000;
  display: block;
  text-align: center;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
}

.card-list .card {
  margin: 12px 0;
}

.card-body {
  padding: 0.5rem 0.5rem;
  padding-bottom: 4rem;
  text-align: left;
}

.card-title {
  text-decoration: none;
  display: block;
  color: #000;
  font-weight: bold;
}

.card-price {
  color: #d50000;
}

@media (min-width: 992px) {
  .card-body {
    padding: 1rem 1rem;
  }
}

/* 滑到商品顯示
===============================*/

.add_to_wishlist {
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  width: 40px;
  height: 40px;
  font-size: 18px;
  text-align: center;
  border-radius: 50%;
  margin: 0.5rem;
  cursor: pointer;
}

.add_to_wishlist::before {
  line-height: 40px;
  position: absolute;
  top: 2px;
  width: 100%;
  left: 0;
}

.add_to_cart {
  background: #ffe900;
  border-radius: 3px;
  color: #333;
  width: calc(100% - 20px);
  text-decoration: none;
  text-align: center;
  padding: 5px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  opacity: 1;
  transition: 0.3s;
  font-size: 0.8rem;
}

@media (min-width: 992px) {
  .card:hover .add_to_wishlist,
  .card:hover .add_to_cart {
    opacity: 1;
    transition: 0.3s;
  }

  .card-pic {
    position: relative;
  }

  .card-pic::before {
    content: "";
    background: transparent;
  }

  .card:hover .card-pic::before {
    content: "";
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: 0.3s;
  }

  .add_to_wishlist {
    opacity: 0;
  }

  .add_to_cart {
    opacity: 0;
    font-size: 1rem;
  }
}

.add_to_cart:hover {
  background-color: #d50000;
  color: #fff;
  transition: 0.3s;
}

@media (min-width: 992px) {
  .add_to_cart {
    padding: 10px;
  }
}

/* 進度條
===============================*/

.step {
  display: flex;
  justify-content: center;
  padding: 0;
}

.step-status {
  color: #5d4c46;
  text-align: center;
  position: relative;
  font-size: 0.8rem;
  opacity: 0.6;
}

.step-status.finish {
  opacity: 1;
}

.step-status span {
  display: block;
  font-size: 0.8rem;
  width: 45px;
  height: 45px;
  line-height: 48px;
  margin: 0 20px;
  margin-bottom: 5px;
  background: url("../assets/ninniku.svg") no-repeat;
  background-position: center;
  color: #fff;
  font-weight: bold;
  position: relative;
}

.step-fill span::before,
.step-fill span::after {
  content: "";
  display: block;
  width: 40px;
  height: 2px;
  background-color: #8b7872;
  position: absolute;
  top: 60%;
}

.step-fill span::before {
  left: -40px;
}

.step-fill span::after {
  right: -40px;
}

@media (min-width: 768px) {
  .step-status span {
    width: 50px;
    height: 50px;
    line-height: 58px;
    margin: 0 50px;
  }

  .step-fill span::before,
  .step-fill span::after {
    width: 100px;
  }
  .step-fill span::before {
    left: -100px;
  }

  .step-fill span::after {
    right: -100px;
  }
}

@media (min-width: 992px) {
  .step-status {
    font-size: 1rem;
  }

  .step-status span {
    font-size: 1.5rem;
    width: 70px;
    height: 70px;
    line-height: 78px;
    margin: 0 100px;
  }

  .step-fill span::before,
  .step-fill span::after {
    width: 200px;
  }
  .step-fill span::before {
    left: -200px;
  }

  .step-fill span::after {
    right: -200px;
  }
}
</style>
