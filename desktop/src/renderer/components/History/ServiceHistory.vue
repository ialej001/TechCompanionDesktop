<template>
  <div>
    <div class="container">
      <b-table
        :data="workOrders"
        :columns="columns"
        :paginated="true"
        :per-page="perPage"
        :current-page.sync="currentPage"
        default-sort="streetAddress"
        hoverable
        detailed
        detail-key="string_id"
        @details-open="(row, index) => closeAllOtherTableRows(row, index)"
        :opened-detailed="openTableRow"
      >
        <b-input
          slot="searchable"
          slot-scope="props"
          v-model="props.filters[props.column.field]"
          placeholder="Search..."
          icon="magnify"
          size="is-small"
        />
        <template slot="detail" slot-scope="props">
          <b-tabs v-model="tab" class="is-marginless">
            <b-tab-item label="Work Completed" active-class="is-active">
            </b-tab-item>
            <b-tab-item label="Parts Used" active-class="is-active">
            </b-tab-item>
            <b-tab-item label="Charges" active-class="is-active"> </b-tab-item>
          </b-tabs>
          <div class="container" v-if="tab === 0">
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
          <div class="container" v-if="tab === 1">
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
import DataService from "@/services/DataService";

export default {
  name: "ServiceHistory",
  data() {
    return {
      total: 200,
      perPage: 20,
      currentPage: 1,
      customer: null,
      tab: 0,
      workOrders: [],
      columns: [
        {
          field: "customer.serviceAddress",
          label: "Full Address",
          searchable: true,
          sortable: true
        },
        {
          field: "techAssigned",
          label: "Technician",
          searchable: true,
          sortable: true
        }
      ],
      partsColumns: [
        { field: "description", label: "Name", sortable: true },
        { field: "quantity", label: "Quantity" },
        { field: "price", label: "Price", sortable: true }
      ],
      isEditActive: false,
      isNew: false,
      isOpen: -1,
      openTableRow: []
    };
  },
  components: {
    EditCustomer: require("@/components/Customers/EditCustomer.vue").default
  },
  methods: {
    getWorkOrders: function() {
      DataService.getCompletedWorkOrders().then(workOrders => {
        this.workOrders = workOrders.data;
        this.total = this.workOrders.length;
      });
    },
    closeEditModal: function() {
      this.isEditActive = false;
      this.customer = null;
      this.isNew = false;
    },
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
