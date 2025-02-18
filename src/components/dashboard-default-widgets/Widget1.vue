<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface Phone {
  id: number;
  brand: string;
  name: string;
  slug: string;
  image: string;
  price: string;
  tags: string[];
}

interface Tag {
  id: number;
  name: string;
}

const phones = ref<Phone[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedPhone = ref<Phone | null>(null);
const filteredPhones = ref<Phone[]>([]);
const showModal = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref("");
const editableTags = ref<number[]>([]); // Store tags as an array for el-select
const availableTags = ref<Tag[]>([
  { id: 1, name: "general" },
  { id: 2, name: "gaming" },
  { id: 3, name: "take beautiful photos" },
  { id: 4, name: "rider" },
  { id: 5, name: "ai features" },
  { id: 6, name: "live streaming" },
]);
const editingPrice = ref(false);
const newPrice = ref("");


interface Advantage {
  id: number;
  description: string;
}

interface Disadvantage {
  id: number;
  description: string;
}

interface Review {
  id: number;
  review_link: string;
}

interface Shop {
  id: number;
  shop_link: string;
}

const advantages = ref<Advantage[]>([]); 
const disadvantages = ref<Disadvantage[]>([]); 
const reviews = ref<Review[]>([]);
const shops = ref<Shop[]>([]);

const editingAdvantage = ref<number | null>(null);
const editingDisadvantage = ref<number | null>(null);
const editingReview = ref<number | null>(null);
const editingShop = ref<number | null>(null);

const newAdvantage = ref("");
const newDisadvantage = ref("");
const newReview = ref("");
const newShop = ref("");


// Fetch phones from the API
const fetchPhones = async (page: number = 1, search: string = "") => {
  loading.value = true;
  error.value = null;

  try {
    const API_URL = `${API_BASE_URL}/phone/list`;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: ["samsung", "apple", "vivo", "xiaomi", "huawei", "oneplus", "oppo", "realme","honor"],
        category: ["general", "gaming", "take beautiful photos", "rider", "ai features", "live streaming"],
        page: page,
        limit: 50,
        search: search,
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch phones");

    const phoneData = await response.json();
    if (!phoneData?.data) throw new Error("Invalid data structure");

    phones.value = phoneData.data;
    filteredPhones.value = phoneData.data;
    totalPages.value = phoneData.totalPages;
  } catch (err) {
    error.value = (err as Error).message || "An unknown error occurred";
  } finally {
    loading.value = false;
  }
};

// Handle search
const handleSearch = () => {
  // Reset to first page on new search
  currentPage.value = 1;

  // Fetch phones with search query
  fetchPhones(currentPage.value, searchQuery.value);

  const query = searchQuery.value.toLowerCase();
  filteredPhones.value = phones.value.filter((phone) => {
    return Object.values(phone).some((value) => {
      // Check if the query is found within the string fields
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }

      // If the value is an array (e.g., tags), check if the query is found in any of its items
      if (Array.isArray(value)) {
        return value.some(tag => tag.toLowerCase().includes(query));
      }

      return false;
    });
  });
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
const openModal = async (phone: Phone) => {
  if (!phone?.id) {
    console.error("Invalid phone data:", phone);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Invalid phone data.',
    });
    return;
  }
  // editableTags.value = phone.tags; // Set tags as an array
  selectedPhone.value = { ...phone };
  showModal.value = true;
  newPrice.value = phone.price;

  editableTags.value = phone.tags
    .map(tag => availableTags.value.find(t => t.name === tag)?.id)
    .filter(id => id !== undefined) as number[];

  selectedPhone.value = { ...phone };
  showModal.value = true;

  try {
    // Fetch advantages
    const advantagesResponse = await fetch(`${API_BASE_URL}/phone/strength_and_weakness/${phone.id}/strength`);
    if (advantagesResponse.ok) {
      const advantagesData = await advantagesResponse.json();
      advantages.value = advantagesData.data.map((item: any) =>({
        id: item.id,
        description: item.description
      }));
    } 

    // Fetch disadvantages
    const disadvantagesResponse = await fetch(`${API_BASE_URL}/phone/strength_and_weakness/${phone.id}/weakness`);
    if (disadvantagesResponse.ok) {
      const disadvantagesData = await disadvantagesResponse.json();
      disadvantages.value = disadvantagesData.data.map((item: any) => ({
        id: item.id,
        description: item.description
      }));
    }

    // Fetch reviews
    const reviewsResponse = await fetch(`${API_BASE_URL}/phone/reviews/id/${phone.id}`);
    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      reviews.value = reviewsData.data.map((item: any) => ({
        id: item.id,
        review_link: item.review_link
      }));
    }
    
    // Fetch shops
    const shopsResponse = await fetch(`${API_BASE_URL}/phone/shops/id/${phone.id}`);
    if (shopsResponse.ok) {
      const shopsData = await shopsResponse.json();
      shops.value = shopsData.data.map((item: any) => ({
        id: item.id,
        shop_link: item.shop_link
      }));
    }
  } catch (error) {
    console.error("Error fetching additional data: ", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to fetch additional data.',
    });
  }
};

// Function to update tags
const updateTags = async () => {
  if (!selectedPhone.value) return;

  try {
    const response = await fetch(`${API_BASE_URL}/phone/update_tags`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          phone_id: selectedPhone.value.id,
          tags: editableTags.value, // Send updated tags as an array
        },
      ]),
    });

    if (!response.ok) throw new Error("Failed to update tags");

    showSuccessPopup("แท็กอัพเดทเรียบร้อย!");

    // Immediately update local data
    selectedPhone.value.tags = editableTags.value.map(tagId =>
      availableTags.value.find(tag => tag.id === tagId)?.name || ""
    );

    phones.value = phones.value.map(phone =>
      phone.id === selectedPhone.value?.id ? { ...phone, tags: selectedPhone.value!.tags } : phone
    );

    closeModal(); // Close modal after update
    fetchPhones(currentPage.value, searchQuery.value);

  } catch (error) {
    showErrorPopup("Failed to update tags");
    console.error("Error updating tags:", error);
  }
};

const startEdit = (type: string, index: number) => {
  if (type === 'advantage') {
    editingAdvantage.value = index;
  } else if (type === 'disadvantage') {
    editingDisadvantage.value = index;
  } else if (type === 'review') {
    editingReview.value = index;
  } else if (type === 'shop') {
    editingShop.value = index;
  }
};

const cancelEdit = (type: string) => {
  if (type === 'advantage') {
    editingAdvantage.value = null;
  } else if (type === 'disadvantage') {
    editingDisadvantage.value = null;
  } else if (type === 'review') {
    editingReview.value = null;
  } else if (type === 'shop') {
    editingShop.value = null;
  }
};

const saveAdvantage = async (index: number) => {
  const advantage = advantages.value[index];
  if (!advantage || !advantage.id) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Invalid advantage data.',
    });
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/phone/strength_and_weakness/${advantages.value[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: advantages.value[index].description,
      }),
    });
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ข้อดีถูกบันทึกเรียบร้อยแล้ว',
      });
      closeModal();
    }
    if (!response.ok) throw new Error("Failed to save advantage");


    editingAdvantage.value = null;
  } catch (error) {
    console.error("Error saving advantage: ",error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to save advantage. Please try again.',
    });
  }
};

const saveDisadvantage = async (index: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/strength_and_weakness/${disadvantages.value[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: disadvantages.value[index].description,
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ข้อเสียถูกบันทึกเรียบร้อยแล้ว',
      });
      closeModal();
    }
    if (!response.ok) throw new Error("Failed to save disadvantage");

    editingDisadvantage.value = null;
  } catch (error) {
    console.error("Error saving disadvantage: ",error);
  }
};

const saveReview = async (index: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/reviews/${reviews.value[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_link: reviews.value[index].review_link,
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'รีวิวถูกบันทึกเรียบร้อยแล้ว',
      });
      closeModal();
    }

    if (!response.ok) throw new Error("Failed to save review");

    editingReview.value = null;
  } catch (error) {
    console.error("Error saving review: ",error);
  }
};

const saveShop = async (index: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/shops/${shops.value[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop_link: shops.value[index].shop_link,
      }),
    });
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ช็อปถูกบันทึกเรียบร้อยแล้ว',
      });
      closeModal();
      fetchPhones(currentPage.value, searchQuery.value);
    }

    if (!response.ok) throw new Error("Failed to save shop");

    editingShop.value = null;
  } catch (error) {
    console.error("Error saving shop: ",error);
  }
};

const formatNumberWithCommas = (number: string): string => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const removeCommas = (str: string): string => {
  return str.replace(/,/g, '');
};

const validateAndFormatPrice = (value: string): string => {
  // Remove any commas and non-digit characters
  const cleanValue = removeCommas(value).replace(/[^\d]/g, '');
  
  // Return empty string if no valid digits
  if (!cleanValue) return '';
  
  // Convert to number and format with commas
  const numValue = parseInt(cleanValue);
  return formatNumberWithCommas(numValue.toString());
};

watch(newPrice, (value) => {
  if (value) {
    newPrice.value = validateAndFormatPrice(value);
  }
});

const savePrice = async () => {
  if (!selectedPhone.value || !newPrice.value) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Invalid price data.', 
    });
    return;
  }
  const priceWithoutCommas = removeCommas(newPrice.value);
  if (!priceWithoutCommas) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'โปรดกรอกราคาที่ถูกต้อง (เฉพาะตัวเลขเท่านั้น)',
    })
  }
  // Validate price before saving
  const validatedPrice = validateAndFormatPrice(newPrice.value);
  if (!validatedPrice) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter a valid price (numbers only).', 
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/phone/update_price`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_id: selectedPhone.value.id,
        price: priceWithoutCommas,
        // price: validatedPrice,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update price");
    }

    const formattedPrice = formatNumberWithCommas(priceWithoutCommas);
    selectedPhone.value.price = formattedPrice;
    // selectedPhone.value.price = newPrice.value.trim();
    // phones.value = phones.value.map(phone =>
    //   phone.id === selectedPhone.value?.id ? { ...phone, price: newPrice.value.trim() } : phone
    // );
    phones.value = phones.value.map(phone =>
      phone.id === selectedPhone.value?.id ? { ...phone, price: formattedPrice } : phone
    );

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'อัพเดทราคาเรียบร้อยแล้ว!',
      });      
    }
    closeModal();
    fetchPhones(currentPage.value, searchQuery.value);

    editingPrice.value = false; // Exit edit mode

  } catch (error) {
    console.error("Error updating price: ", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to update price. Please try again.',
    });
  }
}

const formatDisplayPrice = (price: string): string => {
  if (!price) return '';
  return formatNumberWithCommas(removeCommas(price));
};


const deletePhone = async (phoneId: number) => {
  const confirmation = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: "คุณจะไม่สามารถกู้คืนโทรศัพท์นี้ได้!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (confirmation.isConfirmed) {
    try {
      const response = await fetch(`${API_BASE_URL}/phone/${phoneId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete phone");

      // Remove the deleted phone from the local list
      phones.value = phones.value.filter(phone => phone.id !== phoneId);
      filteredPhones.value = filteredPhones.value.filter(phone => phone.id !== phoneId);

      showSuccessPopup("โทรศัพท์ถูกลบเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error deleting phone:", error);
      showErrorPopup("เกิดข้อผิดพลาดในการลบโทรศัพท์");
    }
  }
};

const deleteAdvantage = async (index: number) => {
  const advantage = advantages.value[index];
  if (!advantage || !advantage.id) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Invalid advantage data.',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/phone/strength_and_weakness/${advantages.value[index].id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ข้อดีลบเรียบร้อยแล้ว',
      });
      closeModal();
    }
    if (!response.ok) throw new Error("Failed to delete advantage");

    advantages.value.splice(index, 1);
  } catch (error) {
    console.error("Error deleting advantage: ",error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to delete advantage. Please try again.',
    });
  }
};

const deleteDisadvantage = async (index: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/strength_and_weakness/${disadvantages.value[index].id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ข้อเสียลบเรียบร้อยแล้ว',
      })
      closeModal();
    }
    if (!response.ok) throw new Error("Failed to delete disadvantage");

    disadvantages.value.splice(index, 1);
  } catch (error) {
    console.error("Error deleting disadvantage: ",error);
  }
};

const deleteReview = async (index: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/reviews/${reviews.value[index].id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'รีวิวลบเรียบร้อยแล้ว',
      });
      closeModal();
    }

    if (!response.ok) throw new Error("Failed to delete review");

    reviews.value.splice(index, 1);
  } catch (error) {
    console.error("Error deleting review: ",error);
  }
};

const deleteShop = async (index: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/shops/${shops.value[index].id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ช็อปลบเรียบร้อยแล้ว',
      });
      closeModal();
    }
    if (!response.ok) throw new Error("Failed to delete shop"); 

    shops.value.splice(index, 1);
  } catch (error) {
    console.error("Error deleting shop: ",error);
  }
};

const addAdvantage = async () => {
  if (!newAdvantage.value || !selectedPhone.value) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter a valid advantage description.',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/phone/strength_and_weakness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_id: selectedPhone.value.id,
        type: "strength",
        description: newAdvantage.value.trim(),
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ข้อดีถูกเพิ่มเรียบร้อยแล้ว',
      });
      closeModal();
    }


    if (!response.ok) throw new Error("Failed to add advantage");

    const newAdvantageData = await response.json();
    advantages.value.push({
      id: newAdvantageData.id,
      description: newAdvantageData.description,
    });

    newAdvantage.value = "";
  } catch (error) {
    console.error("Error adding advantage: ",error);
  }
};

const addDisadvantage = async () => {
  if (!newDisadvantage.value || !selectedPhone.value) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/phone/strength_and_weakness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_id: selectedPhone.value.id,
        type: "weakness",
        description: newDisadvantage.value,
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ข้อเสียถูกเพิ่มเรียบร้อยแล้ว',
      });
      closeModal();
    }

    if (!response.ok) throw new Error("Failed to add disadvantage");

    const newDisadvantageData = await response.json();
    disadvantages.value.push({
      id: newDisadvantageData.id,
      description: newDisadvantageData.description,
    });
    newDisadvantage.value = "";
  } catch (error) {
    console.error("Error adding disadvantage: ",error);
  }
};

const addReview = async () => {
  if (!newReview.value || !selectedPhone.value) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/phone/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_id: selectedPhone.value.id,
        review_link: newReview.value,
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'รีวิวถูกเพิ่มเรียบร้อยแล้ว',
      });
      closeModal();
    }

    if (!response.ok) throw new Error("Failed to add review");

    const newReviewData = await response.json();
    reviews.value.push({
      id: newReviewData.id,
      review_link: newReviewData.review_link,
    });
    newReview.value = "";
  } catch (error) {
    console.error("Error adding review: ",error);
  }
};

const addShop = async () => {
  if (!newShop.value || !selectedPhone.value) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/phone/shops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_id: selectedPhone.value.id,
        shop_link: newShop.value,
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ช็อปถูกเพิ่มเรียบร้อยแล้ว',
      });
      closeModal();
    }

    if (!response.ok) throw new Error("Failed to add shop");

    const newShopData = await response.json();
    shops.value.push({
      id: newShopData.id,
      shop_link: newShopData.shop_link,
    });
    newShop.value = "";
  } catch (error) {
    console.error("Error adding shop: ",error);
  }
};

const showSuccessPopup = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: 'สําเร็จ',
    text: message,
    showConfirmButton: true,
    customClass: {
      popup: "swal-custom-zindex",
    },
  });
};

const showErrorPopup = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    showConfirmButton: true,
    customClass: {
      popup: "swal-custom-zindex",
    },
    didOpen: () => {
        // Find the parent div with class 'swal2-container' and set its z-index
        const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
        if (swalContainer) {
          swalContainer.style.zIndex = '10000';
        }
      }
  });
};

const generalTags = [1]; // General tags (IDs) that should not be removed
const handleRemoveTag = (tagId: number) => {

  if (generalTags.includes(tagId)) {
    Swal.fire({
      icon: "warning",
      title: "คุณไม่สามารถลบแท็ก General ได้",
      text: "แท็กนี้จําเป็นและไม่สามารถลบได้",
      showConfirmButton: true,
      customClass: {
        popup: "swal-custom-zindex",
      },
      didOpen: () => {
        // Find the parent div with class 'swal2-container' and set its z-index
        const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
        if (swalContainer) {
          swalContainer.style.zIndex = '10000';
        }
      }
    });

    // Re-add the tag to prevent removal
    if (!editableTags.value.includes(tagId)) {
      editableTags.value.push(tagId);
    }
  } else {
    // Allow removal of other tags
    editableTags.value = editableTags.value.filter(id => id !== tagId);
  }
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
    <h2>รายการโทรศัพท์</h2>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาโดย ชื่อ หรือ ยี่ห้อ..."
        @input="handleSearch"
      />
    </div>

    <!-- Pagination (Top) -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">ก่อนหน้า</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">ถัดไป</button>
    </div>
    
    <!-- Loading and Error States -->
    <div v-if="loading">Loading phones...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Phone Grid -->
    <div v-else class="grid">
      <div
        v-for="phone in filteredPhones"
        :key="phone.id"
        class="card"
        @click="openModal(phone)"
      >
        <img :src="phone.image || 'fallback-image-url'" alt="Phone Image" class="phone-img" />
        <h3>{{ phone.name }}</h3>
        <p><strong>Brand:</strong> {{ phone.brand }}</p>
        <p><strong>Price:</strong> {{ formatDisplayPrice(phone.price) }}</p>
        <ul class="list-inline d-flex justify-content-end">
          <li class="list-inline-item">
            <button class="btn btn-danger btn-sm rounded d-flex align-items-center justify-content-center"
              @click.stop="deletePhone(phone.id)" type="button"
              data-toggle="tooltip" data-placement="top" title="Delete"
              style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;"
              >
              <i class="bi bi-trash" style="font-size: 1.2rem; line-height: 1; position: relative; top: 1px; left: 2px;"></i>
            </button>
          </li>          
        </ul>

      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">ก่อนหน้า</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">ถัดไป</button>
    </div>

    <!-- Modal -->
    <!-- Updated Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true" @click.stop>
        <span class="close-btn" @click="closeModal" aria-label="Close modal">&times;</span>
        
        <template v-if="selectedPhone">
          <div class="modal-header justify-content-center">
            <div class="row">
              <div class="col ">
                <img :src="selectedPhone.image || 'fallback-image-url'" alt="Phone Image" class="modal-img" />
                <div class="text-center">
                  <h2 id="modal-title">{{ selectedPhone.name || 'No Name' }}</h2>

                </div>
              </div>
            </div>

          </div>

          <div class="modal-body">
            <!-- Tags Section -->
            <div class="modal-section">
              <h4>แท็ก</h4>
              <el-select
                v-model="editableTags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Choose tags for your phone"
                popper-append-to-body="false"
                :teleported="false"
                class="full-width-select"
                @remove-tag="handleRemoveTag"
              >
                <el-option
                  v-for="tag in availableTags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </div>

            <!-- Advantages Section -->
            <div class="modal-section">
              <h4>ข้อดี</h4>
              <ul class="feature-list">
                <li v-for="(advantage, index) in advantages" :key="advantage.id" type="1" >
                  <template v-if="editingAdvantage === index">
                    <div class="edit-item">
                      <input type="text" v-model="advantage.description" class="edit-input" />
                      <div class="button-group">
                        <button class="btn btn-primary" @click="saveAdvantage(index)">Save</button>
                        <button class="btn btn-danger" @click="cancelEdit('advantage')">Cancel</button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="list-item">
                      <span>{{ advantage.description }}</span>
                      <div class="button-group">
                        <button class="btn btn-primary" @click="startEdit('advantage', index)">แก้ไข</button>
                        <button class="btn btn-danger" @click="deleteAdvantage(index)">ลบ</button>
                      </div>
                    </div>
                  </template>
                </li>
              </ul>
              <div class="add-item">
                <input type="text" v-model="newAdvantage" placeholder="เพิ่มข้อดี..." class="add-input" />
                <button class="btn btn-success" @click="addAdvantage">เพิ่ม</button>
              </div>
            </div>

            <!-- Disadvantages Section -->
            <div class="modal-section">
              <h4>ข้อเสีย</h4>
              <ul class="feature-list">
                <li v-for="(disadvantage, index) in disadvantages" :key="disadvantage.id" type="1">
                  <template v-if="editingDisadvantage === index">
                    <div class="edit-item">
                      <input type="text" v-model="disadvantage.description" class="edit-input" />
                      <div class="button-group">
                        <button class="btn btn-primary" @click="saveDisadvantage(index)">Save</button>
                        <button class="btn btn-danger" @click="cancelEdit('disadvantage')">Cancel</button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="list-item">
                      <span>{{ disadvantage.description }}</span>
                      <div class="button-group">
                        <button class="btn btn-primary" @click="startEdit('disadvantage', index)">แก้ไข</button>
                        <button class="btn btn-danger" @click="deleteDisadvantage(index)">ลบ</button>
                      </div>
                    </div>
                  </template>
                </li>
              </ul>
              <div class="add-item">
                <input type="text" v-model="newDisadvantage" placeholder="เพิ่มข้อเสีย..." class="add-input" />
                <button class="btn btn-success" @click="addDisadvantage">เพิ่ม</button>
              </div>
            </div>

            <!-- Reviews Section -->
            <div class="modal-section">
              <h4>รีวิว</h4>
              <ul class="feature-list">
                <li v-for="(review, index) in reviews" :key="review.id" type="1">
                  <template v-if="editingReview === index">
                    <div class="edit-item">
                      <input type="text" v-model="review.review_link" class="edit-input" />
                      <div class="button-group">
                        <button class="btn btn-primary" @click="saveReview(index)">Save</button>
                        <button class="btn btn-danger" @click="cancelEdit('review')">Cancel</button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="list-item">
                      <a :href="review.review_link" target="_blank" class="link-item">{{ review.review_link }}</a>
                      <div class="button-group">
                        <button class="btn btn-primary" @click="startEdit('review', index)">แก้ไข</button>
                        <button class="btn btn-danger" @click="deleteReview(index)">ลบ</button>
                      </div>
                    </div>
                  </template>
                </li>
              </ul>
              <div class="add-item">
                <input type="url" v-model="newReview" placeholder="เพิ่มรีวิว..." class="add-input" />
                <button class="btn btn-success" @click="addReview">เพิ่ม</button>
              </div>
            </div>

            <!-- Shops Section -->
            <div class="modal-section">
              <h4>ช็อป</h4>
              <ul class="feature-list">
                <li v-for="(shop, index) in shops" :key="shop.id" type="1">
                  <template v-if="editingShop === index">
                    <div class="edit-item">
                      <input type="text" v-model="shop.shop_link" class="edit-input" />
                      <div class="button-group">
                        <button class="btn btn-primary" @click="saveShop(index)">Save</button>
                        <button class="btn btn-danger" @click="cancelEdit('shop')">Cancel</button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="list-item">
                      <a :href="shop.shop_link" target="_blank" class="link-item">{{ shop.shop_link }}</a>
                      <div class="button-group">
                        <button class="btn btn-primary" @click="startEdit('shop', index)">แก้ไข</button>
                        <button class="btn btn-danger" @click="deleteShop(index)">ลบ</button>
                      </div>
                    </div>
                  </template>
                </li>
              </ul>
              <div class="add-item">
                <input type="url" v-model="newShop" placeholder="เพิ่มช็อป..." class="add-input" />
                <button class="btn btn-success" @click="addShop">เพิ่ม</button>
              </div>
            </div>

            <!-- Price Section -->
            <div class="modal-section">
              <h4>ราคา</h4>
              <template v-if="editingPrice">
                <div class="edit-item">
                  <input type="text" v-model="newPrice" class="edit-input" placeholder="Enter new price" pattern="[0-9]*" inputmode="numeric">
                  <div class="button-group">
                    <button class="btn btn-primary" @click="savePrice">บันทึก</button>
                    <button class="btn btn-danger" @click="editingPrice = false">ยกเลิก</button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="list-item">
                  <p class="price-display">{{ formatDisplayPrice(selectedPhone.price) || 'N/A' }}</p>
                  <!-- <span>{{ selectedPhone.price || 'N/A' }}</span> -->
                  <div class="button-group">
                    <button class="btn btn-primary" @click="editingPrice = true; newPrice = selectedPhone.price">แก้ไข</button>
                  </div>
                </div>
              </template>
              <!-- <p class="price-display">{{ selectedPhone.price || 'N/A' }}</p> -->
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="updateTags">อัพเดทแท็ก</button>
            <button type="button" class="btn btn-danger" @click="closeModal">ปิด</button>
          </div>
        </template>
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

.swal2-container {
  z-index: 10000 !important;
}

.el-select-dropdown {
  z-index: 10001 !important;
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

.modal {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 90%;
  background: white;
  border-radius: 12px;
  position: relative;
}

.modal-header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #eee;
}

.modal-img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 15px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.modal-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.modal-section:last-child {
  border-bottom: none;
}

.modal-section h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1em;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item, .edit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 0 5px;
  margin-bottom: 8px;
}

.li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  list-style: none;
}

.button-group {
  display: flex;
  gap: 8px;
}

.edit-input, .add-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}

.add-item {
  display: flex;
  margin-top: 12px;
}

.link-item {
  color: #2196F3;
  text-decoration: none;
  word-break: break-all;
}

.full-width-select {
  width: 100%;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 10px;
}


.price-display {
  font-size: 1.2em;
  font-weight: bold;
  color: #2196F3;
}


/* Ensure el-select dropdown appears above modal */
:deep(.el-select-dropdown) {
  z-index: 10002 !important;
}
</style>