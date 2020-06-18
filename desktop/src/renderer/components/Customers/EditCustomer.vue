<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
      <!-- render the delete button if this modal has been opened with the edit context -->
      <span v-if="!isNew"
        ><b-button class="button is-danger" @click="confirmCustomDelete"
          ><b-icon icon="delete"></b-icon></b-button
      ></span>
    </header>
    <section class="modal-card-body">
      <b-tabs v-model="tab" type="is-boxed" class="is-marginless">
        <b-tab-item>
          <template slot="header">
            Property
            <b-icon
              v-if="errors.propertyTab"
              type="is-danger"
              icon="alert-circle"
            ></b-icon>
          </template>
        </b-tab-item>
        <b-tab-item>
          <template slot="header">
            Contact
            <b-icon
              v-if="errors.contactTab"
              type="is-danger"
              icon="alert-circle"
            ></b-icon
          ></template>
        </b-tab-item>
        <b-tab-item active-class="is-active" label="Locations"></b-tab-item>
        <b-tab-item>
          <template slot="header">
            Billing
            <b-icon
              v-if="errors.billingTab"
              type="is-danger"
              icon="alert-circle"
            ></b-icon>
          </template>
        </b-tab-item>
      </b-tabs>
      <!-- Property tab contents -->
      <div class="container" v-if="tab === 0">
        <div class="columns is-multiline">
          <div class="column is-two-thirds">
            <b-field label="Property Name">
              <b-input v-model="customer.propertyName"></b-input>
            </b-field>
          </div>
          <div class="column is-one-third">
            <b-field
              label="Property Type"
              :type="errors.propertyType == null ? '' : 'is-danger'"
              :message="errors.propertyType"
            >
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
          </div>
          <div class="column is-6">
            <b-field
              required
              label="Street Address"
              :type="errors.streetAddress == null ? '' : 'is-danger'"
              :message="errors.streetAddress"
            >
              <b-input v-model="customer.streetAddress"></b-input>
            </b-field>
          </div>
          <div class="column is-4">
            <b-field
              required
              label="City"
              :type="errors.city == null ? '' : 'is-danger'"
              :message="errors.city"
            >
              <b-input v-model="customer.city"></b-input>
            </b-field>
          </div>
          <div class="column is-2">
            <b-field
              required
              label="Zip code"
              :type="errors.zipCode == null ? '' : 'is-danger'"
              :message="errors.zipCode"
            >
              <b-input v-model="customer.zipCode"></b-input>
            </b-field>
          </div>
        </div>
      </div>

      <div class="container" v-if="tab === 1">
        <div class="columns is-multiline">
          <div class="column is-6">
            <b-field
              required
              label="Primary contact"
              :type="errors.contactName == null ? '' : 'is-danger'"
              :message="errors.contactName"
            >
              <b-input v-model="customer.contactName"></b-input>
            </b-field>
          </div>
          <div class="column is-4">
            <b-field
              required
              label="Phone number"
              :type="errors.contactPhone == null ? '' : 'is-danger'"
              :message="errors.contactPhone"
            >
              <b-input v-model="customer.contactPhone"></b-input>
            </b-field>
          </div>
          <div class="column is-8">
            <b-field label="Email">
              <b-input v-model="customer.contactEmail"></b-input>
            </b-field>
          </div>
        </div>
      </div>

      <div class="container" v-if="tab === 2">
        <div
          v-if="!isAddingNewLocation"
          class="columns is-multiline is-centered"
        >
          <div class="column is-12">
            <b-button
              @click="isAddingNewLocation = !isAddingNewLocation"
              class="button is-info"
              >Create new location</b-button
            >
          </div>
          <div v-if="customer.gateDetails != null" class="column is-12">
            <b-collapse
              class="card"
              animation="slide"
              v-for="(detail, index) of customer.gateDetails"
              :key="index"
              :open="detailOpenIndex == index"
              @open="detailOpenIndex = index"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
              >
                <p class="card-header-title">
                  {{ detail.location }}
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-up' : 'menu-down'">
                  </b-icon>
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <div class="container">
                    <div class="columns">
                      <div class="column is-10">
                        <b-field label="Location"
                          ><b-input
                            v-model="customer.gateDetails[index].location"
                            :disabled="
                              editDetailIndex == detailOpenIndex ? false : true
                            "
                          ></b-input
                        ></b-field>
                        <b-field label="Access Codes"
                          ><b-input
                            type="textArea"
                            v-model="customer.gateDetails[index].accessCodes"
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
                        <b-button class="is-danger" @click="onDeleteLocation()"
                          ><b-icon icon="close"></b-icon
                        ></b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
        <div v-else>
          <b-field label="Location">
            <b-input v-model="location.location"></b-input>
          </b-field>
          <b-field label="Access Codes">
            <b-input
              v-model="location.accessCodes"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
        </div>
      </div>
      <div class="container" v-if="tab === 3">
        <b-field label="Billing method">
          <b-select placeholder="Select one" v-model="customer.billingMethod">
            <option value="COD">COD</option>
            <option value="NET30">NET30</option>
            <option value="NET60">NET60</option>
          </b-select>
        </b-field>
        <b-field
          label="Labor Rate ($/hr)"
          :type="errors.laborRate == null ? '' : 'is-danger'"
          :message="errors.laborRate"
        >
          <b-input v-model="customer.laborRate"></b-input>
        </b-field>
        <b-field
          label="Tax Rate (%)"
          :type="errors.taxRate == null ? '' : 'is-danger'"
          :message="errors.taxRate"
        >
          <b-input v-model="customer.taxRate"></b-input>
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div>
        <b-button @click="close">Close</b-button>
      </div>
      <div>
        <b-button
          v-if="isAddingNewLocation"
          @click="isAddingNewLocation = !isAddingNewLocation"
          >Cancel</b-button
        >
        <b-button
          v-if="!isAddingNewLocation"
          style="margin-right: 10px"
          type="is-success"
          @click="validator()"
          >{{ submitButtonLabel }}</b-button
        >
        <b-button @click="createLocation()" class="is-info" v-else
          >Add location</b-button
        >
      </div>
    </footer>
  </div>
</template>

<script>
import CustomerService from "@/services/CustomerService";

export default {
  name: "EditCustomer",
  props: {
    isNew: {
      type: Boolean,
      required: true
    },
    customer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: this.isNew ? "Add Customer" : "Edit Customer",
      tab: 0,
      isNewDetailOpen: false,
      detailOpenIndex: -1,
      editDetailIndex: null,
      enableLocationSearch: false,
      errors: {
        propertyTab: null,
        propertyType: null,
        streetAddress: null,
        city: null,
        zipCode: null,
        contactTab: null,
        contactName: null,
        contactPhone: null,
        billingTab: null,
        laborRate: null,
        taxRate: null
      },
      location: {
        location: "",
        accessCodes: "",
        operator1: "Unknown",
        operator2: "Unknown",
        gateType1: "Unknown",
        gateType2: "Unknown",
        isMasterSlave: false
      },
      defaultOpenedDetails: [],
      isDeleting: false,
      isAddingNewLocation: false,
      submitButtonLabel: this.isNew ? "Create" : "Update"
    };
  },
  methods: {
    createLocation: function() {
      if (this.customer.gateDetails == null) this.customer.gateDetails = [];

      this.$set(
        this.customer.gateDetails,
        this.customer.gateDetails.length,
        Object.assign({}, this.location)
      );

      this.location.location = "";
      this.location.accessCodes = "";
      this.isNewDetailOpen = !this.isNewDetailOpen;
      this.isAddingNewLocation = !this.isAddingNewLocation;
    },
    close: function() {
      this.$emit("close");
    },
    closeAllOtherDetails(row, index) {
      this.defaultOpenedDetails = [row.location];
    },
    onDeleteLocation(row) {
      this.$buefy.dialog.confirm({
        title: "Remove location",
        message:
          "Are you sure you want to <b>delete</b> this location? This action cannot be undone.",
        confirmText: "Delete location",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () =>
          this.customer.gateDetails.splice(this.detailOpenIndex, 1)
      });
    },
    confirmCustomDelete() {
      this.$buefy.dialog.confirm({
        title: "Deleting account",
        message:
          "Are you sure you want to <b>delete</b> this account? This action cannot be undone.",
        confirmText: "Delete Account",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          let user = this.$store.state.authentication.user.data;
          await CustomerService.deleteCustomer(user, this.customer.string_id)
            .then(() => {
              this.$emit("onDeleteSubmit");
              this.$buefy.toast.open("Account deleted!");
            })
            .catch(() => {
              this.close();
              this.$buefy.toast.open("Something bad happened");
            });
        }
      });
    },
    submit: function() {
      if (this.isNew) {
        this.onNewSubmit();
        return;
      }
      this.onEditSubmit();
    },
    onEditSubmit: async function() {
      let user = this.$store.state.authentication.user.data;
      await CustomerService.updateCustomer(
        user,
        this.customer,
        this.customer.string_id
      )
        .then(result => {
          this.$emit("update:customer", result.data);
          this.$emit("onEditSubmit");
        })
        .catch(() => {});
    },
    onNewSubmit: async function() {
      if (this.customer.propertyName == null) this.customer.propertyName = "";
      let user = this.$store.state.authentication.user.data;
      await CustomerService.createCustomer(user, this.customer)
        .then(result => {
          this.customer.string_id = result.data.string_id;
          this.$emit("update:customer", result.data);
          this.$emit("onNewSubmit");
        })
        .catch(() => {});
    },
    validator: function() {
      for (let key in this.errors) {
        if (this.errors[key] != null) {
          this.$set(this.errors, key, null);
        }
      }
      this.errors.propertyTab = null;
      this.errors.contactTab = null;
      this.errors.billingTab = null;

      // property validation
      if (this.customer.propertyType === "") {
        this.$set(this.errors, "propertyType", "Please select one");
        this.errors.propertyTab = true;
      }
      if (this.customer.streetAddress === "") {
        this.errors.streetAddress = "Enter a street address.";
        this.errors.propertyTab = true;
      } else if (this.customer.streetAddress.length < 3) {
        this.errors.streetAddress = "Enter a full address.";
        this.errors.propertyTab = true;
      }
      if (this.customer.city === "") {
        this.errors.city = "Enter a city name.";
        this.errors.propertyTab = true;
      }
      if (isNaN(parseInt(this.customer.zipCode))) {
        this.errors.zipCode = "Enter a zip code.";
        this.errors.propertyTab = true;
      } else {
        this.customer.zipCode = parseInt(this.customer.zipCode);
      }

      // contact validation
      if (this.customer.contactName === "") {
        this.errors.contactName = "Enter a contact name.";
        this.errors.contactTab = true;
      }
      if (this.customer.contactPhone === "") {
        this.errors.contactPhone = "Enter a phone number";
        this.errors.contactTab = true;
      } else if (this.customer.contactPhone[0] != "(") {
        this.errors.contactPhone = "Missing area code";
        this.errors.contactTab = true;
      }

      // billing validation
      if (isNaN(parseFloat(this.customer.laborRate))) {
        this.$set(this.errors, "laborRate", "Need a labor rate ($/hr)");
        this.errors.billingTab = true;
      } else {
        this.customer.laborRate = parseFloat(this.customer.laborRate);
      }
      if (isNaN(parseFloat(this.customer.taxRate))) {
        this.$set(this.errors, "taxRate", "Need a tax rate (%)");
        this.errors.billingTab = true;
      } else {
        this.customer.taxRate = parseFloat(this.customer.taxRate);
      }

      // check if any errors have been set
      for (let key in this.errors) {
        if (this.errors[key] != null) return;
      }
      this.submit();
      return;
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
