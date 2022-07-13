<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view />
</template>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css");

@import url("https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+TC:wght@400;500;700;900&display=swap");
@import url(https://fonts.googleapis.com/earlyaccess/cwtexyen.css);

body {
  position: relative;
  font-family: "Noto Sans TC", sans-serif;
  background: #000;
}

ul li {
  list-style: none;
}

.page-link:focus {
    outline: 0;
    box-shadow: 0 0 0 0 #000;
    background: transparent;
}

.btn-check:focus + .btn,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.form-control:focus {
  border-color: #d8d8d6;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

</style>
