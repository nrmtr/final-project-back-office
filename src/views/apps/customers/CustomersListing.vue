<script setup lang="ts">
import { ref } from "vue";
import { useProcessors } from "@/core/data/useProcessor";
import type { IProcessor } from "@/core/data/processor";

const { processors, loading, error, addProcessor, updateProcessor, deleteProcessor } = useProcessors();

const showModal = ref(false);
const isEditing = ref(false);
const processorForm = ref<IProcessor>({
  id:  null,
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

// Open Add Modal
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

// Open Edit Modal
const openEditModal = (processor: any) => {
  isEditing.value = true;
  processorForm.value = { ...processor };
  showModal.value = true;
};

// Handle Submit
const handleSubmit = async () => {
  if (isEditing.value) {
    await updateProcessor(processorForm.value);
  } else {
    await addProcessor(processorForm.value);
  }
  showModal.value = false;
};

// Delete Processor
const handleDelete = async (id: number) => {
  await deleteProcessor(id);
};
</script>

<template>
  <div class="processors-container">
    <h2>Processor Rankings</h2>

    <!-- Add Button -->
    <button @click="openAddModal" class="add-btn">Add Processor</button>

    <div v-if="loading">Loading processor rankings...</div>
    <div v-else-if="error">{{ error }}</div>
    
    <!-- Table for displaying processors -->
    <table v-else class="processors-table">
      <thead>
        <tr>
          <th>Processor</th>
          <th>Rating</th>
          <th>Antutu 10 Score</th>
          <th>Geekbench 6 Score</th>
          <th>Cores</th>
          <th>Clock Speed (GHz)</th>
          <th>GPU</th>
          <th>Added on</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="processor in processors" :key="processor.id ?? 'temp-key'">
          <td>{{ processor.processor }}</td>
          <td>{{ processor.rating }}</td>
          <td>{{ processor.antutu_10 }}</td>
          <td>{{ processor.geekbench_6 }}</td>
          <td>{{ processor.cores }}</td>
          <td>{{ processor.clock }}</td>
          <td>{{ processor.gpu }}</td>
          <td>{{ processor.createdAt }}</td>
          <td>
            <!-- Edit Button -->
            <button @click="openEditModal(processor)" class="edit-btn">Edit</button>
            <!-- Delete Button -->
            <button @click="processor.id !== null ? handleDelete(processor.id) : null" class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? "Edit Processor" : "Add Processor" }}</h3>
        <label>Processor Name:</label>
        <input v-model="processorForm.processor" type="text" />

        <label>Rating:</label>
        <input v-model="processorForm.rating" type="text" />

        <label>Antutu 10 Score:</label>
        <input v-model="processorForm.antutu_10" type="text" />

        <label>Geekbench 6 Score:</label>
        <input v-model="processorForm.geekbench_6" type="text" />

        <label>Cores:</label>
        <input v-model="processorForm.cores" type="text" />

        <label>Clock Speed (GHz):</label>
        <input v-model="processorForm.clock" type="text" />

        <label>GPU:</label>
        <input v-model="processorForm.gpu" type="text" />

        <div class="modal-buttons">
          <button @click="handleSubmit">{{ isEditing ? "Update" : "Add" }}</button>
          <button @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.processors-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}
.processors-list {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
.processor-card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
}
.add-btn, .edit-btn {
  margin-top: 10px;
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.edit-btn {
  background: #28a745;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
.modal-content label {
  display: block;
  margin-top: 10px;
}
.modal-content input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
.modal-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
