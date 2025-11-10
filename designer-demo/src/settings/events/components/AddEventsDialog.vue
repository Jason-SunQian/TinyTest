<template>
  <tiny-dialog-box
    :visible="visible"
    :title="t('designer.settings.events.addEvent.title')"
    width="400px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <tiny-form
      ref="ruleForm"
      :model="formData"
      :rules="rules"
      label-width="80px"
      :inline-message="true"
      validate-type="text"
      label-position="left"
      class="add-custom-event-form"
    >
      <tiny-form-item :label="t('designer.settings.events.addEvent.eventName')" prop="eventName" required>
        <tiny-input v-model="formData.eventName" :placeholder="t('designer.settings.events.addEvent.eventNamePlaceholder')"></tiny-input>
      </tiny-form-item>
      <tiny-form-item :label="t('designer.settings.events.addEvent.eventDescription')" prop="eventDescription" required>
        <tiny-input v-model="formData.eventDescription"></tiny-input>
      </tiny-form-item>
    </tiny-form>
    <template #footer>
      <div class="footer">
        <tiny-button @click="closeDialog">{{ t('designer.settings.events.addEvent.cancel') }}</tiny-button>
        <tiny-button type="primary" @click="addMethod">{{ t('designer.settings.events.addEvent.confirm') }}</tiny-button>
      </div>
    </template>
  </tiny-dialog-box>
</template>

<script setup>
/* metaService: engine.setting.event.AddEventsDialog */
import { reactive, ref, defineProps, defineEmits } from 'vue'
import {
  Input as TinyInput,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Button as TinyButton,
  DialogBox as TinyDialogBox
} from '@opentiny/vue'
import { checkEvent } from '../commonjs/events'
import { useDesignerI18n } from '@/services/i18nService'

const { t } = useDesignerI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  componentEvents: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['closeDialog', 'addEvent'])

const formData = reactive({
  eventDescription: '',
  eventName: ''
})

const ruleForm = ref(null)

const eventNameValidator = (rule, value, callback) => {
  if (props.componentEvents[formData.eventName]) {
    callback(new Error(t('designer.settings.events.addEvent.eventNameExists')))

    return
  }

  if (!checkEvent(formData.eventName)) {
    callback(new Error(t('designer.settings.events.addEvent.invalidEventName')))

    return
  }

  callback()
}

const rules = {
  eventDescription: [
    {
      required: true,
      message: t('designer.settings.events.addEvent.required')
    }
  ],
  eventName: [
    { required: true, message: t('designer.settings.events.addEvent.required') },
    {
      validator: eventNameValidator
    }
  ]
}

const closeDialog = () => {
  emits('closeDialog')
}

const addMethod = () => {
  if (!ruleForm.value) {
    return
  }

  ruleForm.value.validate((valid) => {
    if (!valid) {
      return
    }

    const { eventName, eventDescription } = formData

    emits('addEvent', { eventName, eventDescription })
  })
}
</script>

<style lang="less" scoped>
.add-custom-event-form.add-custom-event-form {
  :deep(.tiny-form-item__label) {
    padding-left: 0;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
