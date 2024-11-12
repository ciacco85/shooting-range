// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Vuetify
import { createVuetify } from 'vuetify'
import { en, it } from 'vuetify/locale'
import * as labsComponents from 'vuetify/labs/components'

export default createVuetify(
  {
    components:{
      ...components,
      ...labsComponents
    },
    directives,
    date: {
    },
    locale: {
      locale: "it",
      fallback: "en",
      messages: { it, en },
    },
  }
)
