<template>
  <!--begin::Tables Widget 1-->
  <div :class="widgetClasses" class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Tasks Overview</span>

        <span class="text-muted fw-semobold fs-7">Pending 10 tasks</span>
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
              <th class="p-0 min-w-200px"></th>
              <th class="p-0 min-w-100px"></th>
              <th class="p-0 min-w-40px"></th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(item, index) in items" :key="index">
              <tr>
                <th>
                  <div class="symbol symbol-50px me-2">
                    <span class="symbol-label">
                      <img
                        :src="item.image"
                        class="h-50 align-self-center"
                        alt=""
                      />
                    </span>
                  </div>
                </th>

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

                <td>
                  <div class="d-flex flex-column w-100 me-2">
                    <div class="d-flex flex-stack mb-2">
                      <span class="text-muted me-2 fs-7 fw-semobold">
                        {{ item.progress.value }}%
                      </span>
                    </div>

                    <div class="progress h-6px w-100">
                      <div
                        :class="`
                          progress-bar
                          bg-${item.progress.color}
                        `"
                        role="progressbar"
                        :style="`width: ${item.progress.value}%`"
                        :aria-valuenow="item.progress.value"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
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
  </div>
  <!--endW::Tables Widget 1-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
// import Dropdown1 from "@/components/dropdown/Dropdown1.vue";

export default defineComponent({
  name: "kt-widget-1",
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
        progress: {
          value: "70",
          color: "primary",
        },
      },

      {
        image: getAssetPath("media/svg/brand-logos/telegram.svg"),
        info: {
          title: "Popular Authors",
          description: "Most Successful",
        },
        progress: {
          value: "50",
          color: "primary",
        },
      },

      {
        image: getAssetPath("media/svg/brand-logos/vimeo.svg"),
        info: {
          title: "New Users",
          description: "Awesome Users",
        },
        progress: {
          value: "80",
          color: "primary",
        },
      },

      {
        image: getAssetPath("media/svg/brand-logos/bebo.svg"),
        info: {
          title: "Active Customers",
          description: "Best Customers",
        },
        progress: {
          value: "90",
          color: "primary",
        },
      },

      {
        image: getAssetPath("media/svg/brand-logos/kickstarter.svg"),
        info: {
          title: "Bestseller Theme",
          description: "Amazing Templates",
        },
        progress: {
          value: "70",
          color: "primary",
        },
      },
    ];

    return {
      items,
      getAssetPath,
    };
  },
});
</script>
