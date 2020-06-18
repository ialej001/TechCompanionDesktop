<template>
  <div>
    <!-- to be expanded when other call types have been implemented -->
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
