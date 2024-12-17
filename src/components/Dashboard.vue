<template>
  <div class="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <p>You are logged in!</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Admin_Dashboard',
  methods: {

    logout() {
      // Clear the token and redirect to login
      localStorage.removeItem('authToken');
      this.$router.push('/');
    },
  },
};
</script>