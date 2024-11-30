<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account-group" title="Sette Tre" to="/" />
      
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRootStore } from '@/rootStore'

export default defineComponent({
  components: {},
  methods: {},
  computed: {
    drawer: {
      get(): { valueOf: () => boolean } {
        return this.store.drawer
      },
      set(newValue: boolean) {
        this.store.drawer = newValue
      }
    }
  },
  setup() {
    const store = useRootStore()
    return { store }
  }
})
</script>
