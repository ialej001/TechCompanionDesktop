<template>
  <div class="container is-fluid is-mobile">
    <div class="columns is-multiline is-centered">
      <div
        class="column is-one-fifth-fullhd is-one-quarter-desktop is-one-third-tablet"
      >
        <div class="card">
          <div class="card-content has-text-centered">
            <p v-if="!todaysCalls.length">No open work orders</p>
            <p v-else><br /></p>
            <p>Click below to add a new call</p>
            <br />

            <b-button class="is-success is-large" @click="onNew()">
              New
            </b-button>
            <br />
            <br />
          </div>
        </div>
      </div>
      <!-- begin card iteration for all incomplete works orders-->
      <div
        v-for="(call, index) in todaysCalls"
        :key="index"
        class="column is-one-fifth-fullhd is-one-quarter-desktop is-one-third-tablet"
      >
        <div class="card" v-bind:id="index">
          <div class="card-content">
            <p v-if="call.customer.propertyName" class="title">
              {{ call.customer.propertyName }}
            </p>
            <p v-else class="title">
              {{ call.customer.contactName }}
            </p>
            <p class="subtitle"></p>
            <div v-if="call.customer.propertyName">
              <b-icon icon="account" size="is-small"> </b-icon>
              <span> {{ call.customer.contactName }} </span><br />
            </div>
            <b-icon icon="phone" size="is-small"> </b-icon>
            <span> {{ call.customer.contactPhone }} </span><br />
            <b-icon
              icon="office-building"
              size="is-small"
              v-if="call.customer.propertyType === 'Commercial'"
            >
            </b-icon>
            <b-icon icon="map-marker" size="is-small"> </b-icon>
            <span>
              {{ call.customer.streetAddress }} <br />
              {{ call.customer.city }}, CA
              {{ call.customer.zipCode }}
            </span>
          </div>
          <div class="card-content">
            <div v-for="(issue, idx) in call.issues" :key="idx" class="">
              <b-icon icon="gate" size="is-small"> </b-icon>
              <span> {{ issue.location }} - {{ issue.problem }} </span>
            </div>
            <br />
            <b-dropdown aria-role="list">
              <div class="block" slot="trigger">
                <b-icon icon="dots-horizontal" size="is-small"></b-icon>
              </div>

              <b-dropdown-item
                aria-role="listitem"
                @click="updateModalCallDetails(index)"
                >Update</b-dropdown-item
              >
              <b-dropdown-item
                @click="cancelCallModal(index)"
                aria-role="listitem"
                >Cancel</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </div>
      </div>

      <b-modal
        :active.sync="isNewCallModalActive"
        has-modal-card
        trap-focus
        aria-modal
        :canCancel="false"
      >
        <NewCallModal
          @close="closeNewCallModal()"
          @onNewCallSubmit="onNewCallSubmit()"
          :customers="customers"
          :newCall="newCall"
        ></NewCallModal>
      </b-modal>

      <b-modal
        :active.sync="isUpdateCallModalActive"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
        :canCancel="false"
      >
        <UpdateCallModal
          @close="closeUpdateCallModal()"
          @onUpdateCallSubmit="
            onUpdateCallSubmit(response, callIndexToBeUpdated)
          "
          :selectedCallDetails.sync="selectedCallDetails"
          :callIndexToBeUpdated="callIndexToBeUpdated"
        ></UpdateCallModal>
      </b-modal>

      <b-modal
        :active.sync="isCancelCallModalActive"
        has-modal-card
        trap-focus
        aria-modal
        :canCancel="false"
      >
        <CancelCallModal
          @close="closeCancelCallModal()"
          @onCancelCallSubmit="onCancelCallSubmit()"
          :callIdToBeRemoved="callIdToBeRemoved"
        ></CancelCallModal>
      </b-modal>
    </div>
  </div>
</template>

<script>
import DataService from "@/services/DataService";

export default {
  name: "ServiceCall",
  components: {
    NewCallModal: require("@/components/ServiceCalls/NewCallModal.vue").default,
    UpdateCallModal: require("@/components/ServiceCalls/UpdateCallModal.vue")
      .default,
    CancelCallModal: require("@/components/ServiceCalls/CancelCallModal.vue")
      .default
  },
  data() {
    return {
      todaysCalls: [],
      customers: [],
      index: "",
      selectedCallDetails: {},
      newCall: {},
      isNewCallModalActive: false,
      isUpdateCallModalActive: false,
      isCancelCallModalActive: false,
      callIndexToBeUpdated: null,
      callIdToBeRemoved: ""
    };
  },
  computed: {},
  methods: {
    closeNewCallModal: function() {
      this.isNewCallModalActive = false;
    },
    closeUpdateCallModal: function() {
      this.isUpdateCallModalActive = false;
      this.selectedCallDetails = {
        id: {},
        customer: {},
        date: "",
        descriptionOfProblem: "",
        techAssigned: "",
        location: []
      };
    },
    closeCancelCallModal: function() {
      this.isCancelCallModalActive = false;
    },
    onNew: function() {
      this.newCall = {
        string_id: null,
        customer: {},
        techAssigned: null,
        issues: []
      };
      this.isNewCallModalActive = true;
    },
    onNewCallSubmit: function() {
      this.todaysCalls.push(this.newCall);
      this.isNewCallModalActive = false;
    },
    onUpdateCallSubmit: function() {
      this.isUpdateCallModalActive = false;
      this.todaysCalls.splice(
        this.callIndexToBeUpdated,
        1,
        this.selectedCallDetails
      );
    },
    onCancelCallSubmit: function() {
      this.isCancelCallModalActive = false;
      this.todaysCalls.splice(this.callIndexToBeUpdated, 1);
    },
    loadTodaysWorkOrders: async function() {
      await DataService.getIncompleteWorkOrders()
        .then(workOrders => {
          this.todaysCalls = workOrders.data.filter(function(item) {
            return item.customer;
          });
        })
        .catch(error => {
          this.error = error.response.data;
          this.todaysCalls = [];
        });
    },
    loadCustomers: async function() {
      await DataService.getCustomers()
        .then(result => {
          this.customers = result.data;
        })
        .catch(error => {});
    },
    updateModalCallDetails: function(index) {
      this.selectedCallDetails = Object.assign({}, this.todaysCalls[index]);
      this.isUpdateCallModalActive = true;

      this.callIndexToBeUpdated = index;
    },
    cancelCallModal: function(index) {
      this.isCancelCallModalActive = true;
      this.callIdToBeRemoved = this.todaysCalls[index].string_id;
    }
  },
  mounted() {
    this.loadTodaysWorkOrders();
    this.loadCustomers();
  }
};
</script>

<style scoped></style>
