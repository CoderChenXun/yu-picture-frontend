<template>
  <div id="app">
    <basic-layout></basic-layout>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { healthUsingGet } from '@/api/mainController'
import { useLoginUserStore } from '@/stores/user'

healthUsingGet().then((response) => {
  console.log(response)
})

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
</script>

<style scoped>
#app {
}
</style>
