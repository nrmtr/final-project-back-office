<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Phone {
  slug: string;
  image: string;
  phone_name: string;
  brand: string;
  detail: string;
}

interface ApiResponse {
  data: {
    title: string;
    current_page: number;
    last_page: number;
    phones: Phone[];
  };
}

export default defineComponent({
  data() {
    return {
      brands: [
        { name: 'Samsung', slug: 'samsung-phones-9' },
        { name: 'Vivo', slug: 'vivo-phones-98' },
        { name: 'Xiaomi', slug: 'xiaomi-phones-80' },
        { name: 'Apple', slug: 'apple-phones-48' },
        { name: 'Honor', slug: 'honor-phones-121' },
        { name: 'Huawei', slug: 'huawei-phones-58' },
        { name: 'OnePlus', slug: 'oneplus-phones-95' },
        { name: 'Oppo', slug: 'oppo-phones-82' },
        { name: 'Realme', slug: 'realme-phones-118' },
      ],
      phones: [] as Phone[],
      loading: false as boolean,
      currentPage: 1,
      totalPages: 1,
      selectedBrandSlug: null as string | null, // Add this line

    };
  },
  methods: {
    async searchByBrand(brand_slug: string, page: number = 1) {
      this.loading = true;
      try {
        const response: AxiosResponse<ApiResponse> = await axios.get(
          `${API_BASE_URL}/phone/brands/${brand_slug}?page=${page}`
        );
        console.log("Response data: ", response);
        const responseData = response.data.data;

        this.phones = responseData.phones;
        this.currentPage = responseData.current_page;
        this.totalPages = responseData.last_page;
        this.selectedBrandSlug = brand_slug;
      } catch (error) {
        console.error('Error fetching phone data:', error);
        this.phones = [];
      } finally {
        this.loading = false;
      }
    },
    async addToDatabase(slug: string) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;
        const response: AxiosResponse = await axios.post(
          `${API_BASE_URL}/phone/add_phone`,
          { slug }
        );
        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: `โทรศัพท์กับ slug "${slug}" ถูกเพิ่มเข้าฐานข้อมูลเรียบร้อยแล้ว!`,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: `ล้มเหลวในการเพิ่มโทรศัพท์กับ slug "${slug}" ไปยังฐานข้อมูล`,
          });
        }
      } catch (error) {
        console.error('Error adding phone to database:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: `เกิดข้อผิดพลาดในการเพิ่มโทรศัพท์กับ slug "${slug}" ไปยังฐานข้อมูล`,
        });
      }
    },
  },
});
</script>

<template>
  <div>
    <h1>ค้นหาโดยยี่ห้อ</h1>
    <div class="button-container">
      <button
        v-for="(brand, index) in brands"
        :key="index"
        @click="searchByBrand(brand.slug)"
        class="brand-button"
      >
        {{ brand.name }}
      </button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="phones.length > 0" class="grid">
        <div v-for="phone in phones" :key="phone.slug" class="card">
          <img :src="phone.image" :alt="phone.phone_name" class="phone-img" />
          <h2>{{ phone.phone_name }}</h2>
          <p>{{ phone.brand }}</p>
          <button @click="addToDatabase(phone.slug)" class="btn btn-success btn-sm">
            เพิ่มข้อมูล
          </button>
        </div>
      </div>
      <div v-else>
        <p>กรุณาเลือกแบรนด์, กดหน้าถัดไปเพื่อดูรุ่นโทรศัพท์</p>
      </div>

      <div class="pagination">
        <button
          @click="searchByBrand(selectedBrandSlug ?? '', currentPage - 1)"
          :disabled=" !selectedBrandSlug || currentPage === 1"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="searchByBrand(selectedBrandSlug ?? '', currentPage + 1)"
          :disabled="!selectedBrandSlug || currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.brand-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.brand-button:hover {
  background-color: #0056b3;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Responsive layout */
  gap: 5px; /* Reduce spacing between cards */
  justify-content: center;
  padding: 0; /* Remove any extra padding */
}

.card {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  text-align: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  width: 100%;
  max-width: 230px; /* Adjust for better alignment */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: scale(1.03);
}

.phone-img {
  width: 100%;
  max-height: 180px;
  object-fit: contain;
}


.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
  border-color: #0056b3;
}

.pagination span {
  font-size: 16px;
}
</style>