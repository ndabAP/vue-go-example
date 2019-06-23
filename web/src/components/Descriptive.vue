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
      <div class="cell -4of12" style="display: flex; align-items: center; justify-content: center;">
        <button
          class="btn btn-default"
          @click="setDescriptive">
          Calculate <span v-if="isLoading" class="loading"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      mean: 0,
      standardDeviation: 0,
      median: 0,
      isLoading: false
    }),

    computed: {
      data: {
        get () {
          return this.$store.state.data
        }
      }
    },

    methods: {
      async setDescriptive () {
        this.isLoading = true

        await this.setStandardDeviation()
        await this.setMean()

        this.isLoading = false
      },

      setMean () {
        return new Promise(async resolve => {
          const { body: mean } = await this.$http.post('/api/descriptive/mean')
          this.mean = mean.toFixed(2)

          resolve()
        })
      },

      async setStandardDeviation () {
        return new Promise(async resolve => {
          const { body: standardDeviation } = await this.$http.post('/api/descriptive/standard-deviation')
          this.standardDeviation = standardDeviation.toFixed(2)

          resolve()
        })
      }
    }
  }
</script>
