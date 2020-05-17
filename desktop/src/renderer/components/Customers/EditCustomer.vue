<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <article class="panel" v-if="customer != null">
        <p class="panel-tabs">
          <a :class="[tab === 0 ? 'is-active' : '']" @click="tab = 0"
            >Property</a
          >
          <a :class="[tab === 1 ? 'is-active' : '']" @click="tab = 1"
            >Contact</a
          >
          <a :class="[tab === 2 ? 'is-active' : '']" @click="tab = 2">Codes</a>
        </p>
        <div class="panel-block" v-if="tab === 0">
          <div class="container">
            <div class="columns is-multiline">
              <div class="column is-two-thirds">
                <b-field label="Property Name">
                  <b-input v-model="customer.propertyName"></b-input>
                </b-field>
              </div>
              <div class="column is-one-third">
                <b-field label="Property Type">
                  <b-select
                    v-model="customer.propertyType"
                    placeholder="Select one"
                  >
                    <option value="Residential">
                      House
                    </option>
                    <option value="Apartment">
                      Apartment/Condo
                    </option>
                    <option value="Commerical">
                      Business complex
                    </option>
                    <option value="Industrial">
                      Industrial complex
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-6">
                <b-field required label="Street Address">
                  <b-input v-model="customer.streetAddress"></b-input>
                </b-field>
              </div>
              <div class="column is-4">
                <b-field required label="City">
                  <b-input v-model="customer.city"></b-input>
                </b-field>
              </div>
              <div class="column is-2">
                <b-field required label="Zip code">
                  <b-input v-model="customer.zipCode"></b-input>
                </b-field>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-block" v-if="tab === 1">
          <div class="container">
            <div class="columns is-multiline">
              <div class="column is-6">
                <b-field required label="Primary contact">
                  <b-input v-model="customer.contactName"></b-input>
                </b-field>
              </div>
              <div class="column is-4">
                <b-field required label="Phone number">
                  <b-input v-model="customer.contactPhone"></b-input>
                </b-field>
              </div>
              <div class="column is-8">
                <b-field label="Email">
                  <b-input v-model="customer.contactEmail"></b-input>
                </b-field>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-block" v-if="tab === 2">
          <!-- <b-field label="Gate location">
            <b-select
              v-model="selectedLocation"
              v-on:change="locationEdit"
              placeholder="Select one"
            >
              <option
                v-for="(location, index) in customer.gateLocations"
                :key="index"
                :value="location"
              >
                {{ location }}
              </option>
            </b-select>
          </b-field> -->
          <b-table
            :data="customer.gateDetails"
            :opened-detailed="defaultOpenedDetails"
            detailed
            detail-key="index"
            :show-detail-icon="true"
          >
            <template slot-scope="props">
              <b-table-column field="location" label="Location">
                {{ props.row.location }}
              </b-table-column>
            </template>
          </b-table>
        </div>
      </article>

      <div v-else>
        No customer selected
      </div>
    </section>
    <footer class="modal-card-foot">
      <div>
        <b-button @click="close">Close</b-button>
      </div>
      <div>
        <b-button style="margin-right: 10px" type="is-success" @click="update"
          >Update</b-button
        >
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "EditCustomer",
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: 0,
      selectedLocation: null,
      defaultOpenedDetails: [1]
    };
  },
  methods: {
    locationEdit: function() {
      console.log("selected");
      console.log(this.location);
    },
    close: function() {
      this.$emit("close");
    },
    update: function() {}
  }
};
</script>

<style scoped>
.modal-card-foot {
  justify-content: space-between;
}
</style>
