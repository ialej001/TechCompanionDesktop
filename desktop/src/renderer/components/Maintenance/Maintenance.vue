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
        :data="contracts"
        :columns="columns"
        :paginated="true"
        :per-page="20"
        :current-page.sync="currentPage"
        default-sort="streetAddress"
        :selected.sync="selected"
      >
        <!-- column filter bars -->
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
      <EditMaintenance
        @close="closeEditModal()"
        @onNewSubmit="onNewSubmit()"
        @onEditSubmit="onEditSubmit()"
        @onDeleteSubmit="onDeleteSubmit()"
        :contract="contract"
        :customers="customers"
        :isNew="isNew"
      ></EditMaintenance>
    </b-modal>
  </div>
</template>

<script>
import CustomerService from "@/services/CustomerService";
import MaintenanceService from "@/services/MaintenanceService";
import Contract from "@/models/Contract.js";

export default {
  name: "Maintenance",
  data() {
    return {
      selected: null,
      isNew: false,
      isEditActive: false,
      contract: {},
      contracts: [],
      customers: [],
      currentPage: 1,
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
      ]
    };
  },
  components: {
    EditMaintenance: require("@/components/Maintenance/EditMaintenance.vue")
      .default
  },
  methods: {
    getCustomers() {
      let user = this.$store.state.authentication.user.data;
      CustomerService.getCustomers(user)
        .then(customers => {
          this.customers = customers.data;
        })
        .catch(() => {});
    },
    getContracts() {
      let user = this.$store.state.authentication.user.data;
      MaintenanceService.getContracts(user)
        .then(contracts => {
          this.contracts = contracts.data;
          this.total = this.contracts.length;
        })
        .catch(() => {});
    },
    closeEditModal() {
      this.isNew = false;
      this.isEditActive = false;
      this.selected = null;
    },
    onNew() {
      this.contract = new Contract();
      this.isNew = true;
      this.isEditActive = true;
    },
    onNewSubmit() {
      this.contracts.push(this.selected);
      this.contract = {};
      this.closeEditModal();
    },
    onEdit() {
      this.contract = Object.assign({}, this.selected);
      this.isEditActive = true;
    },
    onEditSubmit() {
      this.contracts.splice(
        this.contracts.indexOf(this.selected),
        1,
        this.contract
      );
      this.closeEditModal();
    },
    onDeleteSubmit() {
      this.contracts.splice(this.contracts.indexOf(this.selected), 1);
      this.closeEditModal();
    }
  },
  mounted() {
    this.getCustomers();

    //   this.getContracts();
  }
};
</script>

<style scoped></style>
