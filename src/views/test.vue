<template>
  <div>
    <el-aside width="205px">
      <el-menu
        v-on:select="handleSelect"
        :default-active="$route.path"
        router
        background-color="rgba(70, 76, 91, 1)"
        text-color="#ccc"
      >
        <el-submenu index="1">
          <el-menu-item index="/account">管理1</el-menu-item>
          <el-menu-item index="/bhConfigure">配置1</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.el-menu-item {
  background-color: #333 !important;
}
.el-aside {
  color: #333;
}
.el-menu-item:hover {
  outline: 0 !important;
  color: #409eff !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #409eff !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0 !important;
  color: #409eff !important;
  background: none !important;
}
</style>
