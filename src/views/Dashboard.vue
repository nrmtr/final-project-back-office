<template>
    <!--begin::Row-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->

        <Widget1
          className="h-md-50 mb-5 mb-xl-10"
          description="Active Projects"
          bgColor="#F1416C"
          :bgImage="getAssetPath('media/patterns/vector-1.png')"
        />
  
        <!-- <Widget2
          className="h-md-50 mb-5 mb-xl-10"
          :icon="false"
          stats="357"
          description="Professionals"
          labelColor="dark"
          textColor="gray-300"
        /> -->
      </div>
      <!--end::Col-->

    <!--end::Row-->
  

  
  </template>
  
  <script lang="ts">
  import { getAssetPath } from "@/core/helpers/assets";
  import { defineComponent } from "vue";
  import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
  // import Widget2 from "@/components/dashboard-default-widgets/Widget2.vue";

  
  export default defineComponent({
    name: "main-dashboard",
    components: {
      Widget1,
      // Widget2
    },
    setup() {
      return {
        getAssetPath,
        
      };
    },
  });
  </script>
  