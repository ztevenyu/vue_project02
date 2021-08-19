import Vue from "vue";
import SvuIcon from "./SvgIcon";

Vue.component("svg-icon", SvuIcon);
/**
 * require.context ，读取指定目录的所有文件
 * 第一个：目录
 * 第二个：是否遍历子级目录
 * 第三个，定义遍历文件规则
 */

const req = require.context("./svg", false, /\.svg$/); // 获取当前svg目录所有为.svg结尾的文件
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext); // 解析获取的.svg文件的文件名称，并返回
};
requireAll(req);
