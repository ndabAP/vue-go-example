<template>
  <div>
    <h2>Data</h2>
    <p>Let's generate some random data. Points represent the quantity of data points and multiplier is some kind of
      capacity. <b>Warning</b>: Remember that your browser might crash if you generate too many points!</p>

    <div id="data" style="width: 100%; height: 300px;"></div>

    <div class="grid -right">
      <div class="cell -4of12">
        <fieldset class="form-group">
          <label for="dataPoints">Points:</label>
          <input id="dataPoints" type="text" v-model="points" placeholder="Enter a number" class="form-control">
        </fieldset>
      </div>
      <div class="cell -4of12">
        <fieldset class="form-group">
          <label for="dataPoints">Multiplier:</label>
          <input id="dataPoints" type="text" v-model="multiplier" placeholder="Enter a number" class="form-control">
        </fieldset>
      </div>
      <div class="cell -4of12" style="display: flex; align-items: center; justify-content: center;">
        <button
          class="btn btn-default"
          @click="persistAndVisualize">
            Generate <span v-if="isLoading" class="loading"></span>
          </button>
      </div>
    </div>
  </div>
</template>

<script>
  /* global Contour */
  export default {
    data: () => ({
      isLoading: false,
      points: 100,
      multiplier: 10,

      chart: new Contour({
        el: '#data',
        line: {
          smooth: true,
          marker: { enable: false }
        }
      })
    }),

    async mounted () {
      await this.persistAndVisualize()
      window.addEventListener('resize', this.renderChart)
    },

    computed: {
      data: {
        get () {
          return this.$store.state.data
        }
      }
    },

    methods: {
      async createData ({ points, multiplier }) {
        return Array.from({ length: points }, () => Math.floor((Math.random() * multiplier) / Math.random()))
      },

      persistAndVisualize () {
        return new Promise(async resolve => {
          this.isLoading = true

          this.chart
            .cartesian()
            .line()

          const data = await this.createData({ points: this.points, multiplier: this.multiplier })
          this.$store.commit('SET_DATA', data)

          await this.$http.post('/api/persist', { data: this.$store.state.data })
          this.chart.setData(this.data).render()

          this.isLoading = false

          resolve()
        })
      },

      renderChart () {
        this.chart.render()
      }
    }
  }
</script>

<style>
  #data {
    overflow-x: auto;
  }
</style>
