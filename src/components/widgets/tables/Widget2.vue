<template>
  <!--begin::Tables Widget 2-->
  <div :class="widgetClasses" class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Latest Arrivals</span>

        <span class="text-muted mt-1 fw-semobold fs-7"
          >More than 100 new products</span
        >
      </h3>
      <div class="card-toolbar">
        <!--begin::Menu-->
        <button
          type="button"
          class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="top-end"
        >
          <KTIcon icon-name="category" icon-class="fs-2" />
        </button>
        <Dropdown1></Dropdown1>
        <!--end::Menu-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table align-middle gs-0 gy-5">
          <!--begin::Table head-->
          <thead>
            <tr>
              <th class="p-0 w-50px"></th>
              <th class="p-0 min-w-150px"></th>
              <th class="p-0 min-w-150px"></th>
              <th class="p-0 min-w-125px"></th>
              <th class="p-0 min-w-40px"></th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(item, index) in items" :key="index">
              <tr>
                <td>
                  <div class="symbol symbol-50px me-2">
                    <span class="symbol-label">
                      <img
                        :src="item.image"
                        class="h-50 align-self-center"
                        alt=""
                      />
                    </span>
                  </div>
                </td>
                <td>
                  <a
                    href="#"
                    class="text-dark fw-bold text-hover-primary mb-1 fs-6"
                    >{{ item.info.title }}</a
                  >
                  <span class="text-muted fw-semobold d-block fs-7">{{
                    item.info.description
                  }}</span>
                </td>
                <td class="text-end">
                  <template
                    v-for="(item1, index1) in item.badges"
                    :key="index1"
                  >
                    <span
                      :class="`badge-light-${item1.color}`"
                      class="badge fw-semobold me-1"
                      >{{ item1.label }}</span
                    >
                  </template>
                </td>
                <td class="text-end">
                  <span class="text-muted fw-semobold">
                    {{ item.remarks }}
                  </span>
                </td>
                <td class="text-end">
                  <a
                    href="#"
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                  >
                    <KTIcon icon-name="arrow-right" icon-class="fs-2" />
                  </a>
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
        <!--end::Table-->
      </div>
      <!--end::Table container-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Tables Widget 2-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
// import Dropdown1 from "@/components/dropdown/Dropdown1.vue";

export default defineComponent({
  name: "kt-widget-2",
  components: {
    // Dropdown1,
  },
  props: {
    widgetClasses: String,
  },
  setup() {
    const items = [
      {
        image: getAssetPath("media/svg/brand-logos/plurk.svg"),
        info: {
          title: "Top Authors",
          description: "Successful Fellas",
        },
        badges: [
          { label: "Angular", color: "danger" },
          { label: "PHP", color: "info" },
        ],
        remarks: "4600 Users",
      },

      {
        image: getAssetPath("media/svg/brand-logos/telegram.svg"),
        info: {
          title: "Popular Authors",
          description: "Most Successful",
        },
        badges: [
          { label: "HTML", color: "danger" },
          { label: "CSS", color: "info" },
        ],
        remarks: "7200 Users",
      },

      {
        image: getAssetPath("media/svg/brand-logos/vimeo.svg"),
        info: {
          title: "New Users",
          description: "Awesome Users",
        },
        badges: [
          { label: "React", color: "danger" },
          { label: "SASS", color: "info" },
        ],
        remarks: "890  Users",
      },

      {
        image: getAssetPath("media/svg/brand-logos/bebo.svg"),
        info: {
          title: "Active Customers",
          description: "Best Customers",
        },
        badges: [
          { label: "Java", color: "danger" },
          { label: "PHP", color: "info" },
        ],
        remarks: "6370 Users",
      },

      {
        image: getAssetPath("media/svg/brand-logos/kickstarter.svg"),
        info: {
          title: "Bestseller Theme",
          description: "Amazing Templates",
        },
        badges: [
          { label: "Python", color: "danger" },
          { label: "MySQL", color: "info" },
        ],
        remarks: "354 Users",
      },
    ];

    return {
      items,
      getAssetPath,
    };
  },
});
</script>
