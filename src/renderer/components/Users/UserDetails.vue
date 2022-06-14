<template>
  <form>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <span v-if="!isNewUser"
          ><b-button class="button is-danger" @click="confirmUserAccountDelete"
            ><b-icon icon="delete"></b-icon
          ></b-button>
        </span>
      </header>
      <section class="modal-card-body">
        <div v-if="!isChangingPassword" class="columns">
          <div class="column is-8">
            <b-field
              label="Username"
              :type="errors.has('username') ? 'is-danger' : ''"
              :message="errors.has('username') ? 'Username is required' : ''"
              ><b-input
                v-model="user.username"
                v-validate="'required'"
                name="username"
              ></b-input
            ></b-field>
            <b-field
              v-if="isNewUser"
              label="Password"
              :type="errors.has('password') ? 'is-danger' : ''"
              :message="errors.has('password') ? 'Password is required' : ''"
              ><b-input
                type="password"
                password-reveal
                v-model="user.password"
                v-validate="'required'"
                name="password"
              ></b-input
            ></b-field>
            <b-field
              label="Email"
              :type="errors.has('email') ? 'is-danger' : ''"
              :message="errors.has('email') ? 'Email is required' : ''"
              ><b-input
                v-model="user.email"
                v-validate="'required'"
                name="email"
              ></b-input
            ></b-field>
          </div>
          <div class="column is-4">
            <h1><strong>Privledges</strong></h1>
            <br />
            <div class="field">
              <b-switch
                :disabled="isTechnician || isAdmin"
                :type="isOffice ? 'is-success' : ''"
                v-model="isOffice"
                >Office?</b-switch
              >
            </div>
            <div class="field">
              <b-switch
                :disabled="isOffice || isAdmin"
                :type="isTechnician ? 'is-info' : ''"
                v-model="isTechnician"
                >Technician?</b-switch
              >
            </div>

            <div class="field">
              <b-switch
                :disabled="isTechnician || isOffice"
                :type="isAdmin ? 'is-danger' : ''"
                v-model="isAdmin"
                >Admin?</b-switch
              >
            </div>
          </div>
        </div>
        <div v-if="error != ''">
          <p class="is-italic has-text-danger">{{ error }}</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div>
          <b-button @click="closeModal" type="is-danger">
            Cancel
          </b-button>
        </div>
        <div>
          <b-button
            type="is-success"
            native-type="submit"
            style="margin-right: 10px"
            @click.prevent="isNewUser ? createUser() : updateUser()"
            >{{ submitButtonLabel }}</b-button
          >
        </div>
      </footer>
    </div>
  </form>
</template>

<script>
import authService from "@/services/AuthenticationService.js";
import UserService from "@/services/UserService.js";

export default {
  name: "UserDetails",
  props: {
    isNewUser: {
      type: Boolean
    },
    user: {
      type: Object
    }
  },
  data() {
    return {
      auth: this.$store.state.authentication.user.data,
      submitButtonLabel: this.isNewUser ? "Create" : "Update",
      title: this.isNewUser ? "New User" : "Update User",
      isTechnician: false,
      isOffice: false,
      isAdmin: false,
      isChangingPassword: false,
      error: ""
    };
  },
  methods: {
    cardModal() {
      this.$buefy.modal.open({
        parent: this,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true
      });
    },
    closeModal() {
      this.$emit("close");
    },
    async createUser() {
      this.user.roles = this.setRole();
      this.user.role = this.user.roles[0];
      if (this.user.roles == null) {
        error = "You must select a priveledge level.";
        return;
      } else {
        await UserService.createUser(this.auth, this.user)
          .then(result => {
            this.$emit("update:user", result.data);
            this.$emit("onNewSubmit");
            this.$buefy.toast.open(result.data.message);
          })
          .catch(error => {
            this.error = error.response.data.message;
          });
      }
    },
    async updateUser() {
      this.user.roles = this.setRole();
      this.user.role = this.user.roles[0];
      await UserService.updateUser(this.auth, this.user).then(result => {
        this.$emit("update:user", result.data);
        this.$emit("onEditSubmit");
        this.$buefy.toast.open("User updated!");
      });
    },
    confirmUserAccountDelete() {
      this.$buefy.dialog.confirm({
        title: "Deleting user account",
        message:
          "Are you sure you want to <b>delete</b> this user? This action cannot be undone.",
        confirmText: "Delete User",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          await UserService.deleteUser(this.auth, this.user.id)
            .then(result => {
              this.$emit("onDeleteSubmit");
              this.$buefy.toast.open("User deleted!");
            })
            .catch(error => {
              this.$buefy.toast.open(error.response.data.message);
            });
        }
      });
    },
    setPriviledges() {
      switch (this.user.role) {
        case "admin":
          this.isAdmin = true;
          break;
        case "tech":
          this.isTechnician = true;
          break;
        default:
          this.isOffice = true;
      }
    },
    setRole() {
      if (this.isOffice) return ["office"];
      if (this.isTechnician) return ["tech"];
      if (this.isAdmin) return ["admin"];
      return null;
    }
  },
  mounted() {
    this.setPriviledges();
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
