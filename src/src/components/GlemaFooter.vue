<template>
  <v-footer app :border="'sm'" absolute>
    <v-row justify="center" no-gutters>
      <GlemaButton
        @click="RouterChange(-1)"
        icon="mdi-arrow-left"
        color="black"
        class="mx-4"
      ></GlemaButton>
      <slot></slot>
      <GlemaButton
        @click="RouterChange(1)"
        icon="mdi-arrow-right"
        color="black"
        class="mx-4"
      ></GlemaButton>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import GlemaButton from '@/components/GlemaButton.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { GlemaButton },
  props: {},
  emits: [],
  methods: {
    RouterChange(page: number) {
      this.$router.go(page)
    }
  },
  computed: {}
})
</script>
]
<style>
#footer {
  position: fixed;
  bottom: 0;
}
</style>
