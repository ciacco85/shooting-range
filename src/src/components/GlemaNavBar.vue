<template>
  <v-app-bar app color="green-darken-1" dense>
    <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">Shooting range</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts">
import router from "@/router";
import GlemaButton from "./GlemaButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { GlemaButton },
  data: () => ({

  }),
  methods: {
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