<template>
  <div class="container">
    <specs/>

    <chart style="margin-top: 1.75rem;"></chart>

    <descriptive style="margin-top: 1.75rem;"></descriptive>

    <distribution style="margin-top: 1.75rem;"></distribution>
  </div>
</template>

<script>
  import Specs from './Specs'
  import Chart from './Data'
  import Descriptive from './Descriptive'
  import Distribution from './Distribution'

  export default {
    components: {
      Chart,
      Descriptive,
      Specs,
      Distribution
    }
  }
</script>

<style scoped>
  .container {
    margin-bottom: 16px;
  }
</style>
