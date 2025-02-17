<script lang="ts">
// Script section remains unchanged
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Log {
  id: number;
  table_name: string;
  action: string;
  user_id: string;
  details: string;
  createdAt: string;
  User: {
    email: string;
  };
}

interface Details {
  old: Record<string, any>;
  new: Record<string, any>;
}

export default defineComponent({
  name: 'LogsComponent',
  setup() {
    const logs = ref<Log[]>([]);

    const fetchLogs = async () => {
      try {
        const response = await axios.get<Log[]>(`${API_BASE_URL}/phone/logs`);
        logs.value = response.data;
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    const formatDetails = (details: string): string => {
      try {
        const parsedDetails: Details = JSON.parse(details);
        let formattedDetails = '';

        // Format old values
        formattedDetails += 'Old Values:\n';
        for (const [key, value] of Object.entries(parsedDetails.old)) {
          if (key !== 'createdAt' && key !== 'updatedAt') {
            formattedDetails += `${key}: ${value}\n`;
          }
        }

        // Format new values
        formattedDetails += '\nNew Values:\n';
        for (const [key, value] of Object.entries(parsedDetails.new)) {
          if (key !== 'createdAt' && key !== 'updatedAt') {
            formattedDetails += `${key}: ${value}\n`;
          }
        }

        return formattedDetails;
      } catch (error) {
        console.error('Error parsing details:', error);
        return details;
      }
    };

    onMounted(() => {
      fetchLogs();
    });

    return {
      logs,
      formatDetails,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="text-center">
      <h1 class="table-title">Logs</h1>
    </div>
    <div class="row">
      <div class="table-wrapper">
        <div class="table-container">
          <table v-if="logs.length">
            <thead>
              <tr>
                <th>ID</th>
                <th>Table Name</th>
                <th>Action</th>
                <th>User</th>
                <th class="details-column">Details</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td>{{ log.id }}</td>
                <td>{{ log.table_name }}</td>
                <td>{{ log.action }}</td>
                <td>{{ log.User.email }}</td>
                <td class="details-column">
                  <pre>{{ formatDetails(log.details) }}</pre>
                </td>
                <td>{{ log.createdAt }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>Loading logs...</p>          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.table-wrapper {
  position: relative;
  max-height: 400px; /* Reduced from 600px */
  overflow: hidden;
}

.table-container {
  overflow: auto;
  max-height: 100%;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem; /* Smaller font size */
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f2f2f2;
}

th, td {
  border: 1px solid #ddd;
  padding: 4px 6px; /* Reduced padding */
  min-width: 80px; /* Reduced minimum width */
  max-width: 150px; /* Added maximum width */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  background-color: #f2f2f2;
  font-weight: 600;
  font-size: 0.875rem;
}

.details-column {
  min-width: 200px; /* Reduced from 300px */
  max-width: 300px;
}

.details-column pre {
  font-size: 0.8125rem; /* Smaller font for details */
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  max-height: 100px; /* Limit height of details */
  overflow-y: auto;
}

.table-container::before,
.table-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5px;
  pointer-events: none;
  z-index: 2;
}

.table-container::before {
  left: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
}

.table-container::after {
  right: 0;
  background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
}
</style>