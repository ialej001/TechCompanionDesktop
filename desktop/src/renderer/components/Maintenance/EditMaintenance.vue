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
      <b-steps
        v-model="activeStep"
        :animated="true"
        :rounded="true"
        :has-navigation="false"
      >
        <!-- customer lookup -->
        <b-step-item v-if="isNew" step="1" label="Customer" :clickable="false">
          <div class="columns is-vcentered is-multiline">
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
          </div>
          <br />
          <br />
          <br />
        </b-step-item>

        <b-step-item
          :step="isNew ? '2' : '1'"
          label="Locations"
          :clickable="!isNew"
        >
          <div v-if="contract.customer">
            <div
              v-for="(index, location) in contract.customer.gateDetails"
              :key="index"
              class="field"
            >
              <b-checkbox size="is-medium">{{ location.location }}</b-checkbox>
            </div>
          </div>
        </b-step-item>

        <!-- If modal renders from new, step 3, otherwise step 2 -->
        <!-- restrict ability to click on number icon if it's a new customer -->
        <b-step-item
          :step="isNew ? '3' : '2'"
          label="Scheduling"
          :clickable="!isNew"
        >
        </b-step-item>
      </b-steps>
    </section>
    <footer class="modal-card-foot">
      <div>
        <b-button @click="close">Close</b-button>
      </div>
      <div>
        <b-button style="margin-right: 10px" type="is-success">{{
          submitButtonLabel
        }}</b-button>
      </div>
    </footer>
  </div>
</template>

<script>
import CustomerService from "@/services/CustomerService";

export default {
  name: "EditMaintenance",
  props: {
    isNew: {
      type: Boolean,
      required: true
    },
    customers: {
      type: Array,
      required: true
    },
    contract: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: this.isNew ? "Add Maintenance Contract" : "Edit Contract",
      activeStep: 0,
      submitButtonLabel: this.isNew ? "Create" : "Update",
      address: "",
      selected: -1
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
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
  },
  computed: {
    addresses() {
      let addresses = [];
      this.customers.forEach(customer => {
        addresses.push(customer.serviceAddress);
      });
      return addresses;
    },
    filteredAddresses() {
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
        return;
      }
      this.contract.customer = Object.assign({}, this.customers[value]);
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
