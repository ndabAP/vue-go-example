<template>
  <div>
    <h2>Data</h2>
    <p>Let's generate some random data. Points represent the quantity of data points and multiplier is some kind of
      capacity. <b>Warning</b>: Remember that your browser might crash if you generate to many points!</p>

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
      <div class="cell -4of12">
        <button class="btn btn-default" @click="persistAndVisualize">Generate</button>
      </div>
    </div>
  </div>
</template>

<script>
  /* global Contour */
  export default {
    data () {
      return {
        points: 100,
        multiplier: 10,
        chart: new Contour({
          el: '#data',
          line: {
            smooth: true,
            marker: {enable: false}
          }
        })
      }
    },

    mounted () {
      this.persistAndVisualize()
      window.addEventListener('resize', () => this.renderChart())
    },

    computed: {
      data: {
        get () {
          return this.$store.state.data
        }
      }
    },

    methods: {
      async persistAndVisualize () {
        this.chart
          .cartesian()
          .line()

        this.$store.commit('SET_DATA', {points: this.points, multiplier: this.multiplier})
        await this.$http.post('/api/persist', {data: this.$store.state.data})

        this.chart.setData(this.data).render()
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
