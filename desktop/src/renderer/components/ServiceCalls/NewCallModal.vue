<template>
  <form>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New call</p>
      </header>
      <section class="modal-card-body">
        <b-steps
          v-model="activeStep"
          :animated="true"
          :rounded="true"
          :has-navigation="false"
        >
          <b-step-item step="1" label="Call Type" :clickable="false">
            <br />
            <b-field label="What kind of call?">
              <b-select v-model="callType" placeholder="Pick one">
                <option value="workOrder" selected>Service</option>
                <option value="estimate" disabled>Estimate</option>
              </b-select>
            </b-field>
          </b-step-item>

          <b-step-item step="2" label="Customer" :clickable="false">
            <div
              v-if="!isNewCustomer"
              class="columns is-vcentered is-multiline"
            >
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
              <div class="column is-1">
                <b-button
                  :disabled="selected == -1 ? true : false"
                  @click="clearCustomerSearch()"
                  ><b-icon icon="close"></b-icon
                ></b-button>
              </div>
              <div v-if="selected == -1" class="column is-12">
                <b-button type="is-success" @click="createNewCustomer()"
                  >New customer</b-button
                >
              </div>
            </div>
            <div v-else>
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
                  <option value="HOA">HOA</option>
                  <option value="Commerical">
                    Business complex
                  </option>
                  <option value="Industrial">
                    Industrial complex
                  </option>
                </b-select>
              </b-field>
              <b-field required label="Street Address">
                <b-input v-model="customer.streetAddress"></b-input>
              </b-field>
              <b-field required label="City">
                <b-input v-model="customer.city"></b-input>
              </b-field>
              <b-field required label="Zip code">
                <b-input v-model="customer.zipCode"></b-input>
              </b-field>
              <b-field required label="Primary contact">
                <b-input v-model="customer.contactName"></b-input>
              </b-field>
              <b-field required label="Phone number">
                <b-input v-model="customer.contactPhone"></b-input>
              </b-field>
              <b-field label="Email">
                <b-input v-model="customer.contactEmail"></b-input>
              </b-field>
            </div>
          </b-step-item>

          <b-step-item
            v-if="isNewCustomer"
            step="3"
            label="Location"
            :clickable="false"
          >
            <b-field label="Gate location">
              <b-input v-model="locationToAdd"></b-input>
            </b-field>
            <b-field label="Problem description">
              <b-input
                v-model="descriptionToAdd"
                maxlength="300"
                type="textarea"
              ></b-input>
            </b-field>
            <b-button @click="updateIssue()">Add issue </b-button>
            <!-- dynamically add whatever was entered from above-->
            <br />
            <div v-for="(issue, index) in newCall.issues" :key="index">
              <p>
                Issue {{ index + 1 }}: {{ issue.location }} -
                {{ issue.problem }}
              </p>
            </div>
          </b-step-item>

          <!-- Existing customer -->
          <b-step-item v-else step="3" label="Location" :clickable="false">
            <b-field label="Gate location">
              <b-select v-model="locationToAdd" placeholder="Select one">
                <option
                  v-for="(detail, index) in newCall.customer.gateDetails"
                  :value="detail.location"
                  :key="index"
                >
                  {{ detail.location }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Description of the problem">
              <b-input
                v-model="descriptionToAdd"
                maxlength="300"
                type="textarea"
                placeholder="What's wrong?"
              ></b-input>
            </b-field>
            <b-button @click="updateIssue()">Add issue </b-button>
            <!-- dynamically add whatever was entered from above-->
            <br />
            <div
              class="container"
              v-for="(issue, index) in newCall.issues"
              :key="index"
            >
              <p>
                Issue {{ index + 1 }}: {{ issue.location }} -
                {{ issue.problem }}
              </p>
            </div>
          </b-step-item>

          <b-step-item step="4" label="Tech" :clickable="false">
            <b-field label="Assign to...">
              <b-select v-model="newCall.techAssigned" placeholder="Technician">
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
          <b-button
            v-if="activeStep == 3 && !isSendingData"
            :disabled="canProceed"
            type="is-success"
            native-type="submit"
            style="margin-right: 10px"
            @click.prevent="addToDatabase()"
            >Dispatch</b-button
          >
          <b-button
            v-if="isSendingData"
            type="is-loading"
            style="margin-right: 10px"
          ></b-button>
        </div>
        <div>
          <b-button v-if="activeStep > 0" @click.prevent="activeStep--"
            >Back</b-button
          >
          <b-button
            v-if="activeStep < 3"
            class="button"
            :disabled="canProceed"
            @click="validator()"
            >Next</b-button
          >
        </div>
      </footer>
    </div>
  </form>
</template>

<script>
import DataService from "@/services/DataService";
import Customer from "@/models/Customer.js";

export default {
  name: "NewCallModal",
  props: {
    customers: {
      type: Array
    },
    newCall: {
      type: Object
    }
  },
  components: {
    EditCustomer: require("@/components/Customers/EditCustomer.vue").default
  },
  data() {
    return {
      activeStep: 0,
      callType: null,
      isNewCustomer: false,
      errors: {
        propertyType: false,
        streetAddress: false,
        city: false,
        zipCode: false,
        contactName: false,
        contactPhone: false,
        techAssigned: false
      },
      customer: {},
      customerIndex: -1,
      techAssigned: "",
      isSendingData: false,
      isSubmissionReceived: false,
      locationToAdd: null,
      descriptionToAdd: null,
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
      selected: -1,
      address: ""
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
    closeModal: function() {
      this.$emit("close");
    },
    clearCustomerSearch: function() {
      this.selected = -1;
      this.address = "";
      this.newCall.customer = Object.assign({}, {});
    },
    createNewCustomer: function() {
      this.newCall.customer = new Customer();
      this.isNewCustomer = true;
    },
    addToDatabase: async function() {
      this.isSendingData = true;
      let callToBeDispatched = {};
      switch (this.callType) {
        case "workOrder":
          this.newCall.customer.zipCode = parseInt(this.customer.zipCode);
          // send the info to the DB
          await DataService.dispatchWorkOrder(this.newCall)
            .then(result => {
              this.isSubmissionReceived = true;
              this.newCall.string_id = result.data.string_id;
              this.$emit("update:newCall", result.data);
              this.$emit("onNewCallSubmit", result.data);
            })
            .catch((this.isSendingData = false));
          break;
      }
    },
    updateIssue: function() {
      if (this.locationToAdd == "" || this.descriptionToAdd == "") return;

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
    },
    setCustomerIndex: function(index) {
      this.customerIndex = index;
    },
    validator: function() {
      switch (this.activeStep) {
        case 1:
          this.activeStep++;
          break;
        case 2:
          this.activeStep++;
          break;
        case 3:
          break;
        default:
          // step 1/activestep 0
          this.activeStep++;
      }
    }
  },
  computed: {
    canProceed: {
      get: function() {
        switch (this.activeStep) {
          case 1:
            if (this.selected === -1 && !this.isNewCustomer) {
              return true;
            }
            if (this.newCall.customer.propertyType === "") return true;

            if (this.newCall.customer.streetAddress === "") return true;

            if (this.newCall.customer.city === "") return true;

            if (isNaN(parseInt(this.newCall.customer.zipCode))) return true;

            if (this.newCall.customer.contactName === "") return true;

            if (this.newCall.customer.contactPhone === "") return true;

            return false;
          // break;
          case 2:
            if (this.newCall.issues.length > 0) return false;
          // break;
          case 3:
            if (this.newCall.techAssigned === "") return true;
            break;
          default:
            // step 1/activestep 0
            if (this.callType == null) {
              return true;
            }
            return false;
        }
      },
      set: function() {}
    },
    addresses: function() {
      let addresses = [];
      this.customers.forEach(customer => {
        addresses.push(customer.serviceAddress);
      });
      return addresses;
    },
    locations: function() {
      if (this.customers[this.customerIndex].gateDetails == null) return;
      let locations = [];
      this.customers[this.customerIndex].gateDetails.forEach(detail => {
        locations.push(detail.location);
      });

      return locations;
    },
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
    selected(value) {
      if (value == -1) {
        this.hasFoundCustomer = false;
        return;
      }

      this.newCall.customer = Object.assign({}, this.customers[value]);
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
