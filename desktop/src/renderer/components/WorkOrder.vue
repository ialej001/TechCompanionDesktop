<template>
  <div>
    <div class="columns is-multiline is-centered">
      <!-- Display an empty card when no calls are logged for the particular date-->
      <div class="column is-one-fifth">
        <div class="card">
          <div class="card-content has-text-centered">
            No work orders on this date
            <br>
            <br>
            <b-button class="is-success is-large" @click="isNewCallModalActive = true">
              New
            </b-button>
          </div>
        </div>
      </div>
      <!-- begin card iteration for all works orders on a date-->
      <div class="column is-one-fifth">
        <div class="card">
          <div class="card-content">
            <p class="title">
              Contact name or property name
            </p>
            <p class="subtitle">
              address
            </p>
          </div>
          <div class="card-content">
            <div class="content">
              Problem description
              <br>
              Time dispatched
            </div>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item">
              <b-button 
                class="is-info"
                @click="isUpdateCallModalActive = true"
                expanded
              >
                Update
              </b-button>
            </p>
            <p class="card-footer-item">
              <b-button 
                class="is-danger"
                @click="isCancelCallModalActive = true"
                expanded
              >
                  Cancel
              </b-button>
            </p>
          </footer>
        </div>
      </div>

      <b-modal
        :active.sync="isNewCallModalActive"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <NewCallModal
          @close="closeNewCallModal"
          @childToParent="onNewCallSubmit"
        ></NewCallModal>
      </b-modal>

      <b-modal
        :active.sync="isUpdateCallModalActive"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <UpdateCallModal
          @close="closeUpdateCallModal"
          @childToParent="onUpdateCallSubmit"
        ></UpdateCallModal>
      </b-modal>

      <b-modal
        :active.sync="isCancelCallModalActive"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <CancelCallModal
          @close="closeCancelCallModal"
          @childToParent="onCancelCallSubmit"
        ></CancelCallModal>
      </b-modal>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ServiceCall',
  components: {
    NewCallModal: require('@/components/ServiceCalls/NewCallModal.vue').default,
    UpdateCallModal: require('@/components/ServiceCalls/UpdateCallModal.vue').default,
    CancelCallModal: require('@/components/ServiceCalls/CancelCallModal.vue').default
  },
  data () {
    return {
      stage: 'customer',
      isNewCallModalActive: false,
      isUpdateCallModalActive: false,
      isCancelCallModalActive: false
    }
  },
  methods: {
    closeNewCallModal: function () {
      this.isNewCallModalActive = false
    },
    closeUpdateCallModal: function () {
      this.isUpdateCallModalActive = false
    },
    closeCancelCallModal: function () {
      this.isCancelCallModalActive = false
    },
    onNewCallSubmit: function () {},
    onUpdateCallSubmit: function () {},
    onCancelCallSubmit: function () {}
  }
}
</script>

<style scoped></style>
