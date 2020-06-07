<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
      <span v-if="!isNew"
        ><b-button
          class="button is-danger"
          @click="confirmItemDelete"
          v-if="!isDeleting"
          ><b-icon icon="delete"></b-icon></b-button
        ><b-button v-else @click="isDeleting = false"
          ><b-icon icon="close"></b-icon></b-button
      ></span>
    </header>
    <section class="modal-card-body">
      <div>
        <b-field label="Part Number"
          ><b-input v-model="item.partNumber"></b-input
        ></b-field>
        <b-field label="Description"
          ><b-input v-model="item.description"></b-input
        ></b-field>
        <b-field label="Price ($)"
          ><b-input v-model="item.price"></b-input
        ></b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div>
        <b-button @click="close">Close</b-button>
      </div>
      <div>
        <b-button
          v-if="isAddingNewLocation"
          @click="isAddingNewLocation = !isAddingNewLocation"
          >Cancel</b-button
        >
        <b-button
          v-if="!isAddingNewLocation"
          style="margin-right: 10px"
          type="is-success"
          @click="submit"
          >{{ submitButtonLabel }}</b-button
        >
        <b-button @click="createLocation()" class="is-info" v-else
          >Add location</b-button
        >
      </div>
    </footer>
  </div>
</template>

<script>
import InventoryService from "@/services/InventoryService";

export default {
  name: "EditCustomer",
  props: {
    isNew: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: this.isNew ? "Add Item" : "Edit Item",
      isDeleting: false,
      isAddingNewLocation: false,
      submitButtonLabel: this.isNew ? "Create" : "Update"
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    confirmItemDelete() {
      this.$buefy.dialog.confirm({
        title: "Deleting item",
        message:
          "Are you sure you want to <b>delete</b> this item? This action cannot be undone.",
        confirmText: "Delete Item",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          let user = this.$store.state.authentication.user.data;
          await InventoryService.deleteItem(user, this.item.string_id)
            .then(() => {
              this.$emit("onDeleteSubmit");
              this.$buefy.toast.open("Item deleted!");
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
      await InventoryService.updateItem(user, this.item.string_id, this.item)
        .then(result => {
          this.$emit("update:item", result.data);
          this.$emit("onEditSubmit");
        })
        .catch(() => {});
    },
    onNewSubmit: async function() {
      let user = this.$store.state.authentication.user.data;
      await InventoryService.createItem(user, this.item)
        .then(result => {
          this.$emit("update:item", result.data);
          this.$emit("onNewSubmit");
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
