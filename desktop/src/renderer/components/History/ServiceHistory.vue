<template>
  <div>
    <div class="container">
      <!-- primary data table that shows all completed service calls -->
      <!-- this is an accordian style table which rows are expandable -->
      <b-table
        :data="workOrders"
        :paginated="true"
        :per-page="perPage"
        :current-page.sync="currentPage"
        default-sort="timeEnded"
        default-sort-direction="desc"
        hoverable
        detailed
        detail-key="string_id"
        @details-open="(row, index) => closeAllOtherTableRows(row, index)"
        :opened-detailed="openTableRow"
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
        <!-- column headers and row data -->
        <template slot-scope="props">
          <b-table-column
            field="customer.serviceAddress"
            label="Full Address"
            searchable
            sortable
            >{{ props.row.customer.serviceAddress }}</b-table-column
          >
          <b-table-column
            field="techAssigned"
            label="Technician"
            searchable
            sortable
          >
            {{ props.row.techAssigned }}
          </b-table-column>
          <b-table-column field="timeEnded" label="Date Completed" sortable>
            {{ new Date(props.row.timeEnded).toDateString() }}
          </b-table-column>
        </template>
        <!-- row detail template -->
        <template slot="detail" slot-scope="props">
          <!-- tabs for different info -->
          <b-tabs v-model="tab" class="is-marginless">
            <b-tab-item label="Work Completed" active-class="is-active">
            </b-tab-item>
            <b-tab-item label="Parts Used" active-class="is-active">
            </b-tab-item>
            <b-tab-item label="Charges" active-class="is-active"> </b-tab-item>
          </b-tabs>
          <!-- issue summary tab-->
          <div class="container" v-if="tab === 0">
            <!-- list of collapsable cards -->
            <b-collapse
              class="card"
              animation="slide"
              v-for="(issue, index) in props.row.issues"
              :key="index"
              :open="isOpen == index"
              @open="isOpen = index"
            >
              <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
              >
                <p class="card-header-title">
                  For the problem at {{ issue.location }}
                </p>
                <a class="card-header-icon"
                  ><b-icon :icon="props.open ? 'menu-up' : 'menu-down'"></b-icon
                ></a>
              </div>
              <div class="card-content">
                <div class="content">
                  {{ issue.resolution }}
                </div>
              </div>
            </b-collapse>
          </div>
          <!-- parts summary tab-->
          <div class="container" v-if="tab === 1">
            <!-- table empty -->
            <div
              v-if="props.row.partsUsed.length === 0"
              class="container has-text-grey has-text-centered"
            >
              <p>
                <b-icon icon="emoticon-sad"> </b-icon>
              </p>
              <p>
                No parts were used.
              </p>
            </div>
            <!-- render a table with data -->
            <div v-else class="">
              <b-table
                :data="
                  props.row.partsUsed.length === 0 ? [] : props.row.partsUsed
                "
                :columns="partsColumns"
              >
              </b-table>
            </div>
          </div>
          <!-- time and price summary -->
          <div class="container" v-if="tab === 2">
            <div class="columns">
              <div class="column is-half">
                Started at: {{ getTime(props.row.timeStarted) }}<br />
                Ended at: {{ getTime(props.row.timeEnded) }}<br />
                Completed on: {{ getDate(props.row.timeStarted) }}<br />
                Dispatched on: {{ getDateTime(props.row.dispatched) }}
              </div>
              <div class="column is-half">
                Total time:
                {{ getTotalTime(props.row.timeStarted, props.row.timeEnded) }}
                <br />
                Subtotal: ${{ props.row.subTotal }}<br />
                Labor: ${{ props.row.labor }}<br />
                Tax: ${{ props.row.tax }}<br />
                Total: ${{ props.row.total }}
              </div>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import WorkOrderService from "@/services/WorkOrderService";

export default {
  name: "ServiceHistory",
  data() {
    return {
      // main table data
      total: 200,
      perPage: 20,
      currentPage: 1,
      customer: null,
      tab: 0,
      workOrders: [],
      isOpen: -1,
      openTableRow: [],

      // row detail: parts used table columns
      partsColumns: [
        { field: "description", label: "Name", sortable: true },
        { field: "quantity", label: "Quantity" },
        { field: "price", label: "Price", sortable: true }
      ]
    };
  },
  components: {
    EditCustomer: require("@/components/Customers/EditCustomer.vue").default
  },
  methods: {
    // fetch completed service calls
    getWorkOrders: function() {
      let user = this.$store.state.authentication.user.data;
      WorkOrderService.getCompletedWorkOrders(user).then(workOrders => {
        this.workOrders = workOrders.data;
        this.total = this.workOrders.length;
      });
    },
    // collapses all other rows upon row selection
    closeAllOtherTableRows(row, index) {
      this.openTableRow = [row.string_id];
    },
    getDate(dateString) {
      let date = new Date(dateString);
      return date.toDateString();
    },
    getTime(dateString) {
      let date = new Date(dateString);
      return date.toLocaleTimeString();
    },
    getTotalTime(start, end) {
      let timeElapsed = new Date(end) - new Date(start);

      if (timeElapsed < 60000) return "<1 minute";

      return Math.floor(timeElapsed / 60000) + " minutes";
    },
    getDateTime(dateString) {
      let date = new Date(dateString);
      return date.toLocaleString();
    }
  },
  mounted() {
    this.getWorkOrders();
  }
};
</script>

<style scoped></style>
