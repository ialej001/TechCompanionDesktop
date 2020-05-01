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
          :icon-prev="prevIcon"
          :icon-next="nextIcon"
        >
          <b-step-item step="1" label="Call Type" :clickable="false">
            <br />
            <b-field label="What kind of call?">
              <b-select v-model="callType" placeholder="Pick one" required>
                <option value="workOrder">Service</option>
                <option value="estimate">Estimate</option>
              </b-select>
            </b-field>
          </b-step-item>

          <b-step-item step="2" label="Customer" :clickable="false">
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
            <p class="has-text-danger is-italic">{{ errors.lookupError }}</p>
          </b-step-item>

          <b-step-item
            v-if="!isNewCustomer"
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
            <div v-for="(issue, index) in issues" :key="index">
              <p>
                Location {{ index + 1 }}: {{ issue.location }} -
                {{ issue.problem }}
              </p>
            </div>
          </b-step-item>

          <b-step-item v-else step="3" label="Location" :clickable="false">
            <b-field label="Gate location">
              <b-select v-model="locationToAdd">
                <option
                  v-for="(location, index) in customer.gateLocations"
                  :value="location"
                  :key="index"
                >
                  {{ location }}
                </option>
              </b-select>
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
            <div v-for="(issue, index) in issues" :key="index">
              <p>
                Location {{ index + 1 }}: {{ issue.location }} -
                {{ issue.problem }}
              </p>
            </div>
          </b-step-item>

          <b-step-item step="4" label="Tech" :clickable="false">
            <b-field label="Assign to...">
              <b-select v-model="techAssigned" placeholder="Technician">
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
            type="is-info"
            v-if="
              activeStep == 1 && !isSearchingCustomer && !errors.lookupError
            "
            @click="searchForCustomer"
            >Lookup</b-button
          >
          <b-button
            type="is-danger"
            disabled
            v-if="activeStep == 1 && errors.lookupError"
            >Not Found</b-button
          >
          <b-button v-if="isSearchingCustomer" loading></b-button>
          <b-button
            v-if="activeStep == 3 && !isSendingData"
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
  name: "NewCallModal",
  data() {
    return {
      activeStep: 0,
      callType: "",
      isSearchingCustomer: false,
      isNewCustomer: false,
      errors: {
        lookupError: ""
      },
      customer: {
        _id: {},
        streetAddress: "",
        city: "",
        zipCode: "",
        contactName: "",
        contactNumber: "",
        contactEmail: "",
        gateLocations: []
      },
      techAssigned: "",
      issues: [],
      isSendingData: false,
      isSubmissionReceived: false,
      locationToAdd: "",
      descriptionToAdd: "",
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
    closeModal: function() {
      this.$emit("close");
    },
    searchForCustomer: async function() {
      this.isSearchingCustomer = true;
      await DataService.searchForCustomer({
        serviceAddress:
          this.streetAddress + " " + this.city + ", CA " + this.zipCode
      })
        .then(response => {
          this.customer = Object.assign({}, response.data.customer);
          // copy by value for the following structures
          this.customer._id = Object.assign({}, response.data.customer._id);
          this.customer.locations = response.data.customer.gateLocations.slice();
        })
        .catch(error => {
          console.log(error.response.status);
          this.isSearchingCustomer = false;
          this.errors.lookupError =
            "No customer found. Will create a new record on dispatch.";
        });
    },
    addToDatabase: async function() {
      this.isSendingData = true;
      let callToBeDispatched = {};
      switch (this.callType) {
        case "workOrder":
          callToBeDispatched = {
            customer: this.customer,
            techAssigned: this.techAssigned,
            issues: this.issues
          };
          // send the info to the DB
          await DataService.dispatchWorkOrder(callToBeDispatched)
            .then(() => {
              this.isSubmissionReceived = true;
              console.log("submitted");
              this.$emit("onNewCallSubmit");
            })
            .catch((this.isSendingData = false));
          break;
      }
    },
    updateIssue: function() {
      if (!this.customer.gateLocations.includes(this.locationToAdd)) {
        this.customer.gateLocations.push(this.locationToAdd);
      }
      this.issues.push({
        location: this.locationToAdd,
        problem: this.descriptionToAdd
      });
      this.locationToAdd = "";
      this.descriptionToAdd = "";
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
