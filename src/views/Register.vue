<template>
  <div class="register">
    <!-- register form -->
    <h2>Register</h2>
    
    <!-- error message display -->
    <!-- this div shows error messages when registration fails -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <!-- success message display -->
    <!-- this div shows success messages when registration is successful -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Username:</label>
        <input 
          type="text" 
          v-model="username" 
          @blur="() => validateUsername(true)"
          @input="() => validateUsername(false)"
        >
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>
      
      <div class="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          v-model="email" 
          @blur="() => validateEmail(true)"
          @input="() => validateEmail(false)"
        >
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </div>
      <!-- password -->
      <div class="form-group">
        <label>Password:</label>
        <input 
          type="password" 
          v-model="password" 
          @blur="() => validatePassword(true)"
          @input="() => validatePassword(false)"
        >
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>
      

      <div class="form-group">
        <label>Confirm Password:</label>
        <input 
          type="password" 
          v-model="confirmPassword" 
          @blur="() => validateConfirmPassword(true)"
          @input="() => validateConfirmPassword(false)"
        >
        <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
      </div>
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

// register component
// 注册组件
export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    
    // reactive data for form inputs
    // 表单输入的响应式数据
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    
    // errors object for validation
    // 验证错误对象
    const errors = ref({
      username: null,
      email: null,
      password: null,
      confirmPassword: null
    })
    
    // validation functions
    // 验证函数
    const validateUsername = (blur) => {
      // username validation if the username is less than 3 characters, show the error message
      // 用户名验证，如果少于3个字符则显示错误信息
      if (username.value.length < 3) {
        if (blur) errors.value.username = "Username must be at least 3 characters."
      } else {
        errors.value.username = null
      }
    }
    
    // email validation if the email is not valid, show the error message
    // 邮箱验证，如果邮箱格式无效则显示错误信息
    const validateEmail = (blur) => {
      // This is email validation
      // 这是邮箱验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      // if the email is not valid, show the error message
      // 如果邮箱无效，显示错误信息
      if (!emailRegex.test(email.value)) {
        if (blur) errors.value.email = "Please enter a valid email address"
      } else {
        errors.value.email = null
      }
    }
    
    // password validation(simple test)
    // 密码验证（简单测试）
    const validatePassword = (blur) => {
      // This is password validation
      // 这是密码验证
      // the password must be between 6-10 characters
      // 密码必须在6-10个字符之间
      if (password.value.length < 6 || password.value.length > 10) {
        if (blur) errors.value.password = "Password must be between 6-10 characters"
      } else {
        errors.value.password = null
      }
    }
    
    // confirm password validation
    // 确认密码验证
    const validateConfirmPassword = (blur) => {
      // This is confirm password validation
      // 这是确认密码验证
      if (password.value !== confirmPassword.value) {
        if (blur) errors.value.confirmPassword = "Passwords do not match"
      } else {
        errors.value.confirmPassword = null
      }
    }
    
    // register function with validation and authentication service
    // 带验证和认证服务的注册函数
    const handleRegister = async () => {
      // validate all fields
      // 验证所有字段
      validateUsername(true)
      validateEmail(true)
      validatePassword(true)
      validateConfirmPassword(true)
      
      // check if there are any errors
      // 检查是否有任何错误
      if (errors.value.username || errors.value.email || 
          errors.value.password || errors.value.confirmPassword) {
        errorMessage.value = 'Please fix the form errors'
        return
      }
      
      isLoading.value = true
      errorMessage.value = ''
      successMessage.value = ''
      
      try {
        // prepare user data for registration
        // 准备用户注册数据
        const userData = {
          username: username.value,
          email: email.value,
          password: password.value
        }
        
        // call authentication service to register
        // 调用认证服务进行注册
        const result = await authService.register(userData)
        
        if (result.success) {
          successMessage.value = result.message
          // clear form after successful registration
          // 注册成功后清空表单
          username.value = ''
          email.value = ''
          password.value = ''
          confirmPassword.value = ''
          
          // redirect to home page after 2 seconds
          // 2秒后跳转到首页
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          errorMessage.value = result.message
        }
      } catch (error) {
        errorMessage.value = 'Registration failed, please try again'
      } finally {
        isLoading.value = false
      }
    }
    
    // return the data and functions
    // 返回数据和函数
    return {
      username,
      email,
      password,
      confirmPassword,
      errors,
      isLoading,
      errorMessage,
      successMessage,
      validateUsername,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      handleRegister
    }
  }
}
</script>

<style scoped>
/* register styles with Bootstrap breakpoints */
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.register h2 {
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

.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button {
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background: #229954;
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
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Bootstrap breakpoints implementation */
/* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
  .register {
    padding: 1rem;
    max-width: 100%;
    margin: 0 0.5rem;
  }
  
  .register h2 {
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
  .register {
    padding: 1.5rem;
    max-width: 400px;
  }
  
  .register h2 {
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
  .register {
    padding: 2rem;
    max-width: 400px;
  }
  
  .register h2 {
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
  .register {
    padding: 2rem;
    max-width: 400px;
  }
  
  .register h2 {
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
  .register {
    padding: 2.5rem;
    max-width: 450px;
  }
  
  .register h2 {
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
