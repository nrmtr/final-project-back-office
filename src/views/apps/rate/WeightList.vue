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
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;
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
  <div class="container text-center">
    <h1>อัพเดทน้ำหนักการให้คะแนน</h1>
    <div class="row">
      <div 
        v-for="(weights, tag) in groupedWeights" 
        :key="tag" 
        class="col-md-6 col-lg-4 mb-4"
      >
        <div class="table-container">
          <h2>หมวด "{{ tagTranslations[tag] || tag }}"</h2>
          <table class="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th><h5>Title</h5></th>
                <th><h5>Weight</h5></th>
                <th><h5>Action</h5></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="weight in weights" :key="weight.id">
                <td><p>{{ weight.title }}</p></td>
                <td>
                  <input
                    type="number"
                    v-model.number="weight.weight"
                    step="0.01"
                    min="0"
                    max="1"
                    :disabled="!weight.isEditing"
                    class="form-control-sm"
                    style="font-size: 15px;"
                  />
                </td>
                <td>
                  <button
                    v-if="!weight.isEditing"
                    class="btn btn-primary btn-sm me-2"
                    @click="editWeight(tag.toString(), weight.id)"
                    style="font-size: 15px;"
                  >
                    แก้ไข
                  </button>
                  <button
                    v-if="weight.isEditing"
                    class="btn btn-success btn-sm"
                    @click="updateWeight(tag.toString(), weight.id)"
                    style="font-size: 15px;"
                  >
                    อัพเดท
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

p {
  font-size: 15px;
}

.table-container {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}

h2 {
  text-align: center;
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
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

.btn-primary:hover {
  background: #0056b3;
}

.btn-success:hover {
  background: #218838;
}

input:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}
</style>
