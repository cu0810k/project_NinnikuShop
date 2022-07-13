// import emitter from '@/libs/emitter.js'

export default {
  data () {
    return {
      wishProduct: JSON.parse(localStorage.getItem('wishProduct')) || []
    }
  },
  watch: {
    wishProduct: {
      handler () {
        localStorage.setItem('wishProduct', JSON.stringify(this.wishProduct))
        // emitter.emit('update-wish', this.wishProduct.length)
        // this.$mitt.emit('update-wish', this.wishProduct.length)

        this.$mitt.emit('update-count', this.wishProduct.length)
      },
      deep: true
    }
  },
  methods: {
    addToWish (id) {
      // console.log(id)
      const res = this.wishProduct.indexOf(id)
      if (res === -1) {
        this.wishProduct.push(id)
      } else {
        this.wishProduct.splice(res, 1)
      }
      // console.log(this.wishProduct)
    }
  }
}
