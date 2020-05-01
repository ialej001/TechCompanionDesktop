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
            <b-field label="Gate location">
              <b-input></b-input>
            </b-field>
            <b-field label="Problem description">
              <b-input maxlength="300" type="textarea"></b-input>
            </b-field>
          </b-step-item>

          <b-step-item step="3" label="Tech" :clickable="true">
            <b-field> </b-field>
          </b-step-item>
        </b-steps>
      </section>
      <footer class="modal-card-foot">
        <div>
          <b-button @click="closeModal">
            Close
          </b-button>
          <b-button
            v-if="activeStep == 2"
            type="is-success"
            native-type="submit"
            style="margin-right: 10px"
            @click.prevent="updateCallInfo"
            >Update</b-button
          >
        </div>
        <div>
          <b-button v-if="activeStep > 0" @click.prevent="activeStep--"
            >Back</b-button
          >
          <b-button v-if="activeStep < 3" @click.prevent="activeStep++"
            >Next</b-button
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
      string_id: this.selectedCallDetails.string_id
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
