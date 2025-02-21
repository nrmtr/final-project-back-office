<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NormalizedSetting {
  id: number;
  feature: string;
  max_value: DoubleRange;
  isEditing?: boolean;
}
``
const normalizedSettings = ref<NormalizedSetting[]>([]);

// Fetch all normalized settings
const fetchAllSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/phone/normalized`);
    normalizedSettings.value = response.data.map((s: any) => ({ ...s, isEditing: false }));
  } catch (error) {
    console.error("Error fetching settings:", error);
    Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch settings." });
  }
};

// Enable editing for a specific row
const editSetting = async (id: number) => {
  const setting = normalizedSettings.value.find((s) => s.id === id);
  if (!setting) return;
  const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: `คุณแน่ใจหรือไม่ที่ต้องการแก้ไข ${setting.feature}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่, แก้ไข!",
    cancelButtonText: "ไม่, ยกเลิก!",
  });

  if (result.isConfirmed) {
    setting.isEditing = true;
  }
};

// Update a specific setting with confirmation
const updateSetting = async (id: number) => {
  const setting = normalizedSettings.value.find((s) => s.id === id);
  if (!setting) return;

  const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: `คุณแน่ใจหรือไม่ที่ต้องการอัพเดท ${setting.feature}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่, อัพเดท!",
    cancelButtonText: "ไม่, ยกเลิก!",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.put(`${API_BASE_URL}/phone/normalized/${id}`, { max_value: setting.max_value });
    Swal.fire({ icon: "success", title: "Success", text: `Updated ${setting.feature} successfully!` });
    setting.isEditing = false;
  } catch (error: any) {
    console.error("Error updating setting:", error);
    Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.error || "Failed to update setting." });
  }
};

// Fetch settings on mount
onMounted(fetchAllSettings);
</script>

<template>
  <div class="container text-center">
    <h2>อัพเดทหรือเปลี่ยนแปลงค่ามาตรฐาน</h2>
    <div class="row justify-content-center">
      <div class="col-md-5 col-lg-4 mb-4">
        <div class="table-container">
          <table class="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Max Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="setting in normalizedSettings" :key="setting.id">
                <td>{{ setting.feature }}</td>
                <td>
                  <input
                    type="number"
                    v-model="setting.max_value"
                    :disabled="!setting.isEditing"
                    class="form-control-sm input-small"
                  />
                </td>
                <td>
                  <button v-if="!setting.isEditing" class="btn btn-primary btn-sm" @click="editSetting(setting.id)">
                    แก้ไข
                  </button>
                  <button v-if="setting.isEditing" class="btn btn-success btn-sm" @click="updateSetting(setting.id)">
                    ยืนยัน
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

.table-container {
  padding: 15px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
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

button:hover {
  opacity: 0.9;
}


input:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.input-small {
  max-width: 100px;
  text-align: left;
}
</style>
