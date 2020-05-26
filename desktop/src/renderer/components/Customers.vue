<template>
  <div>
    <div class="container">
      <b-button class="button is-success is-large" @click="onNew"
        ><b-icon icon="plus"></b-icon><span>New</span></b-button
      >
      <b-button
        class="button is-info is-large"
        @click="onEdit"
        :disabled="!selected"
        ><b-icon icon="pencil"></b-icon><span>Edit</span></b-button
      >
      <b-button
        v-if="selected && !isNew"
        class="button field is-danger is-large"
        @click="selected = null"
        ><b-icon icon="close"></b-icon><span>Clear selected</span></b-button
      >

      <b-table
        :data="customers"
        :columns="columns"
        :paginated="true"
        :per-page="perPage"
        :current-page.sync="currentPage"
        default-sort="streetAddress"
        :selected.sync="selected"
      >
        <b-input
          slot="searchable"
          slot-scope="props"
          v-model="props.filters[props.column.field]"
          placeholder="Search..."
          icon="magnify"
          size="is-small"
        />
      </b-table>
    </div>
    <b-modal
      :active.sync="isEditActive"
      :canCancel="false"
      has-modal-card
      trap-focus
      aria-modal
    >
      <EditCustomer
        @close="closeEditModal()"
        @onNewSubmit="onNewSubmit()"
        @onEditSubmit="onEditSubmit()"
        @onDeleteSubmit="onDeleteSubmit()"
        :customer="customer"
        :isNew="isNew"
      ></EditCustomer>
    </b-modal>
  </div>
</template>

<script>
import DataService from "@/services/DataService";

export default {
  name: "Customers",
  data() {
    return {
      total: 200,
      perPage: 20,
      currentPage: 1,
      selected: null,
      customer: {},
      tab: 0,
      customers: [],
      columns: [
        {
          field: "streetAddress",
          label: "Street Address",
          searchable: true,
          sortable: true
        },
        {
          field: "city",
          label: "City",
          searchable: true,
          sortable: true
        },
        {
          field: "propertyName",
          label: "Property Name",
          searchable: true,
          sortable: true
        }
      ],
      isEditActive: false,
      isNew: false
    };
  },
  components: {
    EditCustomer: require("@/components/Customers/EditCustomer.vue").default
  },
  methods: {
    getCustomers: function() {
      DataService.getCustomers()
        .then(customers => {
          this.customers = customers.data;
          this.total = this.customers.length;
        })
        .catch(() => {});
    },
    closeEditModal: function() {
      this.isEditActive = false;
      this.selected = null;
      this.isNew = false;
    },
    onNew: function() {
      this.customer = {
        billingMethod: null,
        laborRate: null,
        taxRate: null,
        city: null,
        contactEmail: null,
        contactName: null,
        contactPhone: null,
        createdAt: null,
        error: null,
        gateDetails: [],
        managementCompany: null,
        propertyName: "",
        propertyType: null,
        serviceAddress: null,
        streetAddress: null,
        string_id: null,
        zipCode: null
      };
      this.isNew = true;
      this.isEditActive = true;
    },
    onNewSubmit: function() {
      this.customers.push(this.customer);
      this.customer = {};
      this.closeEditModal();
    },
    onEdit: function() {
      if (this.customer.gateDetails == null) {
        this.customer.gateDetails = [];
      }
      if (this.isNew) {
        this.customer = {
          string_id: "",
          propertyName: "",
          propertyType: "",
          streetAddress: "",
          city: "",
          zipCode: null,
          contactName: "",
          contactPhone: "",
          contactEmail: "",
          billingMethod: "",
          gateDetails: []
        };
      } else {
        this.customer = Object.assign({}, this.selected);
      }
      this.isEditActive = true;
    },
    onEditSubmit: function() {
      this.customers.splice(
        this.customers.indexOf(this.selected),
        1,
        this.customer
      );
      this.closeEditModal();
    },
    onDeleteSubmit() {
      this.customers.splice(this.customers.indexOf(this.selected), 1);
      this.total--;
      this.closeEditModal();
    }
  },
  mounted() {
    this.getCustomers();
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
