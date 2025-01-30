<template>
  <div
    class="card"
    :class="className"
    
  >
    <!--begin::Card body-->
    <div class="card-body d-flex align-items-end pt-0">
      <!--begin::Progress-->
      <div class="d-flex align-items-center flex-column mt-3 w-100">
        <div
          class="d-flex justify-content-between fw-bold fs-6"
        >
        <div class="d-flex justtify-content-center">
          <img src="/public/media/avatars/samsung-galaxy-a16-lte.jpg" alt="" style="height: 96px;">
        </div>
          <!-- <span>43 Pending</span>
          <span>72%</span> -->
        </div>


      </div>
      <!--end::Progress-->
    </div>

    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-1",
  components: {},
  props: {
    className: { type: String, required: false },
    bgColor: { type: String, required: false, default: "#080655" },
    bgImage: { type: String, required: false },
    description: { type: String, required: true },
  },
});
</script>
