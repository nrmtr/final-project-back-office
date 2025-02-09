<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const weights = ref<{ id: number; title: string; rate: number; isEditing: boolean }[]>([]);

// Fetch all weights
const fetchWeights = async () => {
  try {
    const response = await axios.get("http://13.251.160.30/api/weights");
    weights.value = response.data.map((w: any) => ({ ...w, isEditing: false }));
  } catch (error) {
    console.error("Error fetching weights:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch weight data.",
    });
  }
};

// Enable editing for a specific row
const editWeight = (id: number) => {
  const weight = weights.value.find((w) => w.id === id);
  if (weight) {
    weight.isEditing = true;
  }
};

// Update a specific weight with confirmation
const updateWeight = async (id: number) => {
  const weight = weights.value.find((w) => w.id === id);
  if (!weight) return;

  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Are you sure you want to update ${weight.title}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, update it!",
    cancelButtonText: "No, cancel!",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.put(`http://localhost:4000/weights/${id}`, { rate: weight.rate });
    Swal.fire({
      icon: "success",
      title: "Success",
      text: `Updated ${weight.title} successfully!`,
    });
    weight.isEditing = false; // Disable input after updating
  } catch (error: any) {
    console.error("Error updating weight:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.error || "Failed to update weight.",
    });
  }
};

// Fetch weights on mount
onMounted(fetchWeights);
</script>

<template>
  <div class="container">
    <h2>Update Weights</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Rate</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="weight in weights" :key="weight.id">
          <td>{{ weight.title }}</td>
          <td>
            <input
              type="number"
              v-model.number="weight.rate"
              step="0.01"
              min="0"
              max="1"
              :disabled="!weight.isEditing"
            />
          </td>
          <td>
            <button v-if="!weight.isEditing" class="edit-button" @click="editWeight(weight.id)">
              Edit
            </button>
            <button v-if="weight.isEditing" class="confirm-button" @click="updateWeight(weight.id)">
              Confirm
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  /* background: #f4f4f4; */
  border-radius: 5px;
  text-align: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
button {
  padding: 5px 10px;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 3px;
}
button:hover {
  opacity: 0.9;
}

/* Edit Button Style */
.edit-button {
  background: #007bff; /* Blue */
}

/* Confirm Button Style */
.confirm-button {
  background: #28a745; /* Green */
}

input:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}
</style>