<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Define an interface for the phone object
  interface Phone {
    slug: string;
    image: string;
    phone_name: string;
    brand: string;
    detail: string;
  }
  
  // Define an interface for the API response
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
      };
    },
    methods: {
      async searchByBrand(brand_slug: string) {
        this.loading = true;
        try {
          const response: AxiosResponse<ApiResponse> = await axios.get(
            `${API_BASE_URL}/phone/brands/${brand_slug}`
          );
          console.log("Response data: ", response);
          const responseData = response.data.data;
            
          this.phones = responseData.phones;
        } catch (error) {
          console.error('Error fetching phone data:', error);
          this.phones = [];
        } finally {
          this.loading = false;
        }
      },
      async addToDatabase(slug: string) {
        try {
          // Make a POST request to add the phone to the database
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
        <!-- Dynamically generate buttons -->
        <button
          v-for="(brand, index) in brands"
          :key="index"
          @click="searchByBrand(brand.slug)"
          class="brand-button"
        >
          {{ brand.name }}
        </button>
      </div>
  
      <!-- Display search results -->
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
          <p>ไม่พบโทรศัพท์, กรุณาเลือกแบรนด์, คุณได้เพิ่มโทรศัพท์แบรนด์นี้ทั้งหมดแล้ว</p>
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

.list-inline {
  padding: 0;
  margin: 0;
  list-style: none;
}

.list-inline-item {
  display: inline-block;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.rounded {
  border-radius: 50% !important;
}

.d-flex {
  display: flex !important;
}

.align-items-center {
  align-items: center !important;
}

.justify-content-center {
  justify-content: center !important;
}

.bi-trash {
  font-size: 1.2rem;
  line-height: 1;
  position: relative;
  top: 1px;
  left: 2px;
}
</style>