<!-- <script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const weights = ref<{ id: number; title: string; rate: number; isEditing: boolean }[]>([]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Fetch all weights
const fetchWeights = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weights`);
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
    await axios.put(`${API_BASE_URL}/weights/${id}`, { rate: weight.rate });
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
</style> -->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

// Define the structure of a weight
interface Weight {
  id: number;
  title: string;
  weight: number;
  isEditing: boolean;
}

// Define the structure of grouped weights
interface GroupedWeights {
  [key: string]: Weight[];
}

const groupedWeights = ref<GroupedWeights>({});
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const tagTranslations: Record<string, string> = {
  "general": "ใช้งานทั่วไป",
  "gaming": "เล่นเกม",
  "take beautiful photos": "ถ่ายรูปสวย",
  "rider": "สำหรับคนขับ",
  "ai features": "คุณสมบัติ AI",
  "live streaming": "วิดีโอ ไลฟ์สด",
};
// Fetch all weights
const fetchWeights = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weights`);
    const data = response.data;

    // Process the grouped data
    for (const tag in data) {
      groupedWeights.value[tag] = data[tag].map((w: any) => ({
        ...w,
        isEditing: false,
      }));
    }
  } catch (error) {
    console.error("Error fetching weights:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch weight data.",
    });
  }
};

// Enable editing for a specific weight
const editWeight = async (tag: string, id: number) => {
  const weight = groupedWeights.value[tag].find((w) => w.id === id);
  if (!weight) {
    return;
  }

  const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: `คุณแน่ใจหรือไม่ที่ต้องการแก้ไข ${weight.title}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่, แก้ไข!",
    cancelButtonText: "ไม่, ยกเลิก!",
  });

  if (result.isConfirmed) {
    weight.isEditing = true;
  }
};

// Update a specific weight with confirmation
const updateWeight = async (tag: string, id: number) => {
  const weight = groupedWeights.value[tag].find((w) => w.id === id);
  if (!weight) return;

  const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: `คุณแน่ใจหรือไม่ที่ต้องการอัพเดท ${weight.title}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่, อัพเดท!",
    cancelButtonText: "ไม่, ยกเลิก!",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.put(`${API_BASE_URL}/weights/${id}`, { weight: weight.weight });
    Swal.fire({
      icon: "success",
      title: "สำเร็จ",
      text: `อัพเดท ${weight.title} สำเร็จ!`,
    });
    weight.isEditing = false; // Disable input after updating
  } catch (error: any) {
    console.error("Error updating weight:", error);
    Swal.fire({
      icon: "warning",
      title: "เตือน",
      text: error.response?.data?.error || "Failed to update weight.",
    });
  }
};

// Fetch weights on mount
onMounted(fetchWeights);
</script>

<template>
  <div class="container">
    <h2>อัพเดทน้ําหนักการให้คะแนน</h2>
    <div v-for="(weights, tag) in groupedWeights" :key="tag" class="tag-group">
      <h3>หมวด "{{ tagTranslations[tag] || tag }}"</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Weight</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="weight in weights" :key="weight.id">
            <td>{{ weight.title }}</td>
            <td>
              <input
                type="number"
                v-model.number="weight.weight"
                step="0.01"
                min="0"
                max="1"
                :disabled="!weight.isEditing"
              />
            </td>
            <td>
              <button
                v-if="!weight.isEditing"
                class="edit-button"
                @click="editWeight(tag.toString(), weight.id)"
              >
                แก้ไข
              </button>
              <button
                v-if="weight.isEditing"
                class="confirm-button"
                @click="updateWeight(tag.toString(), weight.id)"
              >
                อัพเดท
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.tag-group {
  margin-bottom: 20px;
}

h3 {
  text-align: left;
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
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