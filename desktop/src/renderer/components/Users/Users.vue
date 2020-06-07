<template>
  <div class="container">
    <section>
      <b-button class="button is-large is-success" @click="onNew()"
        ><b-icon icon="plus"></b-icon><span>New</span></b-button
      >
      <b-button
        class="button is-large is-info"
        @click="onEdit()"
        :disabled="!selected"
        ><b-icon icon="pencil"></b-icon><span>Edit</span></b-button
      >
      <b-button
        v-if="selected && !isNewUser"
        class="button is-large is-danger"
        @click="selected = null"
        ><b-icon icon="close"></b-icon><span>Clear selected</span></b-button
      >
    </section>
    <section>
      <div class="container">
        <b-table
          :data="users"
          :paginated="showTableElements"
          :columns="columns"
          per-page="20"
          :current-page.sync="currentPage"
          default-sort="username"
          default-sort-direction="desc"
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
    </section>
    <b-modal
      :active.sync="openUserDetails"
      has-modal-card
      trap-focus
      aria-modal
      :canCancel="false"
      ><UserDetails
        @close="closeUserDetails()"
        @onNewSubmit="onNewSubmit()"
        @onEditSubmit="onEditSubmit()"
        @onDeleteSubmit="onDeleteSubmit()"
        :user="user"
        :isNewUser="isNewUser"
      ></UserDetails
    ></b-modal>
  </div>
</template>

<script>
import User from "@/models/User.js";
import UserService from "@/services/UserService.js";

export default {
  name: "Users",
  data() {
    return {
      user: null,
      submitted: false,
      successful: false,
      openUserDetails: false,
      selected: null,
      isNewUser: false,
      users: [],
      currentPage: 1,
      columns: [
        {
          field: "username",
          label: "Username",
          searchable: true,
          sortable: true
        },
        {
          field: "role",
          label: "Role",
          sortable: true
        },
        {
          field: "email",
          label: "Email",
          searchable: true,
          sortable: true
        }
      ],
      total: 0
    };
  },
  components: {
    UserDetails: require("@/components/Users/UserDetails.vue").default
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.authentication.status.loggedIn;
    },
    showTableElements() {
      if (this.users == null) return false;
      if (this.users.length > 20) return true;
      return false;
    }
  },
  methods: {
    onNew() {
      this.user = new User("", "", "", []);
      this.isNewUser = true;
      this.openUserDetails = true;
    },
    onEdit() {
      this.user = this.selected;
      this.isNewUser = false;
      this.openUserDetails = true;
    },
    async loadUsers() {
      let auth = this.$store.state.authentication.user.data;
      await UserService.getAllUsers(auth).then(response => {
        this.users = response.data;
        this.total = response.data.length;
      });
    },
    closeUserDetails() {
      this.selected = null;
      this.isNewUser = false;
      this.openUserDetails = false;
    },
    onNewSubmit() {
      this.closeUserDetails();
      this.loadUsers();
    },
    onEditSubmit() {
      this.users.splice(this.users.indexOf(this.selected), 1, this.user);
      // this.selected = null;
      this.closeUserDetails();
    },
    onDeleteSubmit() {
      this.users.splice(this.users.indexOf(this.selected), 1);
      // this.selected = null;
      this.total--;
      this.closeUserDetails();
    }
  },
  mounted() {
    this.loadUsers();
  }
};
</script>

<style scoped></style>
