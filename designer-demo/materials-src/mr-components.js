/**
 * 原子组件统一入口：从 Vant、Ionic 按 mr 命名 re-export，与主工程 resolver 一致（该用 Vant 用 Vant、该用 Ionic 用 Ionic）
 */
import { Divider, Progress, Field, ActionSheet, Image, DatePicker } from 'vant';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';

export { Divider as MrDivider };
export { Progress as MrProgress };
export { Field as MrField };
export { ActionSheet as MrActionSheet };
export { Image as MrImage };
export { Image as MrImg };
export { DatePicker as MrDatePicker };

export { IonSegment as MrSegment };
export { IonSegmentButton as MrSegmentButton };
export { IonLabel as MrLabel };
