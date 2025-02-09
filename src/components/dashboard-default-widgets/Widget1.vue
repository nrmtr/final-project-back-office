<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface Phone {
  id: number;
  brand: string;
  name: string;
  slug: string;
  image: string;
  price: string;
  tags: string[];
}

const phones = ref<Phone[]>([]); // All phones fetched from the API
const loading = ref(false);
const error = ref<string | null>(null);
const selectedPhone = ref<Phone | null>(null);
const showModal = ref(false);
const currentPage = ref(1); // Current page
const totalPages = ref(1); // Total pages from API
const searchQuery = ref(""); // Search query

// Fetch phones from the API
const fetchPhones = async (page: number = 1, search: string = "") => {
  loading.value = true;
  error.value = null;

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://13.251.160.30/api/phone/list";
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: ["samsung", "apple", "vivo", "xiaomi", "huawei", "oneplus", "oppo", "realme"],
        category: ["general", "gaming", "take beautiful photos", "rider", "ai features", "live streaming"],
        page: page,
        limit: 50, // Fetch 50 items per page
        search: search, // Include search query in the API request
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch phones");

    const phoneData = await response.json();
    if (!phoneData?.data) throw new Error("Invalid data structure");

    phones.value = phoneData.data;
    totalPages.value = phoneData.totalPages; // Update total pages from API
  } catch (err) {
    error.value = (err as Error).message || "An unknown error occurred";
  } finally {
    loading.value = false;
  }
};

// Handle search
const handleSearch = () => {
  currentPage.value = 1; // Reset to first page on new search
  fetchPhones(currentPage.value, searchQuery.value);
};

// Go to next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchPhones(currentPage.value, searchQuery.value);
  }
};

// Go to previous page
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchPhones(currentPage.value, searchQuery.value);
  }
};

// Open modal
const openModal = (phone: Phone) => {
  if (!phone?.id || !phone?.name) {
    console.error("Invalid phone data:", phone);
    return;
  }
  selectedPhone.value = { ...phone };
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  selectedPhone.value = null;
};

// Fetch phones on mount
onMounted(() => fetchPhones(currentPage.value));
</script>

<template>
  <div class="phone-list">
    <h2>Phone Listings</h2>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or brand..."
        @input="handleSearch"
      />
    </div>

    <!-- Pagination (Top) -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    
    <!-- Loading and Error States -->
    <div v-if="loading">Loading phones...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Phone Grid -->
    <div v-else class="grid">
      <div
        v-for="phone in phones"
        :key="phone.id"
        class="card"
        @click="openModal(phone)"
      >
        <img :src="phone.image || 'fallback-image-url'" alt="Phone Image" class="phone-img" />
        <h3>{{ phone.name }}</h3>
        <p><strong>Brand:</strong> {{ phone.brand }}</p>
        <p><strong>Price:</strong> {{ phone.price }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true" @click.stop>
        <span class="close-btn" @click="closeModal" aria-label="Close modal">&times;</span>

        <template v-if="selectedPhone">
          <img :src="selectedPhone.image || 'fallback-image-url'" alt="Phone Image" class="modal-img" />
          <h2 id="modal-title">{{ selectedPhone.name || 'No Name' }}</h2>
          <p><strong>Brand:</strong> {{ selectedPhone.brand || 'Unknown' }}</p>
          <p><strong>Tags:</strong> {{ selectedPhone.tags?.join(", ") || 'Unknown' }}</p>
          <p><strong>Price:</strong> {{ selectedPhone.price || 'N/A' }}</p>
        </template>

        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.phone-list {
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}


.search-bar input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}

.card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  text-align: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.phone-img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

/* Modal Background */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* border: 2px solid red; */
}

/* Modal Box */
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  position: relative;
  width: 90%;
  max-width: 400px;
  height: auto;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  margin: auto;
  /* border: 2px solid blue;  */
  /* background-color: yellow;  */
  opacity: 1; /* Ensure visibility */
  display: block; /* Ensure visibility */
}

/* Modal Image */
.modal-img {
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  margin-bottom: 10px;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: black;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: black;
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>