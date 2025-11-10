import entry from './Main.vue'
import BindEventsDialogContent from './components/BindEventsDialogContent.vue'
import BindEventsDialogSidebar from './components/BindEventsDialogSidebar.vue'
import { commonEvents } from './commonjs/events'

export const EventService = commonEvents

export default {
  id: 'engine.setting.event',
  title: 'Events',
  type: 'plugins',
  name: 'event',
  icon: 'target',
  entry,
  options: { commonEvents },
  components: {
    BindEventsDialogSidebar,
    BindEventsDialogContent
  }
}


