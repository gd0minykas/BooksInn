<script setup lang="ts">
interface props {
  msg: String;
}

const props = defineProps<props>();
</script>

<template>
  <div class="text-opacity-75 ms-1" style="color: #eb4536">
    * {{ props.msg }}
  </div>
</template>
