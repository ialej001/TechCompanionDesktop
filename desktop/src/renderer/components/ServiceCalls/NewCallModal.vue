<template>
  <form action="">
    <div class="modal-card" >
      <header class="modal-card-head">
        <p class="modal-card-title">New call</p>
      </header>
      <section class="modal-card-body">
        <b-steps
            v-model="activeStep"
            :animated="true"
            :rounded="true"
            :has-navigation="false"
            >
            <b-step-item step="1" label="Customer" :clickable="true">
                <b-field label="Street Address">
                  <b-input v-model="streetAddress"></b-input>
                </b-field>
                <b-field label="City">
                  <b-input v-model="city"></b-input>
                </b-field>
                <b-field label="Zip code">
                  <b-input v-model="zipCode"></b-input>
                </b-field>
                <b-field label="Primary contact">
                  <b-input v-model="contactName"></b-input>
                </b-field>
                <b-field label="Phone number">
                  <b-input v-model="contactNumber"></b-input>
                </b-field>
                <b-field label="Email">
                  <b-input v-model="contactEmail"></b-input>
                </b-field>
            </b-step-item>

            <b-step-item step="2" label="Location" :clickable="true">
                <b-field label="Gate location">
                  <b-input v-model="location"></b-input>
                </b-field>
                <b-field label="Problem description">
                  <b-input maxlength="300" type="textarea"></b-input>
                </b-field>
            </b-step-item>

            <b-step-item step="3" label="Tech" :clickable="true">
                <b-field>
                  
                </b-field>
            </b-step-item>
        </b-steps>
      </section>
      <footer class="modal-card-foot">
        <b-button @click="closeModal">
          Close
        </b-button>
        <b-button
          v-if="activeStep == 2"
          type="is-success"
          native-type="submit"
          style="margin-right: 10px"
          @click="emitToParent"
          >Dispatch</b-button
        >
      </footer>
    </div>
  </form>
</template>

<script>

export default {
  name: 'NewCallModal',
  data () {
    return {
      activeStep: 0,
      error: null,
      streetAddress: '',
      city: '',
      zipCode: '',
      contactName: '',
      contactNumber: '',
      contactEmail: '',
      location: '',
      problem: ''
    }
  },
  methods: {
    cardModal () {
      this.$buefy.modal.open({
        parent: this,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true
      })
    },
    emitToParent: async function () {
      // await AuthenticationService.rsvp({
      //   code: this.rsvp_code,
      // })
      //   .then((response) => {
      //     this.$store.dispatch("setToken", response.data.token);
      //     if (!response.data.guest.rsvp_consumed) {
      //       this.$store.dispatch("setGuest", response.data.guest);
      //       this.$emit("childToParent", response.data.guest);
      //       this.$emit("close", false);
      //     } else {
      //       this.isAlreadyRsvp = true;
      //       this.$store.dispatch("setRSVP", true);
      //     }
      //   })
      //   .catch(
      //     // if not found
      //     (this.error = "Code was not found, please check your entry")
      //   );
    },
    closeModal: function () {
      this.$emit('close', false)
    }
  }
}
</script>

<style scoped></style>
