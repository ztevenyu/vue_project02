import cookie from "cookie_js";

const admintoKen = "admin_toKen";

export function getToKen() {
  return cookie.get(admintoKen);
}

export function setToKen(toKen) {
  return cookie.set(admintoKen, toKen);
}

export function removeToKen(toKen) {
  return cookie.remove(admintoKen);
}

export function setUserName(value) {
  return cookie.set("username", value);
}
