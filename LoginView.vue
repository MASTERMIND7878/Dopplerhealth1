<template>
  <div class="body-gradient">
    <div class="container">
      <h2>DopplerHealth Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Password" required>
        </div>
        <button type="submit" class="button">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login']),
    handleLogin() {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === this.email && u.password === this.password)
      
      if (user) {
        this.login(this.email)
        this.$router.push('/main')
      } else {
        alert('Invalid credentials!')
      }
    }
  }
}
</script>

<style scoped>
.body-gradient {
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
.container {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 20px;
}
input {
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  transition: background 0.3s ease;
}
input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
input:focus {
  background: rgba(255, 255, 255, 0.3);
  outline: none;
}
.button {
  display: inline-block;
  padding: 12px 24px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>