<template>
  <div>
    <h2>Distribution</h2>
    <p>Based on the randomly generated data, let's get the normal distribution of it. <b>Warning</b>: The result have
      been multiplied by 10,000 to overwhelm a bug at the chart library.</p>

    <button class="btn btn-default" style="margin-bottom: 1.75rem;" @click="setDistribution">Calculate</button>

    <div id="distribution" style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script>
  /* global Contour */
  export default {
    data () {
      return {
        chart: new Contour({
          el: '#distribution',
          line: {
            smooth: true,
            marker: {enable: false}
          }
        })
      }
    },

    computed: {
      data: {
        get () {
          return this.$store.state.data
        }
      }
    },

    methods: {
      async setDistribution () {
        this.chart
          .cartesian()
          .line()

        let response = await this.$http.post('/api/distribution', {data: this.data})

        this.chart.setData(response.body).render()
      }
    }
  }
</script>
