export default {
  data () {
    return {
      wishProduct: JSON.parse(localStorage.getItem('wishProduct')) || []
    }
  },
  methods: {
    addToCart (id, qty = 1) {
      // console.log(id)
      const url = process.env.VUE_APP_API // https://vue3-course-api.hexschool.io/v2
      const path = process.env.VUE_APP_PATH // vue_cu

      const data = {
        data: {
          product_id: id,
          qty: qty
        }
      }

      this.isLoading = true

      this.$http.post(`${url}/api/${path}/cart`, data)
        .then(res => {
          // console.log(res.data.message)
          // this.$mitt.emit('update-cart')
          this.isLoading = false
          this.$mitt.emit('update-count')
        })
        .catch(err => {
          console.dir(err.response.data.message)
        })
    }
  }
}
