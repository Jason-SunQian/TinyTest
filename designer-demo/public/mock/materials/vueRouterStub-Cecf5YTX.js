import { reactive } from "vue";
const stubRoute = reactive({
  query: {},
  params: {},
  path: "/",
  name: void 0
});
function useRoute() {
  return stubRoute;
}
export {
  useRoute as u
};
