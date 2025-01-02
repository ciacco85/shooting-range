<template>
  <v-container>
    <v-card :loading="Loading" title="Sette Tre" :subtitle="CurrentDate">
      <v-card-text class="bg-surface-light pt-4">
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="one">Configurazione</v-tab>
          <v-tab value="two">Sperimentale</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-number-input
                :reverse="false"
                controlVariant="split"
                label="Colpi"
                :hideInput="false"
                :min="1"
                :inset="false"
                v-model="Shoots"
              ></v-number-input>
              <v-number-input
                :reverse="false"
                controlVariant="split"
                label="Finestra di attesa"
                :min="1"
                :hideInput="false"
                :inset="false"
                v-model="WaitSeconds"
              ></v-number-input>
              <v-number-input
                :reverse="false"
                controlVariant="split"
                label="Finestra di tiro"
                :min="1"
                :hideInput="false"
                :inset="false"
                v-model="ShootSeconds"
              ></v-number-input>
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              <v-number-input
                :reverse="false"
                controlVariant="split"
                label="Soglia"
                :hideInput="false"
                :min="1"
                :inset="false"
                v-model="Threshold"
              ></v-number-input>
              <v-combobox
                v-model="FFTsize"
                label="FFT"
                :items="[64, 128, 256, 512, 1024, 2048]"
              ></v-combobox>
            </v-tabs-window-item>

            <v-tabs-window-item value="three"> Three </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

        <div>
          Schermo sempre accesso: supporto/attivo
          {{ WakeLockSupported ? "OK" : "KO" }}/{{
            WakeLockActive ? "OK" : "KO"
          }}
        </div>
        <h2>
          <strong>{{ IsWaiting ? "Aspetta" : "Spara" }}</strong>
        </h2>
        <div>Totale {{ Elapsed }}</div>
        <div>Sessione {{ ElapsedSingle }}</div>
        <div>Conteggio colpi {{ ShootCount }}</div>

        <v-table>
          <thead>
            <tr>
              <th class="text-left">Tiro</th>
              <th class="text-left">Esecuzione</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ShootsOnTime" :key="item.tiro">
              <td>{{ item.tiro }}</td>
              <td>{{ item.risultato }}</td>
            </tr>
          </tbody>
        </v-table>
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
    <label
      >Sviluppata da Francesco Venturini. In caso di problemi aprire una issue
      sul seguente </label
    ><a target="_blank" href="https://github.com/ciacco85/shooting-range"
      >repo</a
    >
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRootStore } from "@/rootStore";
export default defineComponent({
  data: () => ({
    CurrentDate: "",
    WaitSeconds: 7,
    ShootSeconds: 3,
    Shoots: 5,
    ShootCount: 0,
    Interval: null,
    StartTime: Date.now(),
    SingleStartTime: Date.now(),
    IsWaiting: true,
    Elapsed: 0,
    Data: 0,
    ElapsedSingle: 0,
    Loading: false,
    audioContext: null,
    WakeLockSupported: false,
    WakeLockActive: false,
    analyser: null,
    microphone: null,
    MicRecInterval: null,
    audioInputDetected: 0,
    ShootsOnTime: [],
    WakeLock: null,
    ShootAcquired: false,
    tab: null,
    Threshold: 10,
    FFTsize: 128,
  }),
  methods: {
    async Start() {
      const self = this;
      const store = useRootStore();

      store.beep2();
      self.Loading = true;
      self.Elapsed = 0;
      self.ElapsedSingle = 0;
      self.ShootCount = 0;
      self.ShootsOnTime = [];
      self.StartTime = Date.now();
      self.SingleStartTime = Date.now();

      self.IsWaiting = true;
      self.Data = 0;
      self.MicRecInterval = null;
      self.audioInputDetected = 0;
      self.ShootsOnTime = [];
      self.ShootAcquired = false;
      try {
        self.WakeLock = await navigator.wakeLock.request("screen");
        self.WakeLockActive = true;
      } catch (err) {
        // The Wake Lock request has failed - usually system related, such as battery.
        self.WakeLockActive = `${err.name}, ${err.message}`;
      }
      self.Interval = setInterval(function () {
        const now = Date.now();
        const elapsedTime = now - self.StartTime;
        const singleElapsedTime = now - self.SingleStartTime;
        self.Elapsed = (elapsedTime / 1000).toFixed(3);
        self.ElapsedSingle = (singleElapsedTime / 1000).toFixed(3);
        if (self.ShootCount >= self.Shoots) {
          clearInterval(self.Interval);
          self.Loading = false;
        }
        if (self.IsWaiting && self.ElapsedSingle >= self.WaitSeconds) {
          store.beep1();
          self.SingleStartTime = Date.now();
          self.IsWaiting = false;
        } else if (!self.IsWaiting && self.ElapsedSingle >= self.ShootSeconds) {
          self.ShootAcquired = false;
          self.ShootCount += 1;
          store.beep2();
          self.SingleStartTime = Date.now();
          self.IsWaiting = true;
        }
      }, 10);
    },
    Stop() {
      this.Loading = false;
      this.IsWaiting = true;
      clearInterval(this.Interval);
      this.WakeLock.release();
      this.WakeLockActive = false;
    },
    async setupMicInputListener(): Promise<undefined> {
      const self = this;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.audioContext = new window.AudioContext();
      self.analyser = self.audioContext.createAnalyser();
      self.analyser.smoothingTimeConstant = 0;
      self.analyser.fftSize = self.FFTsize;
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.MicRecInterval = setInterval(function () {
        const audioLevel = self.getCurrentAverageMicInputLevel(stream);
        console.log(audioLevel);
        //self.audioInputDetected = audioLevel > threshold;
        self.audioInputDetected = audioLevel;
        if (
          self.audioInputDetected >= self.Threshold &&
          self.Loading &&
          !self.ShootAcquired
        ) {
          self.ShootAcquired = true;
          if (!self.IsWaiting) {
            self.ShootsOnTime.push({
              tiro: self.ShootCount,
              risultato: `OK`,
            });
          } else {
            self.ShootsOnTime.push({
              tiro: self.ShootCount,
              risultato: `KO`,
            });
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

      return Math.abs(averageLevel - 127).toFixed(2);
    },
  },
  mounted() {
    this.setupMicInputListener();
    const self = this;
    if ("wakeLock" in navigator) {
      self.WakeLockSupported = true;
    } else {
      self.WakeLockSupported = false;
    }
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
