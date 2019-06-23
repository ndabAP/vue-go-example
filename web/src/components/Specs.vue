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
      <tr>
        <td>Memory</td>
        <td>{{memory}}</td>
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
        cpus: 0,
        memory: 0
      }
    },

    async created () {
      const { body: [os, cpus, memory] } = await this.$http.get('/api/specs')
      this.os = os
      this.cpus = cpus
      this.memory = memory
    }
  }
</script>
