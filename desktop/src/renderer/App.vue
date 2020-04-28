<template>
  <div id="app">
    <div class="tabs is-medium is-boxed is-primary">
      <ul>
        <router-link
          tag="li"
          :to="{ path: '/ServiceCall'}"
          active-class="is-active"
          exact>
          <a>Dispatch</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/'}"
          active-class="is-active"
          exact>
          <a>History</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/'}"
          active-class="is-active"
          exact>
          <a>Maintenance</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/Customers'}"
          active-class="is-active"
          exact>
          <a>Customers</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/'}"
          active-class="is-active"
          exact>
          <a>Technicians</a>
        </router-link>
      </ul>
    </div>

    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* CSS */
</style>
