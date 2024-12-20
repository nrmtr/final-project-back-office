<template>
  <div class="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <p>You are logged in as: {{ userEmail }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Admin_Dashboard",
  setup() {
    const userEmail = ref(localStorage.getItem("userEmail") || "Unknown");
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      router.push("/");
    };

    return {
      userEmail,
      logout,
    };
  },
});
</script>
