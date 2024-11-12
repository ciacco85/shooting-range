<template>
  <v-container>
    <v-card-title primary-title>
      <h2>Sette Tre</h2>
    </v-card-title>
    <GlemaFooter> </GlemaFooter>
    <v-card
      :loading="Loading"
      :title="CurrentDate"
      subtitle="Fai click per iniziare"
      :text="`Total: ${Elapsed} Single ${ElapsedSingle} ${
        IsWaiting ? 'Wait' : 'Shoot'
      } Data ${audioInputDetected}`"
    >
      <audio id="audioCapture"></audio>
      <canvas id="audioCanvas"></canvas>
      <v-card-actions>
        <GlemaButton
          @click="Start()"
          icon="mdi-play"
          color="primary"
          class="mx-1"
        >
          <v-tooltip activator="parent" location="top"
            >Start</v-tooltip
          ></GlemaButton
        >
        <GlemaButton
          @click="Stop()"
          icon="mdi-stop"
          color="primary"
          class="mx-1"
        >
          <v-tooltip activator="parent" location="top"
            >Stop</v-tooltip
          ></GlemaButton
        >
        <GlemaButton
          @click="setupMicInputListener()"
          icon="mdi-stop"
          color="primary"
          class="mx-1"
        >
          <v-tooltip activator="parent" location="top"
            >Analyze</v-tooltip
          ></GlemaButton
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRootStore } from "@/rootStore";
export default defineComponent({
  data: () => ({
    CurrentDate: "",
    Interval: null,
    StartTime: Date.now(),
    SingleStartTime: Date.now(),
    IsWaiting: true,
    Elapsed: 0,
    Data: 0,
    ElapsedSingle: 0,
    Loading: false,
    audioContext: null,
    analyser: null,
    microphone: null,
    audioInputDetected: 0,
  }),
  methods: {
    Start() {
      const self = this;
      const store = useRootStore();
      store.beep();
      self.Loading = true;
      self.StartTime = Date.now();
      self.SingleStartTime = Date.now();
      this.Interval = setInterval(function () {
        const now = Date.now();
        const elapsedTime = now - self.StartTime;
        const singleElapsedTime = now - self.SingleStartTime;
        self.Elapsed = (elapsedTime / 1000).toFixed(3);
        self.ElapsedSingle = (singleElapsedTime / 1000).toFixed(3);
        if (self.IsWaiting && self.ElapsedSingle >= 7) {
          store.beep();
          self.SingleStartTime = Date.now();
          self.IsWaiting = false;
        } else if (!self.IsWaiting && self.ElapsedSingle >= 3) {
          store.beep();
          self.SingleStartTime = Date.now();
          self.IsWaiting = true;
        }
      }, 10);
    },
    Stop() {
      this.Loading = false;
      this.IsWaiting = true;
      clearInterval(this.Interval);
    },
    async setupMicInputListener(): void {
      const threshold = 10;      
      const self = this;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      this.audioContext = new window.AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.fftSize = 256;
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      setInterval(function () {
        const audioLevel = self.getCurrentAverageMicInputLevel(stream);
        console.log(audioLevel);
        //self.audioInputDetected = audioLevel > threshold;
        self.audioInputDetected = audioLevel;
      },100);
    },

    getCurrentAverageMicInputLevel(stream: MediaStream): number {

      const buffer = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(buffer);
      let values = 0;

      const length = buffer.length;
      for (let i = 0; i < length; i++) {
        values += buffer[i];
      }

      const averageLevel = values / length;

      return averageLevel;
    },
  },
  mounted() {
    const self = this;
    var constraints = { audio: true, video: false };
        setInterval(() => {
      const date = new Date();
      const dateString = date.toLocaleString("it-IT", {
        timeZone: "Europe/Rome",
      });
      const formattedString = dateString.replace(", ", " - ");
      self.CurrentDate = `${formattedString}`;
    }, 1000);
  },
});
</script>
<style>
canvas {
  box-sizing: content-box;
  margin-left: 9px;
}
</style>
