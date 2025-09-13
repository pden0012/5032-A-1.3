<template>
  <div class="login">
    <!-- login form -->
    <h2>Login</h2>
    
    <!-- error message display -->
    <!-- this div shows error messages when login fails -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <!-- success message display -->
    <!-- this div shows success messages when login is successful -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Username:</label>
        <input type="text" v-model="username" required>
      </div>
      
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required>
      </div>
      
      <button type="submit" :disabled="isLoading" @click="handleLogin">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

// this component handles user authentication and login form
// uses Vue Router for navigation and authService for authentication
export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    
    // these ref variables store the form input values and UI state
    const username = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    
    // this function handles the login process when form is submitted
    // validates inputs, calls authService, and handles responses
    const handleLogin = async () => {
      // basic validation to ensure both fields have values
      if (!username.value || !password.value) {
        errorMessage.value = 'Please fill in username and password'
        return
      }
      
      isLoading.value = true
      errorMessage.value = ''
      successMessage.value = ''
      
      try {
        // calls the authService.login method with user credentials
        const result = await authService.login(username.value, password.value)
        
        if (result.success) {
          successMessage.value = result.message
          // resets the form fields after successful authentication
          username.value = ''
          password.value = ''
          
          console.log('Login successful') // debug log
          
          // waits 1 second to show success message before redirecting
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          errorMessage.value = result.message
        }
      } catch (error) {
        errorMessage.value = 'Login failed, please try again'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      username,
      password,
      isLoading,
      errorMessage,
      successMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* login styles with Bootstrap breakpoints */
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.login h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

button {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background: #2980b9;
}

/* error message styling */
/* 错误信息样式 */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

/* success message styling */
/* 成功信息样式 */
.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
}

/* disabled button styling */
/* 禁用按钮样式 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Bootstrap breakpoints implementation */
/* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
  .login {
    padding: 1rem;
    max-width: 100%;
    margin: 0 0.5rem;
  }
  
  .login h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group input {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .login {
    padding: 1.5rem;
    max-width: 400px;
  }
  
  .login h2 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group input {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
  
  button {
    padding: 0.7rem 1.25rem;
    font-size: 0.95rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .login {
    padding: 2rem;
    max-width: 400px;
  }
  
  .login h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group input {
    padding: 0.75rem;
    font-size: 1rem;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .login {
    padding: 2rem;
    max-width: 400px;
  }
  
  .login h2 {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group input {
    padding: 0.8rem;
    font-size: 1rem;
  }
  
  button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .login {
    padding: 2.5rem;
    max-width: 450px;
  }
  
  .login h2 {
    font-size: 1.8rem;
    margin-bottom: 2.5rem;
  }
  
  .form-group {
    margin-bottom: 1.75rem;
  }
  
  .form-group input {
    padding: 0.9rem;
    font-size: 1.1rem;
  }
  
  button {
    padding: 0.9rem 1.75rem;
    font-size: 1.1rem;
  }
}
</style>
