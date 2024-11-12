<template>
  <v-btn
    elevation="2"
    :color="color"
    @click="onClick"
    :block="block"
    :icon="!!icon"
    :disabled="disabled"
    :class="class"
  >
    {{ text }}
    <v-icon v-if="icon">{{ icon }}</v-icon>
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
const clickEmitName = 'click'
export default defineComponent({
  props: {
    color: { type: String, default: 'red-accent-4' },
    text: { type: String, default: '' },
    icon: { type: String, default: '' },
    class: { type: String, default: '' },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  methods: {},
  emits: [clickEmitName],
  setup(_, { emit }) {
    const onClick = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit(clickEmitName, target.value)
    }
    return {
      onClick
    }
  }
})
</script>
