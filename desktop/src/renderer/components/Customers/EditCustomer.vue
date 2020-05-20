<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
      <span v-if="!isNew"
        ><b-button
          class="button is-danger"
          @click="confirmCustomDelete"
          v-if="!isDeleting"
          ><b-icon icon="delete"></b-icon></b-button
        ><b-button v-else @click="isDeleting = false"
          ><b-icon icon="close"></b-icon></b-button
      ></span>
    </header>
    <section class="modal-card-body">
      <div class="tabs">
        <ul>
          <li active-class="is-active" @click="tab = 0"><a>Property</a></li>
          <li active-class="is-active" @click="tab = 1"><a>Contact</a></li>
          <li active-class="is-active" @click="tab = 2"><a>Locations</a></li>
        </ul>
      </div>
      <div class="container" v-if="tab == 0">
        <div class="columns is-multiline">
          <div class="column is-two-thirds">
            <b-field label="Property Name">
              <b-input v-model="customer.propertyName"></b-input>
            </b-field>
          </div>
          <div class="column is-one-third">
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
          </div>
          <div class="column is-6">
            <b-field required label="Street Address">
              <b-input v-model="customer.streetAddress"></b-input>
            </b-field>
          </div>
          <div class="column is-4">
            <b-field required label="City">
              <b-input v-model="customer.city"></b-input>
            </b-field>
          </div>
          <div class="column is-2">
            <b-field required label="Zip code">
              <b-input v-model="customer.zipCode"></b-input>
            </b-field>
          </div>
        </div>
      </div>

      <div class="container" v-if="tab == 1">
        <div class="columns is-multiline">
          <div class="column is-6">
            <b-field required label="Primary contact">
              <b-input v-model="customer.contactName"></b-input>
            </b-field>
          </div>
          <div class="column is-4">
            <b-field required label="Phone number">
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

      <div class="container" v-if="tab == 2">
        <div class="columns is-multiline is-centered">
          <div class="column is-12">
            <b-collapse
              class="card"
              animation="slide"
              aria-id="contentIdForA11y3"
              :open="isNewDetailOpen"
              @open="isNewDetailOpen = !isNewDetailOpen"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="contentIdForA11y3"
              >
                <p class="card-header-title">
                  Add a new location
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-up' : 'menu-down'">
                  </b-icon>
                </a>
              </div>
              <div class="card-content">
                <div class="content">
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
              <footer class="card-footer">
                <a
                  class="card-footer-item"
                  @click="isNewDetailOpen = !isNewDetailOpen"
                  >Cancel</a
                >
                <a class="card-footer-item" @click="createLocation()">Create</a>
              </footer>
            </b-collapse>
          </div>
          <div class="column is-12">
            <div v-if="customer.gateDetails != null" class="container">
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
                    <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
                    </b-icon>
                  </a>
                </div>
                <div class="card-content">
                  <div class="content">
                    <div class="container">
                      <div class="columns">
                        <div class="column is-11">
                          <b-field label="Location"
                            ><b-input
                              v-model="customer.gateDetails[index].location"
                              :disabled="
                                editDetailIndex == detailOpenIndex
                                  ? false
                                  : true
                              "
                            ></b-input
                          ></b-field>
                          <b-field label="Access Codes"
                            ><b-input
                              type="textArea"
                              v-model="customer.gateDetails[index].accessCodes"
                              :disabled="
                                editDetailIndex == detailOpenIndex
                                  ? false
                                  : true
                              "
                            ></b-input
                          ></b-field>
                        </div>
                        <div class="column is-1">
                          <b-button
                            @click="editDetailIndex = index"
                            v-if="editDetailIndex == null"
                            ><b-icon icon="pencil"></b-icon
                          ></b-button>
                          <b-button v-else @click="editDetailIndex = null"
                            ><b-icon icon="check"></b-icon
                          ></b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div>
        <b-button @click="close">Close</b-button>
      </div>
      <div>
        <b-button
          style="margin-right: 10px"
          type="is-success"
          @click="submit"
          >{{ submitButtonLabel }}</b-button
        >
      </div>
    </footer>
  </div>
</template>

<script>
import DataService from "@/services/DataService";

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
      location: {
        location: "",
        accessCodes: "",
        operator1: "Unknown",
        operator2: "Unknown",
        gateType1: "Unknown",
        gateType2: "Unknown",
        isMasterSlave: false
      },
      selectedLocation: null,
      defaultOpenedDetails: [1],
      isDeleting: false,
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
    },
    locationEdit: function() {
      console.log("selected");
      console.log(this.location);
    },
    close: function() {
      this.$emit("close");
    },
    onDelete: function() {
      this.isDeleting = true;
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
          await DataService.deleteCustomer(this.customer.string_id)
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
      console.log(this.customer.city);
      await DataService.updateCustomer(this.customer, this.customer.string_id)
        .then(result => {
          console.log(result.data);
          console.log("created customer");
          this.$emit("update:customer", result.data);
          this.$emit("onEditSubmit");
        })
        .catch(() => {});
    },
    onNewSubmit: async function() {
      console.log("new");
      console.log(this.customer);
      await DataService.createCustomer(this.customer)
        .then(result => {
          console.log(result.data);
          console.log("created customer");
          this.$emit("update:customer", result.data);
          this.$emit("onNewSubmit");
        })
        .catch(() => {
          console.log("error creating customer");
        });
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
