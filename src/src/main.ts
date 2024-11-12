import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import GlemaFooter from '@/components/GlemaFooter.vue'
import GlemaButton from '@/components/GlemaButton.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
app.component('GlemaFooter', GlemaFooter)
app.component('GlemaButton', GlemaButton)
