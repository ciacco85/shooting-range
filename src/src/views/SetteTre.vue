<template>
  <div>
    <h1>Sette Tre</h1>
    <GlemaButton
      @click="Beep()"
      icon="mdi-sigma"
      color="primary"
      class="mx-1"
    >
      <v-tooltip activator="parent" location="top"
        >Suona</v-tooltip
      ></GlemaButton
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRootStore } from '@/rootStore'
export default defineComponent({
  methods: {
    Beep() {
      const store = useRootStore();
      store.beep();
    },
  }
});
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
