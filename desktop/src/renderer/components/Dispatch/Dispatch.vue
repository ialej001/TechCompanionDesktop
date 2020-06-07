<template>
  <div class="container is-fluid is-mobile">
    <div class="columns is-multiline is-centered">
      <div
        class="column is-one-fifth-fullhd is-one-quarter-desktop is-one-third-tablet"
      >
        <div class="card">
          <div class="card-content has-text-centered">
            <p v-if="!incompleteCalls.length">No open work orders</p>
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
        v-for="(call, index) in incompleteCalls"
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

              <b-dropdown-item aria-role="listitem" @click="onUpdate(index)"
                >Update</b-dropdown-item
              >
              <b-dropdown-item @click="onCancelCall(index)" aria-role="listitem"
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
        <CallDetailsModal
          @close="closeNewCallModal()"
          @onNewCallSubmit="onNewCallSubmit()"
          @onUpdateCallSubmit="
            onUpdateCallSubmit(response, callIndexToBeUpdated)
          "
          :customers="customers"
          :callDetails="callDetails"
          :isNewCall="isNewCall"
        ></CallDetailsModal>
      </b-modal>
    </div>
  </div>
</template>

<script>
import WorkOrderService from "@/services/WorkOrderService";
import CustomerService from "@/services/CustomerService";
import ServiceCall from "@/models/ServiceCall.js";

export default {
  name: "Dispatch",
  components: {
    CallDetailsModal: require("@/components/Dispatch/CallDetailsModal.vue")
      .default
  },
  data() {
    return {
      auth: this.$store.state.authentication.user.data,
      incompleteCalls: [],
      customers: [],
      index: "",
      callDetails: {},
      isNewCall: false,
      isNewCallModalActive: false,
      callIndexToBeUpdated: null,
      callIdToBeRemoved: ""
    };
  },
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
      this.callDetails = new ServiceCall();
      this.isNewCall = true;
      this.isNewCallModalActive = true;
    },
    onNewCallSubmit: function() {
      this.incompleteCalls.push(this.callDetails);
      this.isNewCallModalActive = false;
      this.isNewCall = false;
      Object.assign(this.callDetails, {});
    },
    onUpdate: function(index) {
      this.callDetails = Object.assign({}, this.incompleteCalls[index]);
      this.callIndexToBeUpdated = index;
      this.isNewCall = false;
      this.isNewCallModalActive = true;
    },
    onUpdateCallSubmit: function() {
      this.isNewCallModalActive = false;
      this.incompleteCalls.splice(
        this.callIndexToBeUpdated,
        1,
        this.callDetails
      );
    },
    onCancelCall(index) {
      this.$buefy.dialog.confirm({
        title: "Cancel service call",
        message:
          "Are you sure you want to <b>cancel</b> this call? This action cannot be undone.",
        confirmText: "Cancel call",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          console.log(this.incompleteCalls[index].string_id);
          await WorkOrderService.cancelWorkOrder(
            this.auth,
            this.incompleteCalls[index].string_id
          )
            .then(() => {
              this.incompleteCalls.splice(this.callIndexToBeUpdated, 1);
              this.$buefy.toast.open("Service call deleted!");
            })
            .catch(() => {
              this.$buefy.toast.open("Something bad happened");
            });
        }
      });
    },
    onCancelCallSubmit: function() {
      this.isCancelCallModalActive = false;
      this.incompleteCalls.splice(this.callIndexToBeUpdated, 1);
    },
    loadTodaysWorkOrders: async function() {
      let user = this.$store.state.authentication.user.data;
      await WorkOrderService.getIncompleteWorkOrders(user)
        .then(workOrders => {
          this.incompleteCalls = workOrders.data.filter(function(item) {
            return item.customer;
          });
        })
        .catch(error => {
          this.error = error.response.data;
          this.incompleteCalls = [];
        });
    },
    loadCustomers: async function() {
      let user = this.$store.state.authentication.user.data;
      await CustomerService.getCustomers(user)
        .then(result => {
          this.customers = result.data;
        })
        .catch(error => {});
    },
    cancelCallModal: function(index) {
      this.isCancelCallModalActive = true;
      this.callIdToBeRemoved = this.incompleteCalls[index].string_id;
    }
  },
  mounted() {
    this.loadTodaysWorkOrders();
    this.loadCustomers();
  }
};
</script>

<style scoped></style>
