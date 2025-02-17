<script lang="ts">
// Script section remains unchanged
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export default defineComponent({
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const users = ref<User[]>([]);

    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${API_BASE_URL}/auth/users`);
        users.value = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch users',
        });
      }
    };

    const registerUser = async () => {
      if (password.value !== confirmPassword.value) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords do not match!',
        });
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
        });

        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'สําเร็จ',
            text: 'สร้างผู้ใช้งานสําเร็จ',
          });
          firstName.value = '';
          lastName.value = '';
          email.value = '';
          password.value = '';
          confirmPassword.value = '';
          fetchUsers();
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email and password are required',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Internal server error',
          });
        }
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      users,
      registerUser,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="text-center mb-4">
      <h1 class="title">Register</h1>
    </div>
    
    <form @submit.prevent="registerUser" class="register-form">
      <div class="form-group">
        <label for="firstName" class="form-label">First Name:</label>
        <input type="text" id="firstName" v-model="firstName" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="lastName" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required class="form-input" />
      </div>
      <button type="submit" class="submit-btn">Register</button>
    </form>

    <!-- User List Table -->
    <div class="table-section mb-4">
      <h2 class="table-title text-center">รายชื่อแอดมิน</h2>
      <div class="table-container">
        <table v-if="users.length" class="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.roles.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="loading-text">Loading users...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px; 
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.register-form {
  max-width: 300px;
  margin: 0 auto 2rem;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 8px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.875rem;
}

.submit-btn:hover {
  background-color: #369f6e;
}

.table-section {
  margin-top: 2rem;
}

.table-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
}

.user-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f2f2f2;
}

.user-table th {
  background: #f2f2f2;
  padding: 8px;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #ddd;
}

.user-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #ddd;
}


.user-table tr:hover {
  background-color: #f8f8f8;
}

.loading-text {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Custom scrollbar */
.table-container::-webkit-scrollbar {
  width: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>