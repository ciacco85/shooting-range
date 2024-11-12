<template>
  <v-app-bar app color="green-darken-1" dense>
    <v-app-bar-nav-icon variant="text" @click.stop="switchDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">Cloud Badger</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts">
import router from "@/router";
import GlemaButton from "./GlemaButton.vue";
import { defineComponent } from "vue";
import { useRootStore } from '@/rootStore'

export default defineComponent({
  components: { GlemaButton },
  data: () => ({

  }),
  methods: {
    switchDrawer(){
      const store = useRootStore()
      return store.switchDrawer();
    },   
    toHome(): void {
      router.push({ name: "about" }).catch((err) => {
        if (err.name !== "NavigationDuplicated" &&
          !err.message.includes("Avoided redundant navigation to current location")) {
          // But print any other errors to the console
          console.log(err);
        }
      });
    }
  },
})
</script>