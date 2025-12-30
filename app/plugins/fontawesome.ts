import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMicrophone,
  faMicrophoneAlt,
  faThLarge,
  faHome,
  faChevronDown,
  faPaperPlane,
  faPlus,
  faLightbulb,
  faBarsStaggered,
  faTemperatureHalf,
  faSun,
  faSunPlantWilt,
  faWind,
  faBrain,
  faCrosshairs,
  faSlidersH,
  faThermometerHalf,
  faSnowflake,
  faTimes,
  faCheck,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

// 禁用自动添加CSS
config.autoAddCss = false

// 注册图标
library.add(
  faMicrophone,
  faMicrophoneAlt,
  faThLarge,
  faHome,
  faChevronDown,
  faPaperPlane,
  faPlus,
  faLightbulb,
  faBarsStaggered,
  faTemperatureHalf,
  faSun,
  faSunPlantWilt,
  faWind,
  faBrain,
  faCrosshairs,
  faSlidersH,
  faThermometerHalf,
  faSnowflake,
  faTimes,
  faCheck,
  faCheckCircle
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
