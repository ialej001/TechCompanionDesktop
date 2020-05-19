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
          <div>
            <article class="panel is-link">
              <p class="panel-tabs">
                <a :class="[tab === 0 ? 'is-active' : '']" @click="tab = 0"
                  >Work Completed</a
                >
                <a :class="[tab === 1 ? 'is-active' : '']" @click="tab = 1"
                  >Parts Used</a
                >
                <a :class="[tab === 2 ? 'is-active' : '']" @click="tab = 2"
                  >Charges</a
                >
              </p>
              <div class="panel-block" v-if="tab === 0">
                {{ props.row.customer.serviceAddress }}
              </div>
              <div class="panel-block" v-if="tab === 1"></div>
              <div class="panel-block" v-if="tab === 2"></div>
            </article>
          </div>
        </template>
      </b-table>
    </div>
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
        // {
        //   field: "city",
        //   label: "City",
        //   searchable: true,
        //   sortable: true
        // }
      ],
      isEditActive: false,
      isNew: false
    };
  },
  components: {
    EditCustomer: require("@/components/Customers/EditCustomer.vue").default
  },
  methods: {
    getWorkOrders: function() {
      DataService.getAllWorkOrders().then(workOrders => {
        this.workOrders = workOrders.data;
        console.log(this.workOrders);
        this.total = this.workOrders.length;
      });
    },
    closeEditModal: function() {
      this.isEditActive = false;
      this.customer = null;
      this.isNew = false;
    },
    toggle: function(row) {
      this.$refs.table.toggleDetails(row);
      //   this.$refs.table.
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
