<template>
    <!--begin::Row-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->
      <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
        <Widget1
          className="h-md-50 mb-5 mb-xl-10"
          description="Active Projects"
          bgColor="#F1416C"
          :bgImage="getAssetPath('media/patterns/vector-1.png')"
        />

      </div>
      <!--end::Col-->
      </div>
    <!--end::Row-->
  

  
  </template>
  
  <script lang="ts">
  import { getAssetPath } from "@/core/helpers/assets";
  import { defineComponent } from "vue";
//   import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";


  
  export default defineComponent({
    name: "cpu-manage",
    components: {
    //   Widget1,
      
    },
    setup() {
      return {
        getAssetPath,
        
      };
    },
  });
  </script>
  