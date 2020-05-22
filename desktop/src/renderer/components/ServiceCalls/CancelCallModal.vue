<template>
  <form>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Cancel call</p>
      </header>
      <section class="modal-card-body">
        <div v-if="!isCancelled" style="text-align: center;">
          <p>Are you sure you want to cancel this call?</p>
          <br />
          <b-button class="is-info" @click="closeModal()">No</b-button>
          <b-button class="is-danger" @click="cancelCall()">Yes</b-button>
        </div>
        <div v-else>
          This call has been cancelled.
        </div>
      </section>
    </div>
  </form>
</template>

<script>
import DataService from "@/services/DataService";

export default {
  name: "CancelCallModal",
  props: { callIdToBeRemoved: {} },
  data() {
    return {
      isCancelled: false
    };
  },
  methods: {
    cardModal() {
      this.$buefy.modal.open({
        parent: this,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true
      });
    },
    emitToParent: async function() {},
    closeModal: function() {
      this.$emit("close");
    },
    cancelCall: async function() {
      // call dataservice after confirmation
      await DataService.cancelWorkOrder(this.callIdToBeRemoved)
        .then(response => {
          this.isCancelled = true;
          setTimeout(
            function() {
              this.$emit("onCancelCallSubmit");
            }.bind(this),
            800
          );
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped></style>
