<template>
  <div class="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <p>You are logged in as: {{ userEmail }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router"; // Import useRouter

export default {
  name: 'Admin_Dashboard',
  data() {
    return {
      userEmail: localStorage.getItem('userEmail') || 'Unknown',
    };
  },
  methods: {

    logout() {
      const router = useRouter(); // Initialize the router

      // Clear the token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      router.push('/');
    },
  },
};
</script>