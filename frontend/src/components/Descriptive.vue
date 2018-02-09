<template>
  <div>
    <h2>Statistics</h2>
    <p>Based on the randomly generated data, let's get some descriptive statistics.</p>

    <div class="grid">
      <div class="cell -4of12">
        <p><b>Average</b>: {{average}}</p>
      </div>
      <div class="cell -4of12">
        <p><b>Standard deviation</b>: {{standardDeviation}}</p>
      </div>
      <div class="cell -4of12">
        <button class="btn btn-default" @click="setDescriptive">Calculate</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        average: 0,
        standardDeviation: 0,
        median: 0,
        isLoading: false
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
      setDescriptive () {
        this.setStandardDeviation()
        this.setAverage()
      },

      async setAverage () {
        let response = await this.$http.post('/api/descriptive/average', {data: this.data})
        this.average = response.body.toFixed(2)
      },

      async setStandardDeviation () {
        let response = await this.$http.post('/api/descriptive/standard-deviation', {data: this.data})
        this.standardDeviation = response.body.toFixed(2)
      }
    }
  }
</script>
