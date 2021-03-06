import { defaultDirection } from "../constants/defaultValues";
import axios from 'axios';
import { INIT_STATE } from '../redux/auth/reducer';
const fetchWrap = require('fetch-wrap');

export const fetch = fetchWrap(window.fetch, [
  async function(url, options, fetch) {
    try {
      const token = INIT_STATE.token;
      if(token) {
        const preflight = await axios.post(`${INIT_STATE.authenticationServer}/oauth/verify/token`, {
          token
        });
        if(!preflight.data.valid) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return window.location = "/";
        }
      }
      return fetch(url, options);
    } catch(e) {
      console.error(e);
    }
  }
]);



export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key], B = b[key];
    if (order.indexOf(A + "") > order.indexOf(B + "")) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
};


export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '.' + mm + '.' + yyyy;
}

export const getCurrentTime=()=>{
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes()
}

export const getDirection = () => {
  let direction = defaultDirection;
  if (localStorage.getItem("direction")) {
    const localValue = localStorage.getItem("direction");
    if (localValue === "rtl" || localValue === "ltr") {
      direction = localValue;
    }
  }
  return {
    direction,
    isRtl: direction === "rtl"
  };
};

export const setDirection = localValue => {
  let direction = "ltr";
  if (localValue === "rtl" || localValue === "ltr") {
    direction = localValue;
  }
  localStorage.setItem("direction", direction);
};

