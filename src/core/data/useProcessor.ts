import { ref, onMounted } from "vue";
import axios from "axios";
import type { IProcessor } from "@/core/data/processor";
import Swal from "sweetalert2"; // Import SweetAlert2

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/phone/processor_rankings`; // Replace with actual API URL

export function useProcessors() {
  const processors = ref<IProcessor[]>([]);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  // Fetch Processors
  const fetchProcessors = async () => {
    loading.value = true;
    try {
      const response = await axios.get(API_URL);
      processors.value = response.data.data.map((processor: any) => ({
        id: processor.id,
        processor: processor.processor || "Unknown Processor",
        rating: processor.rating || "Unrated",
        antutu_10: processor.antutu_10 || "N/A",
        geekbench_6: processor.geekbench_6 || "N/A",
        cores: processor.cores || "N/A",
        clock: processor.clock || "N/A",
        gpu: processor.gpu || "Unknown GPU",
      }));
    } catch {
      error.value = "Failed to fetch processor rankings";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch processor rankings",
      });
    } finally {
      loading.value = false;
    }
  };

  // Add Processor
  const addProcessor = async (newProcessor: IProcessor) => {
    try {
      const payload = [newProcessor];
      const response = await axios.post(API_URL, payload);
      const updatedProcessors = response.data.data;
      processors.value = updatedProcessors;

      // Show success message
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เพิ่มข้อมูลสำเร็จ!",
      });
    } catch {
      error.value = "Failed to add processor";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "เพิ่มข้อมูล้มเหลว",
      });
    }
  };

  // Edit Processor
  const updateProcessor = async (updatedProcessor: IProcessor) => {
    try {
      await axios.put(`${API_URL}/${updatedProcessor.id}`, updatedProcessor);
      const index = processors.value.findIndex(p => p.id === updatedProcessor.id);
      if (index !== -1) {
        processors.value[index] = updatedProcessor;
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "อัพเดทสำเร็จ!",
      });
    } catch {
      error.value = "Failed to update processor";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "อัพเดตล้มเหลว",
      });
    }
  };

  // Delete Processor
  const deleteProcessor = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      processors.value = processors.value.filter(p => p.id !== id);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "ลบสำเร็จ!",
      });
    } catch {
      error.value = "Failed to delete processor";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ลบล้มเหลว",
      });
    }
  };

  onMounted(fetchProcessors);

  return { processors, loading, error, fetchProcessors, addProcessor, updateProcessor, deleteProcessor };
}