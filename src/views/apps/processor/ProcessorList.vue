<script setup lang="ts">
import { ref, computed } from "vue";
import { useProcessors } from "@/core/data/useProcessor";
import type { IProcessor } from "@/core/data/processor";

const { processors, loading, error, addProcessor, updateProcessor, deleteProcessor } = useProcessors();

const showModal = ref(false);
const isEditing = ref(false);
const processorForm = ref<IProcessor>({
  id: null,
  processor: "",
  rating: "",
  antutu_10: "",
  geekbench_6: "",
  cores: "",
  clock: "",
  gpu: "",
  createdAt: "",
  updatedAt: "",
});

const openAddModal = () => {
  isEditing.value = false;
  processorForm.value = {
    id: null,
    processor: "",
    rating: "",
    antutu_10: "",
    geekbench_6: "",
    cores: "",
    clock: "",
    gpu: "",
    createdAt: "",
    updatedAt: "",
  };
  showModal.value = true;
};

const openEditModal = (processor: any) => {
  isEditing.value = true;
  processorForm.value = { ...processor };
  showModal.value = true;
};

const handleSubmit = async () => {
  if (isEditing.value) {
    await updateProcessor(processorForm.value);
  } else {
    await addProcessor(processorForm.value);
  }
  showModal.value = false;
};

const handleDelete = async (id: number) => {
  await deleteProcessor(id);
};

const rating = computed({
  get: () => processorForm.value.rating,
  set: (value) => {
    processorForm.value.rating = value.replace(/[^0-9]/g, "");
  },
});

const antutu_10 = computed({
  get: () => processorForm.value.antutu_10,
  set: (value) => {
    processorForm.value.antutu_10 = value.replace(/[^0-9]/g, "");
  },
});

const cores = computed({
  get: () => processorForm.value.cores,
  set: (value) => {
    processorForm.value.cores = value.replace(/[^0-9]/g, "");
  },
});

</script>

<template>
  <div class="container">
    <div class="text-center mb-3">
      <h2>ซีพียูแรงค์กิ้ง</h2>
    </div>

    <!-- Add Button -->
    <div class="text-end mb-3">
      <button @click="openAddModal" class="btn btn-primary"><p>เพิ่มซีพียู</p></button>
    </div>

    <!-- Table Container -->
    <div class="table-wrapper">
      <div v-if="loading" class="loading-message">กำลังโหลดข้อมูล แรงค์กิ้งของซีพียู...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th style="width: 200px;"><h6>Processor</h6></th>
              <th><h6>Rating</h6></th>
              <th><h6>Antutu 10 Score</h6></th>
              <th><h6>Geekbench 6 Score</h6></th>
              <th><h6>Cores</h6></th>
              <th><h6>Clock Speed (GHz)</h6></th>
              <th><h6>GPU</h6></th>
              <th style="min-width: 20px; width:200px;"><h6>Actions</h6></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processor in processors" :key="processor.id ?? 'temp-key'">
              <td><p>{{ processor.processor }}</p></td>
              <td><p>{{ processor.rating }}</p></td>
              <td><p>{{ processor.antutu_10 }}</p></td>
              <td><p>{{ processor.geekbench_6 }}</p></td>
              <td><p>{{ processor.cores }}</p></td>
              <td><p>{{ processor.clock }}</p></td>
              <td><p>{{ processor.gpu }}</p></td>
              <td>
                <button @click="openEditModal(processor)" class="btn btn-primary btn-sm me-2"><p>แก้ไข</p></button>
                <button @click="processor.id !== null ? handleDelete(processor.id) : null" class="btn btn-danger btn-sm"><p>ลบ</p></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? "แก้ไขซีพียู" : "เพิ่มซีพียู" }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Processor Name:</label>
              <input v-model="processorForm.processor" type="text" class="form-control"/>
            </div>

            <div class="mb-3">
              <label class="form-label">Rating:</label>
              <input v-model="rating" type="text" class="form-control"/>
            </div>

            <div class="mb-3">
              <label class="form-label">Antutu 10 Score:</label>
              <input v-model="antutu_10" type="text" class="form-control"/>
            </div>

            <div class="mb-3">
              <label class="form-label">Geekbench 6 Score:</label>
              <input v-model="processorForm.geekbench_6" type="text" class="form-control"/>
            </div>

            <div class="mb-3">
              <label class="form-label">Cores:</label>
              <input v-model="cores" type="text" class="form-control"/>
            </div>

            <div class="mb-3">
              <label class="form-label">Clock Speed (GHz):</label>
              <input v-model="processorForm.clock" type="text" class="form-control"/>
            </div>

            <div class="mb-3">
              <label class="form-label">GPU:</label>
              <input v-model="processorForm.gpu" type="text" class="form-control"/>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="handleSubmit" class="btn btn-success">{{ isEditing ? "Update" : "Add" }}</button>
            <button @click="showModal = false" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
p{
  font-size: 15px;
  margin-bottom: 0;
}

.table-wrapper {
  position: relative;
  height: 500px;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: white;
}

.table-responsive {
  height: 100%;
  overflow: auto;
}

.table {
  margin-bottom: 0;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

thead th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

.loading-message,
.error-message {
  padding: 1rem;
  text-align: center;
}

/* Custom scrollbar */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Modal backdrop */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Ensure modal appears above backdrop */
.modal {
  z-index: 1050;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-wrapper {
    height: 400px;
  }
  
  .table {
    font-size: 0.875rem;
  }
}
</style>