<template>
  <div>
    <h2>Specs</h2>
    <p>These computations are done on a host with the following specs.</p>

    <table>
      <thead>
      <tr>
        <th>Spec</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>OS</td>
        <td>{{os}}</td>
      </tr>
      <tr>
        <td>CPUs</td>
        <td>{{cpus}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        os: '',
        cpus: 0
      }
    },

    async created () {
      const response = await this.$http.get('/api/specs')
      this.os = response.body[0]
      this.cpus = response.body[1]
    }
  }
</script>
