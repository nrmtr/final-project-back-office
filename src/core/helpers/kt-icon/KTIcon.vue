<script setup lang="ts">
import { computed } from "vue";
import icons from "@/core/helpers/kt-icon/icons.json"; // Make sure this file is typed correctly
import { useConfigStore } from "@/stores/config";

// Add interface for icons
interface IconsType {
  [key: string]: number; // This ensures that we can index `icons` with a string key and get a number
}

// Type assertion for icons
const typedIcons = icons as IconsType; // Assert that icons is of type IconsType

const store = useConfigStore();

interface Props {
  iconName: string;
  iconType?: string;
  iconClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconName: "",
  iconType: "",
  iconClass: ""
});

const currentIconType = computed(() => {
  return props.iconType ? props.iconType : store.config.general.iconsType;
});
</script>

<template>
  <i
    :class="`ki-${currentIconType} ki-${props.iconName}${props.iconClass ? ' ' + props.iconClass : ''}`"
  >
    <template v-if="typedIcons[props.iconName] && currentIconType === 'duotone'">
      <span
        v-for="i in typedIcons[props.iconName]"
        :key="i"
        :class="`path${i}`"
      ></span>
    </template>
  </i>
</template>
