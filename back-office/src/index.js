import "bootstrap/scss/bootstrap.scss";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-table/react-table.css";
import 'react-image-lightbox/style.css';
import "rc-slider/assets/index.css";
import "rc-switch/assets/index.css";
import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/min/dropzone.min.css";

import { isMultiColorActive, defaultColor,themeColorStorageKey,isDarkSwitchActive } from "./constants/defaultValues";
const color =
  (isMultiColorActive||isDarkSwitchActive ) && localStorage.getItem(themeColorStorageKey)
    ? localStorage.getItem(themeColorStorageKey)
    : defaultColor;

localStorage.setItem(themeColorStorageKey, color);

let render = () => {
  import('./assets/scss/themes/gogo.' + color + '.scss').then(x => {
     require('./AppRenderer');
  });
};
render();
