import { ref, onMounted } from "vue";
import axios from "axios";
import type { IProcessor } from "@/core/data/processor";

const API_URL = "http://13.251.160.30/api/phone/processor_rankings"; // Replace with actual API URL

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
    } finally {
      loading.value = false;
    }
  };

  // Add Processor
  const addProcessor = async (newProcessor: IProcessor) => {
    try {
      const response = await axios.post(API_URL, newProcessor);
      processors.value.push(response.data.data);
    } catch {
      error.value = "Failed to add processor";
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
    } catch {
      error.value = "Failed to update processor";
    }
  };

  // Delete Processor
  const deleteProcessor = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      processors.value = processors.value.filter(p => p.id !== id);
    } catch {
      error.value = "Failed to delete processor";
    }
  };

  onMounted(fetchProcessors);

  return { processors, loading, error, fetchProcessors, addProcessor, updateProcessor, deleteProcessor };
}
