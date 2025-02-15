<template>
  <div>
    <header-component title="Device Emergency Chat">
      <button class="home-button" @click="$router.push('/main')">🏠 Home</button>
    </header-component>
    
    <div class="chat-container" ref="chatContainer">
      <div class="device-status" :style="{ color: deviceConnected ? 'green' : 'red' }">
        {{ deviceConnected ? 'Device Connected' : 'Device Not Connected' }}
      </div>
      
      <div v-for="(message, index) in messages" 
           :key="index" 
           class="message"
           :class="{ 'device-message': message.type === 'device', 
                    'user-message': message.type === 'user',
                    'emergency-message': message.isEmergency }">
        {{ message.text }}
      </div>
    </div>
    
    <div class="emergency-controls">
      <input type="tel" v-model="phoneNumber" placeholder="Register Emergency Phone Number">
      <button @click="registerEmergencyPhone">Save Number</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { mapState, mapMutations } from 'vuex'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'ChatView',
  components: {
    HeaderComponent
  },
  setup() {
    const chatContainer = ref(null)
    const messages = ref([])
    const phoneNumber = ref('')
    
    // Mock WebSocket implementation
    const mockWebSocketMessages = [
      { data: 'Hello from device!', delay: 2000 },
      { data: 'GPS:37.7749,-122.4194', delay: 5000 },
      { data: 'EMERGENCY:Fall detected!', delay: 8000 }
    ]
    
    let timeouts = []
    
    return {
      chatContainer,
      messages,
      phoneNumber,
      mockWebSocketMessages,
      timeouts
    }
  },
  computed: {
    ...mapState(['deviceConnected', 'emergencyPhone'])
  },
  methods: {
    ...mapMutations(['setDeviceConnected', 'setEmergencyPhone']),
    
    addDeviceMessage(message, isEmergency = false) {
      this.messages.push({
        type: 'device',
        text: message,
        isEmergency
      })
      this.scrollToBottom()
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
    
    handleDeviceMessage(message) {
      if (message.startsWith('EMERGENCY:')) {
        this.addDeviceMessage(`🚨 EMERGENCY: ${message.replace('EMERGENCY:', '')}`, true)
        this.initiateEmergencyCall()
      } else if (message.startsWith('GPS:')) {
        this.addDeviceMessage(`Location Update: ${message.replace('GPS:', '')}`)
      } else {
        this.addDeviceMessage(message)
      }
    },
    
    registerEmergencyPhone() {
      if (this.validatePhoneNumber(this.phoneNumber)) {
        this.setEmergencyPhone(this.phoneNumber)
        localStorage.setItem('emergencyPhone', this.phoneNumber)
        alert('Emergency Phone Number Saved')
      } else {
        alert('Invalid Phone Number')
      }
    },
    
    validatePhoneNumber(phone) {
      const phoneRegex = /^[0-9]{10}$/
      return phoneRegex.test(phone)
    },
    
    initiateEmergencyCall() {
      if (this.emergencyPhone) {
        console.log(`Calling emergency number: ${this.emergencyPhone}`)
        alert(`Emergency Call Initiated to ${this.emergencyPhone}`)
      } else {
        alert('Please register an emergency phone number first')
      }
    },
    
    simulateWebSocket() {
      // Connect
      setTimeout(() => {
        this.setDeviceConnected(true)
      }, 1000)
      
      // Handle messages
      this.mockWebSocketMessages.forEach(msg => {
        const timeout = setTimeout(() => {
          this.handleDeviceMessage(msg.data)
        }, msg.delay)
        this.timeouts.push(timeout)
      })
    },
    
    clearSimulation() {
      this.timeouts.forEach(timeout => clearTimeout(timeout))
      this.timeouts = []
    }
  },
  mounted() {
    // Load emergency phone from localStorage
    const savedPhone = localStorage.getItem('emergencyPhone')
    if (savedPhone) {
      this.phoneNumber = savedPhone
      this.setEmergencyPhone(savedPhone)
    }
    
    // Simulate WebSocket connection
    this.simulateWebSocket()
  },
  beforeUnmount() {
    this.clearSimulation()
    this.setDeviceConnected(false)
  },
  watch: {
    messages() {
      this.scrollToBottom()
    }
  }
}
</script>

<style scoped>
.chat-container {
  flex-grow: 1;
  height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 15px;
  background-color: #f0f2f5;
}
.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}
.device-message {
  background-color: #e5e5ea;
  align-self: flex-start;
}
.user-message {
  background-color: #0078ff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
}
.emergency-message {
  background-color: red !important;
  color: white !important;
}
.device-status {
  text-align: center;
  margin: 10px 0;
  color: #888;
}
.emergency-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
}
.emergency-controls input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
}
.home-button {
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  background: none;
  color: white;
  font-size: 16px;
}
</style>