<template>
  <div>
    <h2>Statistics</h2>
    <p>Based on the randomly generated data, let's get some descriptive statistics.</p>

    <div class="grid">
      <div class="cell -4of12">
        <p><b>Mean</b>: {{mean}}</p>
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
        mean: 0,
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
        this.setMean()
      },

      async setMean () {
        const {body: mean} = await this.$http.post('/api/descriptive/mean', {data: this.data})
        this.mean = mean.toFixed(2)
      },

      async setStandardDeviation () {
        const {body: standardDeviation} = await this.$http.post('/api/descriptive/standard-deviation', {data: this.data})
        this.standardDeviation = standardDeviation.toFixed(2)
      }
    }
  }
</script>
