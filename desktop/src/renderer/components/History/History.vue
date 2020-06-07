<template>
  <div>
    <div>
      <ServiceHistory />
    </div>
  </div>
</template>

<script>
export default {
  name: "History",
  components: {
    ServiceHistory: require("@/components/History/ServiceHistory.vue").default
  }
};
</script>

<style scoped></style>
