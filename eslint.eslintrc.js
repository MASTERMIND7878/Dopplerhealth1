module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'  // ใช้ 'plugin:vue/recommended' สำหรับ Vue 2
  ],
  rules: {
    // คุณสามารถเพิ่มกฎเฉพาะที่นี่ได้
  }
}