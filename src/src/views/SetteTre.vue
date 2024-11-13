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
    >
    <v-card-text class="bg-surface-light pt-4">
      <v-number-input
      :reverse="false"
      controlVariant="split"
      label="Finestra di attesa"
      :hideInput="false"
      :inset="false"
       v-model="WaitSeconds"
    ></v-number-input>
      <v-number-input
      :reverse="false"
      controlVariant="split"
      label="Finestra di tiro"
      :hideInput="false"
      :inset="false"
       v-model="ShootSeconds"
    ></v-number-input>
      <div>Totale {{ Elapsed }} </div>
      <div>Sessione {{ ElapsedSingle }}</div>
      <div>{{ IsWaiting ? "Aspetta" : "Spara"}}</div>
      <div>Mic value {{audioInputDetected}}</div>
      <ul>
        <li v-for="a in testArray" :key="a">
          {{ a }}
        </li>
      </ul>
    </v-card-text>
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
    WaitSeconds:7,
    ShootSeconds:3,
    Interval: null,
    StartTime: Date.now(),
    SingleStartTime: Date.now(),
    IsWaiting: true,
    Elapsed: 0,
    Data: 0,
    ElapsedSingle: 0,
    Loading: false,
    audioContext: new window.AudioContext(),
    analyser: null,
    microphone: null,
    audioInputDetected: 0,
    testArray: [],
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
        if (self.IsWaiting && self.ElapsedSingle >= self.WaitSeconds) {
          store.beep();
          self.SingleStartTime = Date.now();
          self.IsWaiting = false;
        } else if (!self.IsWaiting && self.ElapsedSingle >= self.ShootSeconds) {
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.smoothingTimeConstant = 0;
      this.analyser.fftSize = 256;
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      setInterval(function () {
        if (!self.IsWaiting){
          const audioLevel = self.getCurrentAverageMicInputLevel(stream);
          console.log(audioLevel);
          //self.audioInputDetected = audioLevel > threshold;
          self.audioInputDetected = audioLevel;
          if (self.audioInputDetected > threshold ||self.audioInputDetected < -threshold){
            self.testArray.push(self.audioInputDetected)
          }
        }
      }, 10);
    },

    getCurrentAverageMicInputLevel(stream: MediaStream): string {
      const buffer = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(buffer);
      let values = 0;

      const length = buffer.length;
      for (let i = 0; i < length; i++) {
        values += buffer[i];
      }

      const averageLevel = values / length;

      return Math.abs(averageLevel - 127).toFixed(3);
    },
  },
  mounted() {
    const self = this;
    this.setupMicInputListener();
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
