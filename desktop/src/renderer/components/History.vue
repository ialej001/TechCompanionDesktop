<template>
  <div>
    <div>
      <ServiceHistory />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ServiceHistory: require("@/components/History/ServiceHistory.vue").default
  }
};
</script>

<style scoped></style>
