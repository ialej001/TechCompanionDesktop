<template>
  <section class="hero is-fullheight is-light">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <div class="box">
              <p class="is-size-3">Welcome!</p>
              <br />

              <b-field
                label="Username"
                :type="errors.has('username') ? 'is-danger' : ''"
                :message="errors.has('username') ? 'Username is required' : ''"
              >
                <b-input
                  v-model="username"
                  v-validate="'required'"
                  name="username"
                ></b-input>
              </b-field>
              <b-field
                label="Password"
                :type="errors.has('password') ? 'is-danger' : ''"
                :message="errors.has('password') ? 'Password is required' : ''"
              >
                <b-input
                  type="password"
                  v-model="password"
                  v-validate="'required'"
                  @keyup.native.enter="login"
                  name="password"
                ></b-input>
              </b-field>
              <div v-if="rejected">
                <p class="has-text-danger is-italic">
                  Invalid username and/or password.
                </p>
              </div>
              <br />
              <b-button
                @click="login()"
                class="is-pulled-right is-success is-large"
                >Login</b-button
              >
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      message: "",
      loading: false
    };
  },
  computed: {
    rejected() {
      return this.$store.state.authentication.status.rejected;
    }
  },
  methods: {
    login() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          // add error feedback
          this.loading = false;
          return;
        }

        if (this.username && this.password) {
          this.$store.dispatch("authentication/login", {
            username: this.username,
            password: this.password
          });
        }
      });
    }
  }
};
</script>

<style scoped></style>
