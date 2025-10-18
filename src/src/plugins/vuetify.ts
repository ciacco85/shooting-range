// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
// Vuetify
import { createVuetify } from 'vuetify'
import { en, it } from 'vuetify/locale'

export default createVuetify(
  {
    components:{
      ...components,
    },
    date: {
    },
    locale: {
      locale: "it",
      fallback: "en",
      messages: { it, en },
    },
  }
)
