<template>
  <div>
    <h3>Distribution</h3>
    <p>Based on the randomly generated data, let's get the cumulative density function of it. <b>Warning</b>: The result
      have been multiplied by 10,000 to overwhelm a bug at the chart library.</p>

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

        const {body: data} = await this.$http.post('/api/distribution')

        this.chart.setData(data).render()
      }
    }
  }
</script>
