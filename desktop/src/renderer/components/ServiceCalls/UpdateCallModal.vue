<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Update details</p>
      </header>
      <section class="modal-card-body">
        <b-steps
          v-model="activeStep"
          :animated="true"
          :rounded="true"
          :has-navigation="false"
        >
          <b-step-item step="1" label="Customer" :clickable="true">
            <b-field label="Property Name">
              <b-input v-model="customer.propertyName"></b-input>
            </b-field>
            <b-field label="Property Type">
              <b-select
                v-model="customer.propertyType"
                placeholder="Select one"
              >
                <option value="Residential">
                  House
                </option>
                <option value="Apartment">
                  Apartment/Condo
                </option>
                <option value="Commerical">
                  Business complex
                </option>
                <option value="Industrial">
                  Industrial complex
                </option>
              </b-select>
            </b-field>
            <b-field label="Street Address">
              <b-input v-model="customer.streetAddress"></b-input>
            </b-field>
            <b-field label="City">
              <b-input v-model="customer.city"></b-input>
            </b-field>
            <b-field label="Zip code">
              <b-input v-model="customer.zipCode"></b-input>
            </b-field>
            <b-field label="Primary contact">
              <b-input v-model="customer.contactName"></b-input>
            </b-field>
            <b-field label="Phone number">
              <b-input v-model="customer.contactPhone"></b-input>
            </b-field>
            <b-field label="Email">
              <b-input v-model="customer.contactEmail"></b-input>
            </b-field>
          </b-step-item>

          <b-step-item step="2" label="Location" :clickable="true">
            <div v-if="!isAddingNewIssue">
              <b-table :data="customer.gateDetails" :columns="issueColumns">
              </b-table>
              <br />
              <b-button
                class="button is-info"
                @click="isAddingNewIssue = !isAddingNewIssue"
                >Add new Issue</b-button
              >
            </div>
            <div v-else>
              <b-field label="Gate location">
                <b-input></b-input>
              </b-field>
              <b-field label="Problem description">
                <b-input maxlength="300" type="textarea"></b-input>
              </b-field>
            </div>
          </b-step-item>

          <b-step-item step="3" label="Tech" :clickable="true">
            <b-field label="Assign to..." placeholder="Pick one">
              <b-select v-model="selectedCallDetails.techAssigned">
                <option
                  v-for="tech in technicians"
                  :value="tech.name"
                  :key="tech.id"
                >
                  {{ tech.name }}
                </option>
              </b-select>
            </b-field>
          </b-step-item>
        </b-steps>
      </section>
      <footer class="modal-card-foot">
        <div>
          <b-button @click="closeModal">
            Close
          </b-button>
        </div>
        <div>
          <b-button
            @click="isAddingNewIssue = !isAddingNewIssue"
            v-if="isAddingNewIssue"
            >Cancel</b-button
          >
          <b-button
            v-if="!isAddingNewIssue && activeStep > 0"
            @click.prevent="activeStep--"
            >Back</b-button
          >
          <b-button
            class="button is-info"
            v-if="isAddingNewIssue"
            @click="updateIssue()"
            >Add Issue</b-button
          >
          <b-button
            v-if="!isAddingNewIssue && activeStep < 3"
            @click.prevent="activeStep++"
            >Next</b-button
          >
          <b-button
            v-if="activeStep == 3"
            type="is-success"
            native-type="submit"
            style="margin-right: 10px"
            @click.prevent="updateCallInfo"
            >Update</b-button
          >
        </div>
      </footer>
    </div>
  </form>
</template>

<script>
import DataService from "@/services/DataService";

export default {
  name: "UpdateCallModal",
  props: {
    selectedCallDetails: {
      type: Object,
      required: true
    },
    callIndexToBeUpdated: ""
  },
  data() {
    return {
      activeStep: 0,
      error: null,
      customer: Object.assign({}, this.selectedCallDetails.customer),
      callToBeUpdated: Object.assign({}, this.selectedCallDetails),
      string_id: this.selectedCallDetails.string_id,
      isAddingNewIssue: false,
      issueColumns: [
        {
          field: "location",
          label: "Gate location"
        }
      ],
      technicians: [
        {
          id: 1,
          name: "ivan"
        },
        {
          id: 2,
          name: "jorge"
        }
      ]
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
    updateCallInfo: async function() {
      this.callToBeUpdated.customer = Object.assign({}, this.customer);
      await DataService.updateWorkOrder(this.callToBeUpdated, this.string_id)
        .then(response => {
          this.callToBeUpdated = {};
          this.customer = {};
          this.$emit("update:selectedCallDetails", response.data);
          this.$emit("onUpdateCallSubmit");
        })
        .catch();
    },
    closeModal: function() {
      this.$emit("close", false);
    },
    populateData: function() {
      this.customer = this.selectedCallDetails.customer;
    },
    updateIssue: function() {
      this.$set(this.errors, "locationToAdd", null);
      this.$set(this.errors, "descriptionToAdd", null);

      if (this.locationToAdd == null) {
        this.$set(this.errors, "locationToAdd", "Need a gate location");
        return;
      }
      if (this.descriptionToAdd == null) {
        this.$set(
          this.errors,
          "descriptionToAdd",
          "Need a description of the problem"
        );
        return;
      }

      // search through gateDetails and set an index if the pending location is found
      let indexToModify = -1;

      this.newCall.customer.gateDetails.forEach((detail, index) => {
        if (detail.location.localeCompare(this.locationToAdd)) {
          indexToModify = index;
        }
      });

      // if not found, create new gateDetails object
      if (indexToModify == -1) {
        this.newCall.customer.gateDetails.push({
          location: this.locationToAdd,
          accessCodes: "",
          operator1: "",
          operator2: "",
          gateType1: "",
          gateType2: "",
          isMasterSlave: false
        });
      }

      this.newCall.issues.push({
        location: this.locationToAdd,
        problem: this.descriptionToAdd,
        resolution: null
      });

      this.locationToAdd = null;
      this.descriptionToAdd = null;
    }
  },
  mounted() {
    // this.populateData()
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
