<template>
  <form>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
      </header>
      <section class="modal-card-body">
        <b-steps
          v-model="activeStep"
          :animated="true"
          :rounded="true"
          :has-navigation="false"
        >
          <b-step-item
            v-if="isNewCall"
            step="1"
            label="Call Type"
            :clickable="false"
          >
            <br />
            <b-field
              label="What kind of call?"
              :type="errors.callType == null ? '' : 'is-danger'"
              :message="errors.callType"
            >
              <b-select v-model="callDetails.callType" placeholder="Pick one">
                <option value="workOrder" selected>Service</option>
                <option value="estimate" disabled>Estimate</option>
              </b-select>
            </b-field>
          </b-step-item>

          <!-- If modal renders from new, step 2, otherwise step 1 -->
          <!-- restrict ability to click on number icon if it's a new customer -->
          <b-step-item
            :step="isNewCall ? '2' : '1'"
            label="Customer"
            :clickable="!isNewCall"
          >
            <!-- contents will render if user has not chosen a customer option -->
            <div
              v-if="!isNewCustomer && isNewCall"
              class="columns is-vcentered is-multiline"
            >
              <!-- customer autocomplete search bar -->
              <div class="column is-11">
                <b-field label="Customer search" label-position="on-border">
                  <b-autocomplete
                    v-model="address"
                    :data="filteredAddresses"
                    placeholder="Type an address"
                    icon="magnify"
                    @select="option => (selected = addresses.indexOf(option))"
                  >
                    <template slot="empty">No results found</template>
                  </b-autocomplete>
                </b-field>
              </div>
              <!-- only render if there's an address in the search bar -->
              <div class="column is-1">
                <b-button
                  :disabled="selected == -1 ? true : false"
                  @click="clearCustomerSearch()"
                  ><b-icon icon="close"></b-icon
                ></b-button>
              </div>
              <!-- hide option to make a new customer record if there's an address in the search bar -->
              <div v-if="selected == -1" class="column is-12">
                <b-button type="is-success" @click="createNewCustomer()"
                  >New customer</b-button
                >
              </div>
            </div>
            <!-- renders if user opts to create a new customer record -->
            <div v-else>
              <b-field label="Property Name">
                <b-input v-model="callDetails.customer.propertyName"></b-input>
              </b-field>
              <b-field
                label="Property Type"
                :type="errors.propertyType == null ? '' : 'is-danger'"
                :message="errors.propertyType"
              >
                <b-select
                  v-model="callDetails.customer.propertyType"
                  placeholder="Select one"
                >
                  <option value="Residential">
                    House
                  </option>
                  <option value="Apartment">
                    Apartment/Condo
                  </option>
                  <option value="HOA">HOA</option>
                  <option value="Commerical">
                    Business complex
                  </option>
                  <option value="Industrial">
                    Industrial complex
                  </option>
                </b-select>
              </b-field>
              <b-field
                required
                label="Street Address"
                :type="errors.streetAddress == null ? '' : 'is-danger'"
                :message="errors.streetAddress"
              >
                <b-input v-model="callDetails.customer.streetAddress"></b-input>
              </b-field>
              <b-field
                required
                label="City"
                :type="errors.city == null ? '' : 'is-danger'"
                :message="errors.city"
              >
                <b-input v-model="callDetails.customer.city"></b-input>
              </b-field>
              <b-field
                required
                label="Zip code"
                :type="errors.zipCode == null ? '' : 'is-danger'"
                :message="errors.zipCode"
              >
                <b-input v-model="callDetails.customer.zipCode"></b-input>
              </b-field>
              <b-field
                required
                label="Primary contact"
                :type="errors.contactName == null ? '' : 'is-danger'"
                :message="errors.contactName"
              >
                <b-input v-model="callDetails.customer.contactName"></b-input>
              </b-field>
              <b-field
                required
                label="Phone number"
                :type="errors.contactPhone == null ? '' : 'is-danger'"
                :message="errors.contactPhone"
              >
                <b-input v-model="callDetails.customer.contactPhone"></b-input>
              </b-field>
              <b-field label="Email">
                <b-input v-model="callDetails.customer.contactEmail"></b-input>
              </b-field>
            </div>
            <!-- error display -->
            <div v-if="errors.noCustomerSelected != null">
              <p class="has-text-danger has-text-weight-medium is-italic">
                {{ errors.noCustomerSelected }}
              </p>
            </div>
          </b-step-item>

          <!-- If modal renders from new, step 3, otherwise step 2 -->
          <!-- restrict ability to click on number icon if it's a new customer -->
          <b-step-item
            :step="isNewCall ? '3' : '2'"
            label="Location"
            :clickable="!isNewCall"
          >
            <!-- default state which shows a table of all issues -->
            <div v-if="!isAddingNewIssue">
              <b-table
                :data="callDetails.issues.length == 0 ? [] : callDetails.issues"
                :columns="issueColumns"
                detailed
                detail-key="location"
                @details-open="(row, index) => closeAllOtherTableRows(row)"
                :opened-detailed="openTableRow"
              >
                <template slot="detail" slot-scope="props">
                  <div class="columns">
                    <div class="column is-10">
                      <b-field label="Description of the problem"
                        ><b-input
                          v-model="props.row.problem"
                          :disabled="
                            editDetailIndex == detailOpenIndex ? false : true
                          "
                        ></b-input
                      ></b-field>
                    </div>
                    <div class="column is-1">
                      <b-button
                        v-if="editDetailIndex == null"
                        @click="editDetailIndex = detailOpenIndex"
                        ><b-icon icon="pencil"></b-icon
                      ></b-button>
                      <b-button v-else @click="editDetailIndex = null"
                        ><b-icon icon="check"></b-icon
                      ></b-button>
                    </div>
                    <div class="column is-1">
                      <b-button class="is-danger" @click="onDeleteIssue()"
                        ><b-icon icon="close"></b-icon
                      ></b-button>
                    </div>
                  </div>
                </template>
                <template slot="empty">
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <p>No Issues Added Yet</p>
                    </div>
                  </section>
                </template>
              </b-table>
              <br />
              <!-- button to toggle issue creation form -->
              <b-button
                class="button is-info"
                @click="isAddingNewIssue = !isAddingNewIssue"
                >Add new Issue</b-button
              >
              <!-- error display -->
              <div
                class="container has-text-centered"
                v-if="errors.issues != null"
              >
                <br />
                <p class="has-text-weight-medium has-text-danger is-italic">
                  {{ errors.issues }}
                </p>
              </div>
            </div>
            <!-- issue creation form -->
            <div v-else class="container">
              <div class="columns is-multiline is-vcentered">
                <div class="column is-8">
                  <!-- dropdown menu to select from an existing customer's location list -->
                  <b-field
                    v-if="!isNewCustomer && !isAddingNewLocation"
                    label="Gate location"
                    :type="errors.locationToAdd == null ? '' : 'is-danger'"
                    :message="errors.locationToAdd"
                  >
                    <b-select v-model="locationToAdd" placeholder="Select one">
                      <option
                        v-for="(detail, index) in callDetails.customer
                          .gateDetails"
                        :value="detail.location"
                        :key="index"
                      >
                        {{ detail.location }}
                      </option>
                    </b-select>
                  </b-field>
                  <!-- renders when user opts to add a new gate location to an existing customer -->
                  <b-field
                    v-else
                    label="Gate location"
                    :type="errors.locationToAdd == null ? '' : 'is-danger'"
                    :message="errors.locationToAdd"
                  >
                    <b-input v-model="locationToAdd"></b-input>
                  </b-field>
                  <b-field label="Access Codes"><b-input></b-input></b-field>
                </div>
                <!-- button that toggles between dropdown list or text input -->
                <div class="column is-pulled-right">
                  <b-button
                    v-if="!isNewCustomer"
                    @click="isAddingNewLocation = !isAddingNewLocation"
                    :class="
                      isAddingNewLocation
                        ? 'button is-danger'
                        : 'button is-info'
                    "
                    >{{
                      !isAddingNewLocation ? "Add new location" : "Cancel"
                    }}</b-button
                  >
                </div>
                <!-- description input -->
                <div class="column is-12">
                  <b-field
                    label="Description of the problem"
                    :type="errors.descriptionToAdd == null ? '' : 'is-danger'"
                    :message="errors.descriptionToAdd"
                  >
                    <b-input
                      v-model="descriptionToAdd"
                      maxlength="300"
                      type="textarea"
                      placeholder="What's wrong?"
                    ></b-input>
                  </b-field>
                </div>
              </div>
            </div>
          </b-step-item>

          <!-- If modal renders from new, step 4, otherwise step 3 -->
          <!-- restrict ability to click on number icon if it's a new customer -->
          <b-step-item
            :step="isNewCall ? '4' : '3'"
            label="Tech"
            :clickable="!isNewCall"
          >
            <!-- technician assignment dropdown -->
            <b-field label="Assign to..." placeholder="Pick one">
              <b-select v-model="callDetails.techAssigned">
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
          <!-- closes the modal, does not save data -->
          <b-button @click="closeModal">
            Close
          </b-button>
        </div>
        <div>
          <!-- only renders when a user is adding a new issue to avoid button confusion -->
          <b-button
            @click="isAddingNewIssue = !isAddingNewIssue"
            v-if="isAddingNewIssue"
            >Cancel</b-button
          >
          <!-- hides when user is creating a new issue to avoid button confusion -->
          <b-button
            v-if="!isAddingNewIssue && activeStep > 0"
            @click.prevent="activeStep--"
            >Back</b-button
          >
          <!-- only renders when a user is adding a new issue to avoid button confusion -->
          <b-button
            class="button is-info"
            v-if="isAddingNewIssue"
            @click="updateIssue()"
            >Add Issue</b-button
          >
          <!-- hides when user is creating a new issue to avoid button confusion -->
          <b-button
            v-if="
              isNewCall
                ? !isAddingNewIssue && activeStep < 3
                : !isAddingNewIssue && activeStep < 2
            "
            class="button"
            @click="validator()"
            >Next</b-button
          >
          <!-- renders when on the last step. form submit button -->
          <b-button
            v-if="isNewCall ? activeStep == 3 : activeStep == 2"
            :disabled="callDetails.techAssigned == null ? true : false"
            type="is-success"
            native-type="submit"
            style="margin-right: 10px"
            @click.prevent="isNewCall ? createCall() : updateCall()"
            >{{ submitButtonLabel }}</b-button
          >
        </div>
      </footer>
    </div>
  </form>
</template>

<script>
import WorkOrderService from "@/services/WorkOrderService";
import Customer from "@/models/Customer.js";

export default {
  name: "CallDetailsModal",
  // data passed from parent component
  props: {
    // used to pick an existing customer's info
    customers: {
      type: Array
    },
    // the service call object that we are manipulating
    callDetails: {
      type: Object
    },
    // differentiates between a new service call or updating an existing call
    isNewCall: {
      type: Boolean
    }
  },
  data() {
    return {
      // global
      activeStep: 0,
      title: this.isNewCall ? "New Call" : "Update Details",
      submitButtonLabel: this.isNewCall ? "Dispatch" : "Update",
      // step 2 variables (on update, step 1)
      isNewCustomer: false,
      selected: -1,
      address: "",
      // step 3 variables (on update, step 2)
      isAddingNewIssue: false,
      isAddingNewLocation: false,
      openTableRow: [],
      issueColumns: [
        {
          field: "location",
          label: "Issues"
        }
      ],
      locationToAdd: null,
      descriptionToAdd: null,
      detailOpenIndex: -1,
      editDetailIndex: null,
      // step 4 variables (on update, step 3)
      // TODO: make this populate by calling users/ or convert to a prop
      technicians: [
        {
          id: 1,
          name: "ivan"
        },
        {
          id: 2,
          name: "jorge"
        }
      ],
      techAssigned: ""
    };
  },
  methods: {
    // opens the modal
    cardModal() {
      this.$buefy.modal.open({
        parent: this,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true
      });
    },
    // close this modal by calling a parent function
    closeModal: function() {
      this.$emit("close");
    },
    // clears the customer search bar and its data bindings
    clearCustomerSearch: function() {
      this.selected = -1;
      this.address = "";
      this.callDetails.customer = Object.assign({}, {});
    },
    // instantiates a new customer object and sets which type of wizard this will be
    createNewCustomer: function() {
      this.callDetails.customer = new Customer();
      this.isNewCustomer = true;
    },
    // called when user clicks on 'create' button at the end of the wizard
    createCall: async function() {
      this.isSendingData = true;
      let callToBeDispatched = {};
      // TODO: expand to include 'estimate' call type
      switch (this.callDetails.callType) {
        case "workOrder":
          // send the info to the DB
          let user = this.$store.state.authentication.user.data;
          await WorkOrderService.dispatchWorkOrder(user, this.callDetails)
            .then(result => {
              this.isSubmissionReceived = true;
              this.callDetails.string_id = result.data.string_id;
              // send our data back the parent component
              this.$emit("update:callDetails", result.data);
              this.$emit("onNewCallSubmit", result.data);
            })
            .catch((this.isSendingData = false));
          break;
      }
    },
    // adds an issue to the issues variable on the service call. also adds a new location to the customer
    // if a user creates a new location
    updateIssue: function() {
      this.$set(this.errors, "locationToAdd", null);
      this.$set(this.errors, "descriptionToAdd", null);

      // guard against empty fields
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

      this.callDetails.customer.gateDetails.forEach((detail, index) => {
        if (!detail.location.localeCompare(this.locationToAdd)) {
          indexToModify = index;
        }
      });

      // if not found, create new gateDetails object
      if (indexToModify == -1) {
        this.callDetails.customer.gateDetails.push({
          location: this.locationToAdd,
          accessCodes: "",
          operator1: "",
          operator2: "",
          gateType1: "",
          gateType2: "",
          isMasterSlave: false
        });
      }

      // add the issue to the service call
      this.callDetails.issues.push({
        location: this.locationToAdd,
        problem: this.descriptionToAdd,
        resolution: null
      });

      this.callDetails.issues.splice(this.callDetails.issues.length);

      // reset form
      this.errors.issues = null;
      this.isAddingNewIssue = false;
      this.isAddingNewLocation = false;
      this.locationToAdd = null;
      this.descriptionToAdd = null;
    },
    // creates a dialog prompt to confirm issue deletion
    onDeleteIssue() {
      this.$buefy.dialog.confirm({
        title: "Remove issue",
        message:
          "Are you sure you want to <b>delete</b> this issue? This action cannot be undone.",
        confirmText: "Delete location",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.callDetails.issues.splice(this.detailOpenIndex, 1)
      });
    },
    // used by the customer search bar to register which customer was chosen
    setCustomerIndex: function(index) {
      this.customerIndex = index;
    },
    // pushes the entire call to the server, regardless if changes were made
    updateCall: async function() {
      let user = this.$store.state.authentication.user.data;
      await WorkOrderService.updateWorkOrder(
        user,
        this.callDetails,
        this.callDetails.string_id
      )
        .then(response => {
          this.callToBeUpdated = {};
          this.customer = {};
          this.$emit("update:callDetails", response.data);
          this.$emit("onUpdateCallSubmit");
        })
        .catch();
    },
    // custom form validation
    // TODO: delete after switch to vee-validate
    validator: function() {
      if (this.isNewCall ? this.activeStep == 0 : false) {
        if (this.callDetails.callType == null) {
          // set error
          this.errors.callType = "Required.";
          return;
        }
        this.errors.callType = null;
        this.activeStep++;
        return;
      }
      if (this.isNewCall ? this.activeStep == 1 : this.activeStep == 0) {
        for (let key in this.errors) {
          if (this.errors[key] != null) {
            this.$set(this.errors, key, null);
          }
        }

        if (!this.isNewCall) {
        } else if (this.selected === -1 && !this.isNewCustomer) {
          this.$set(
            this.errors,
            "noCustomerSelected",
            "Please search for a customer or click on 'New Customer'"
          );
          return;
        }

        if (this.callDetails.customer.propertyType === "")
          this.$set(this.errors, "propertyType", "Please select one");

        if (this.callDetails.customer.streetAddress === "")
          this.errors.streetAddress = "Enter a street address.";
        else if (this.callDetails.customer.streetAddress.length < 3)
          this.errors.streetAddress = "Enter a full address.";

        if (this.callDetails.customer.city === "")
          this.errors.city = "Enter a city name.";

        if (isNaN(parseInt(this.callDetails.customer.zipCode))) {
          this.errors.zipCode = "Enter a zip code.";
        } else {
          this.callDetails.customer.zipCode = parseInt(
            this.callDetails.customer.zipCode
          );
        }

        if (this.callDetails.customer.contactName === "")
          this.errors.contactName = "Enter a contact name.";

        if (this.callDetails.customer.contactPhone === "")
          this.errors.contactPhone = "Enter a phone number";
        else if (this.callDetails.customer.contactPhone[0] != "(")
          this.errors.contactPhone = "Missing area code";

        for (let key in this.errors) {
          if (this.errors[key] != null) return;
        }
        this.activeStep++;
        return;
      }
      if (this.isNewCall ? this.activeStep == 2 : this.activeStep == 1) {
        if (this.callDetails.issues.length == 0) {
          this.$set(
            this.errors,
            "issues",
            "Need at least one location with problem!"
          );
          return;
        } else this.$set(this.errors, "issues", null);

        this.activeStep++;
        return;
      }
      if (this.isNewCall ? this.activeStep == 3 : this.activeStep == 2) {
        return;
      }
      // step 1/activestep 0
    },
    // collapses all issue table rows when one is selected
    closeAllOtherTableRows(row) {
      this.detailOpenIndex = this.callDetails.issues.indexOf(row);
      this.openTableRow = [row.location];
    }
  },
  computed: {
    // computes the list of customer addresses to be searched
    addresses: function() {
      let addresses = [];
      this.customers.forEach(customer => {
        addresses.push(customer.serviceAddress);
      });
      return addresses;
    },
    // computes the array that is used for the location dropdown menu
    locations: function() {
      if (this.customers[this.customerIndex].gateDetails == null) return;
      let locations = [];
      this.customers[this.customerIndex].gateDetails.forEach(detail => {
        locations.push(detail.location);
      });

      return locations;
    },
    // computes on change the list of addresses as the user types in the customer search bar
    filteredAddresses: function() {
      return this.addresses.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.address.toLowerCase()) >= 0
        );
      });
    }
  },
  watch: {
    // watches when the user selects an address from the autocomplete dropdown
    // updates the customer selection when an address is selected
    selected(value) {
      if (value == -1) {
        this.hasFoundCustomer = false;
        return;
      }
      this.errors.noCustomerSelected = null;
      this.callDetails.customer = Object.assign({}, this.customers[value]);
      this.hasFoundCustomer = true;
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
