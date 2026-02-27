<template>
  <div class="water-wave">
    <div ref="liquidEchart" :style="{ width, height }"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';

const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    rate?: number;
    title?: string;
  }>(),
  {
    width: '85px',
    height: '85px',
    rate: 0,
    title: 'Save'
  }
);

const liquidEchart = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function initLiquidEchart() {
  if (!liquidEchart.value) return;
  chartInstance = echarts.init(liquidEchart.value, null, { renderer: 'svg' });
  updateOption();
}

function updateOption() {
  if (!chartInstance || !liquidEchart.value) return;
  chartInstance.setOption({
    title: {
      text: props.title,
      textStyle: {
        color: 'var(--mr-color-neutral-950, #333)',
        fontFamily: 'Avenir',
        fontSize: 12,
        fontWeight: '400',
        align: 'center',
        baseline: 'middle',
        position: 'inside',
        verticalAlign: 'middle'
      },
      left: 'center',
      top: '38%'
    },
    series: [
      {
        type: 'liquidFill',
        radius: '100%',
        center: ['50%', '50%'],
        waveAnimation: true,
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'var(--mr-color-primary, #1989fa)' },
              { offset: 1, color: 'var(--mr-color-primary, #1989fa)' }
            ],
            globalCoord: false
          }
        ],
        data: [props.rate, props.rate],
        amplitude: 5,
        backgroundStyle: {
          borderWidth: 1,
          borderColor: 'var(--mr-color-primary, #1989fa)',
          color: 'var(--mr-color-neutral-50, #fafafa)'
        },
        label: {
          normal: {
            show: true,
            position: ['52%', '26%'],
            textStyle: {
              fontSize: 16,
              color: 'var(--mr-color-primary, #1989fa)',
              fontWeight: '800'
            }
          }
        },
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 4,
            borderColor: 'transparent'
          }
        },
        itemStyle: {
          shadowColor: 'var(--mr-color-neutral-50, #fafafa)'
        }
      }
    ]
  });
}

onMounted(() => {
  initLiquidEchart();
});

watch(
  () => [props.rate, props.title],
  () => updateOption(),
  { deep: true }
);
</script>
