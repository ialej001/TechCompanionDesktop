<template>
  <div>
    <div class="container">
      <b-button disabled class="button is-success is-large" @click="onNew"
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
        :data="items"
        :columns="columns"
        :paginated="true"
        :per-page="perPage"
        :current-page.sync="currentPage"
        default-sort="partNumber"
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
      <EditItem
        @close="closeEditModal()"
        @onNewSubmit="onNewSubmit()"
        @onEditSubmit="onEditSubmit()"
        @onDeleteSubmit="onDeleteSubmit()"
        :item="item"
        :isNew="isNew"
      ></EditItem>
    </b-modal>
  </div>
</template>

<script>
import InventoryService from "@/services/InventoryService";

export default {
  name: "Inventory",
  data() {
    return {
      totalItems: null,
      perPage: 15,
      currentPage: 1,
      selected: null,
      item: {},
      tab: 0,
      items: [],
      columns: [
        {
          field: "partNumber",
          label: "Part Number",
          width: 250,
          searchable: true,
          sortable: true
        },
        {
          field: "description",
          label: "Description",
          searchable: true,
          sortable: true
        },
        {
          field: "price",
          label: "Price ($)",
          width: 110,
          searchable: true,
          sortable: true
        }
      ],
      isEditActive: false,
      isNew: false
    };
  },
  components: {
    EditItem: require("@/components/Inventory/EditItem.vue").default
  },
  methods: {
    getItems: function() {
      let user = this.$store.state.authentication.user.data;
      InventoryService.getAllItems(user)
        .then(items => {
          this.items = items.data;
          this.totalItems = this.items.length;
        })
        .catch(() => {});
    },
    closeEditModal: function() {
      this.isEditActive = false;
      this.selected = null;
      this.isNew = false;
    },
    onNew: function() {
      this.item = {};
      this.isNew = true;
      this.isEditActive = true;
    },
    onNewSubmit: function() {
      this.items.push(this.item);
      this.item = {};
      this.closeEditModal();
    },
    onEdit: function() {
      if (this.isNew) {
        this.item = {
          partNumber: "",
          description: "",
          price: 0
        };
      } else {
        this.item = Object.assign({}, this.selected);
      }
      this.isEditActive = true;
    },
    onEditSubmit: function() {
      this.items.splice(this.items.indexOf(this.selected), 1, this.item);
      this.closeEditModal();
    },
    onDeleteSubmit() {
      this.items.splice(this.items.indexOf(this.selected), 1);
      this.closeEditModal();
    }
  },
  mounted() {
    this.getItems();
  }
};
</script>

<style scoped>
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
