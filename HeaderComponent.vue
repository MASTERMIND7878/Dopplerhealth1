<template>
  <div class="header">
    <h2>{{ title }}</h2>
    <div class="nav-icons">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  background: #1877f2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.nav-icons {
  display: flex;
  gap: 20px;
}
.nav-icon {
  cursor: pointer;
  font-size: 24px;
}
</style>