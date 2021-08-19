/* eslint-disable no-undef */
<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
          v-for="item in menuTab"
          :key="item.id"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!--表单 Start-->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
            id="username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="item-form"
          v-if="model === 'register'"
        >
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input
                id="code"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="code-block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >
                {{ codeButtonStatus.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButonStatus"
          >
            {{ model === "login" ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
// import { Message } from "element-ui";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, onMounted, onUnmounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode,
} from "@/utils/validate";

export default {
  name: "login",
  setup(props, { refs, root }) {
    /**
     *attrs: (...) == this.$attrs
      emit: (...) == this.$emit
      listeners: (...) == this.$listeners
      parent: (...) == this.$parent
      refs: (...) == this.$refs
      root: (...) == this
      */
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码须为6-20位的数字加字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      //如果模块值为login，直接通过
      if (model.value === "login") {
        callback();
      }
      //过滤后的数据
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };

    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        callback(new Error("验证码须为6位的数字加字母"));
      } else {
        callback();
      }
    };

    /**********************************************************************************************
     * 声明数据
     */

    //这里放置data数据、生命周期、自定义函数
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" },
    ]);

    //模块值
    const model = ref("login");
    //登录按钮禁用状态
    const loginButonStatus = ref(true);
    //验证码按钮状态

    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码",
    });
    //倒计时
    const timer = ref(null);

    //表单绑定数据
    const ruleForm = reactive({
      username: "570267@qq.com",
      password: "123456ab",
      passwords: "",
      code: "",
    });
    //表单验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });

    /**********************************************************************************************
     * 声明函数
     */

    const toggleMenu = (data) => {
      menuTab.forEach((elem, index) => {
        elem.current = false;
      });
      // 高光
      data.current = true;
      // 修改模块值
      model.value = data.type;
      resetFromData();
      clearCountDown();
    };
    // 清除表单数据
    const resetFromData = () => {
      // 重置表单
      // this.$refs[formName].resetFields(); //2.0
      refs.loginForm.resetFields(); // 3.0
    };
    // 更新按钮状态
    const updataButtonStatus = (params) => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    /**
     * 获取验证码
     */
    const getSms = () => {
      //进行提示
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！!");
        return false;
      }

      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      //获取验证码
      let requestData = {
        username: ruleForm.username,
        module: model.value,
      };
      //修改获取验证码状态
      updataButtonStatus({
        status: true,
        text: "发送中",
      });

      //延时多长时间
      setTimeout(() => {
        GetSms(requestData)
          .then((response) => {
            let data = response.data;
            root.$message({
              message: data.message,
              type: "success",
            });
            //启用登录或注册按钮
            loginButonStatus.value = false;
            //调定时器，倒计时
            countDown(60);
          })
          .catch((error) => {
            // 启用登录或注册按钮
            loginButonStatus.value = false;
            updataButtonStatus({
              status: false,
              text: "再次获取",
            });
            console.log(error);
          });
      }, 3000);
    };

    /**提交表单
     */
    const submitForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**登录
     */
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
      };
      root.$store
        .dispatch("app/login", requestData)
        .then((response) => {
          console.log("登录成功");
          console.log(response);
          //页面跳转
          root.$router.push({ name: "Console" });
        })
        // Login(requestData)
        //   .then((response) => {
        //     console.log("登录成功");
        //     console.log(response);
        //     //页面跳转
        //     root.$router.push({
        //       name: "Console",
        //     });
        //   })

        .catch((error) => {});
    };
    /**注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register",
      };
      // 注册接口
      Register(requestData)
        .then((response) => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success",
          });
          // 模拟注册成功
          toggleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch((error) => {
          // 失败时执行的代码
        });
    };

    /**
     * 倒计时
     */

    const countDown = (number) => {
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updataButtonStatus({
            status: false,
            text: "再次获取",
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`; // es5 '倒计时' + time + '秒'
        }
      }, 1000);
    };

    /**
     * 清除倒计时
     */
    const clearCountDown = () => {
      // 还原验证码按钮默认状态
      updataButtonStatus({
        status: false,
        text: "获取验证码",
      });
      // 清除倒计时
      clearInterval(timer.value);
    };

    /**
     * 生命周期
     */
    //挂载完成后
    onMounted(() => {});
    /**
     * 销毁页面时
     */
    onUnmounted(() => {
      clearInterval(timer.value);
    });

    return {
      menuTab,
      toggleMenu,
      model,
      submitForm,
      rules,
      ruleForm,
      getSms,
      loginButonStatus,
      codeButtonStatus,
      timer,
    };
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background: #344a5f;
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
    text-align: left;
  }
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
}
.current {
  background-color: rgba(0, 0, 0, 0.1);
}
.item-form {
  margin-bottom: 13px;
}
.block {
  display: block;
  width: 100%;
  margin-top: 7px;
}
.code-block {
  margin-top: 0px;
}
</style>
<!--
密码加密：
1、在前端预先加密一次
登录的密码：123456（普通字符串）
经过加密后：sha1('123456') == '541216ad5s4f5ds1f5asd4f65asd4' （加密后的字符串）
2、后台加密
接收到字符串：'541216ad5s4f5ds1f5asd4f65asd4'
后台再次加密：md5('541216ad5s4f5ds1f5asd4f65asd4') == '8f9qwersd3g165y4d1sf3s1f6aew4'（最终的加密后的密码）
最终新的字符串写入数据库：8f9qwersd3g165y4d1sf3s1f6aew4
3、登录
用户名与加密后的密码进行匹配，成功则登录，失败则提示
-->
