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
      <article class="panel">
        <p class="panel-tabs">
          <a :class="[tab === 0 ? 'is-active' : '']" @click="tab = 0"
            >Property</a
          >
          <a :class="[tab === 1 ? 'is-active' : '']" @click="tab = 1"
            >Contact</a
          >
          <a :class="[tab === 2 ? 'is-active' : '']" @click="tab = 2">Codes</a>
        </p>
        <div class="panel-block" v-if="tab === 0">
          <div class="container">
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
        </div>
        <div class="panel-block" v-if="tab === 1">
          <div class="container">
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
        </div>
        <div class="panel-block" v-if="tab === 2">
          <b-button @click="newLocation = true"
            ><b-icon icon="plus"></b-icon
          ></b-button>
          <div v-if="newLocation">
            add location
          </div>
          <b-table
            v-if="customer.gateDetails"
            :data="customer.gateDetails"
            :opened-detailed="defaultOpenedDetails"
            detailed
            detail-key="index"
            :show-detail-icon="true"
          >
            <template slot-scope="props">
              <b-table-column field="location" label="Location">
                {{ props.row.location }}
              </b-table-column>
            </template>
          </b-table>
        </div>
      </article>
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
      newCustomer: null,
      newLocation: false,
      location: {
        location: "",
        accessCodes: "",
        operator1: "",
        operator2: "",
        gateType1: "",
        gateType2: "",
        isMasterSlave: false
      },
      selectedLocation: null,
      defaultOpenedDetails: [1],
      isDeleting: false,
      submitButtonLabel: this.isNew ? "Create" : "Update"
    };
  },
  methods: {
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
          this.close();
          await DataService.deleteCustomer(this.customer.string_id)
            .then(() => {
              this.$buefy.toast.open("Account deleted!");
            })
            .catch(() => {
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
      await DataService.updateCustomer(this.customer, this.customer.string_id);
    },
    onNewSubmit: function() {
      console.log("new");
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
