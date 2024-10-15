<script setup lang="ts">
interface props {
  msg: String;
}

const props = defineProps<props>();
</script>

<template>
  <div class="text-danger text-opacity-75 ms-1">* {{ props.msg }}</div>
</template>
