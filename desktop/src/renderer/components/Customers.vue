<template>
  <div>
    <div class="container">
      <b-button class="button is-success is-large" @click="onNew"
        ><b-icon icon="plus"></b-icon><span>New</span></b-button
      >
      <b-button
        class="button is-info is-large"
        @click="onEdit"
        :disabled="!customer"
        ><b-icon icon="pencil"></b-icon><span>Edit</span></b-button
      >
      <b-button
        v-if="customer"
        class="button field is-danger is-large"
        @click="customer = null"
        ><b-icon icon="close"></b-icon><span>Clear selected</span></b-button
      >

      <b-table
        :data="customers"
        :columns="columns"
        :paginated="true"
        :per-page="perPage"
        :current-page.sync="currentPage"
        default-sort="streetAddress"
        :selected.sync="customer"
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
    <b-modal :active.sync="isEditActive" has-modal-card trap-focus aria-modal>
      <EditCustomer
        @close="closeEditModal()"
        @onNewCallSubmit="onEditSubmit()"
        :customer="customer"
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
      customer: null,
      tab: 0,
      customers: [],
      columns: [
        {
          field: "propertyName",
          label: "Property Name",
          searchable: true,
          sortable: true
        },
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
        }
      ],
      isEditActive: false
    };
  },
  components: {
    EditCustomer: require("@/components/Customers/EditCustomer.vue").default
  },
  methods: {
    getCustomers: function() {
      DataService.getCustomers().then(customers => {
        this.customers = customers.data;
        console.log(this.customers);
        this.total = this.customers.length;
      });
    },
    onNew: function() {},
    onEdit: function() {
      this.isEditActive = true;
      if (this.customer.gateDetails == null) {
        this.customer.gateDetails = [];
      }
      console.log(this.customer);
    },
    onDelete(customer) {
      console.log(customer);
    },
    closeEditModal: function() {
      this.isEditActive = false;
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
