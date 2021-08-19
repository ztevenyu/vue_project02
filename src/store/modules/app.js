import { Login, Logout } from "@/api/login";
import { setToKen, setUserName } from "@/utils/app";

const state = {
  roles: [],
  buttonPermission: [],
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  to_ken: "",
  username: "",
};

const getters = {
  isCollapse: (state) => state.isCollapse,
  roles: (state) => state.roles,
  buttonPermission: (state) => state.buttonPermission,
};

const mutations = {
  // 必须的  同步 没有回调处理事情
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // html5本地储存
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
  SET_TOKEN(state, value) {
    state.to_ken = value;
  },
  SET_USERNAME(state, value) {
    state.username = value;
  },
  SET_ROLES(state, value) {
    state.roles = value;
  },
  SET_BUTTON(state, value) {
    state.buttonPermission = value;
  },
};

const actions = {
  // 可以回调处理事情
  login({ commit }, repuestData) {
    return new Promise((resolve, reject) => {
      Login(repuestData)
        .then((response) => {
          let data = response.data.data;
          console.log(response);
          commit("SET_TOKEN", data.token);
          commit("SET_USERNAME", data.username);
          //存token, username
          setToKen(data.token);
          setUserName(data.username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      Logout().then((response) => {
        const data = response.data;
        // removeToKen();
        // removeUserName();
        // commit("SET_TOKEN", "");
        // commit("SET_USERNAME", "");
        // commit("SET_ROLES", []);
        resolve(data);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
