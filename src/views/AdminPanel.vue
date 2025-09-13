<template>
  <div class="admin-panel">
    <!-- admin panel header -->
    <div class="admin-header">
      <h1>Admin Panel</h1>
      <p>Welcome to the administrative dashboard</p>
    </div>
    
    <!-- admin-only content sections -->
    <div class="admin-content">
      <!-- user management section -->
      <div class="admin-section">
        <h2>User Management</h2>
        <div class="user-stats">
          <div class="stat-card">
            <h3>Total Users</h3>
            <span class="stat-number">{{ totalUsers }}</span>
          </div>
          <div class="stat-card">
            <h3>Admin Users</h3>
            <span class="stat-number">{{ adminUsers }}</span>
          </div>
          <div class="stat-card">
            <h3>Regular Users</h3>
            <span class="stat-number">{{ regularUsers }}</span>
          </div>
        </div>
        
        <!-- user list -->
        <div class="user-list">
          <h3>All Users</h3>
          <div class="user-table">
            <div class="table-header">
              <span>ID</span>
              <span>Username</span>
              <span>Email</span>
              <span>Role</span>
              <span>Created</span>
            </div>
            <div 
              v-for="user in allUsers" 
              :key="user.id" 
              class="table-row"
            >
              <span>{{ user.id }}</span>
              <span>{{ user.username }}</span>
              <span>{{ user.email }}</span>
              <span class="role-badge" :class="user.role">
                {{ user.role }}
              </span>
              <span>{{ formatDate(user.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- system settings section -->
      <div class="admin-section">
        <h2>System Settings</h2>
        <div class="settings-grid">
          <div class="setting-card">
            <h3>Application Status</h3>
            <p>System is running normally</p>
            <button class="status-button active">Active</button>
          </div>
          <div class="setting-card">
            <h3>Database Status</h3>
            <p>Local storage is operational</p>
            <button class="status-button active">Connected</button>
          </div>
          <div class="setting-card">
            <h3>User Registration</h3>
            <p>New user registration is enabled</p>
            <button class="toggle-button" @click="toggleRegistration">
              {{ registrationEnabled ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- admin actions section -->
      <div class="admin-section">
        <h2>Admin Actions</h2>
        <div class="action-buttons">
          <button class="action-button primary" @click="exportUsers">
            Export User Data
          </button>
          <button class="action-button secondary" @click="clearAllData">
            Clear All Data
          </button>
          <button class="action-button warning" @click="resetToDefaults">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { authService } from '../services/auth'

// admin panel component for role-based access control
// 管理员面板组件，用于基于角色的访问控制
export default {
  name: 'AdminPanel',
  setup() {
    // reactive data for admin panel
    // 管理员面板的响应式数据
    const allUsers = ref([])
    const registrationEnabled = ref(true)
    
    // computed properties for user statistics
    // 用户统计的计算属性
    const totalUsers = computed(() => allUsers.value.length)
    const adminUsers = computed(() => 
      allUsers.value.filter(user => user.role === 'admin').length
    )
    const regularUsers = computed(() => 
      allUsers.value.filter(user => user.role === 'user').length
    )
    
    // function to load all users from storage
    // 从存储中加载所有用户的函数
    const loadUsers = () => {
      const storedUsers = localStorage.getItem('users')
      if (storedUsers) {
        allUsers.value = JSON.parse(storedUsers)
      }
    }
    
    // function to format date for display
    // 格式化日期显示的函数
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
    
    // function to toggle user registration
    // 切换用户注册的函数
    const toggleRegistration = () => {
      registrationEnabled.value = !registrationEnabled.value
    }
    
    // function to export user data
    // 导出用户数据的函数
    const exportUsers = () => {
      const dataStr = JSON.stringify(allUsers.value, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'users-export.json'
      link.click()
      URL.revokeObjectURL(url)
    }
    
    // function to clear all user data
    // 清除所有用户数据的函数
    const clearAllData = () => {
      if (confirm('Are you sure you want to clear all user data? This action cannot be undone.')) {
        localStorage.removeItem('users')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('isAuthenticated')
        allUsers.value = []
        alert('All data has been cleared. Please refresh the page.')
      }
    }
    
    // function to reset to default users
    // 重置为默认用户的函数
    const resetToDefaults = () => {
      if (confirm('Are you sure you want to reset to default users? This will remove all custom users.')) {
        localStorage.removeItem('users')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('isAuthenticated')
        loadUsers()
        alert('Reset to default users. Please refresh the page.')
      }
    }
    
    // load users when component mounts
    // 组件挂载时加载用户
    onMounted(() => {
      loadUsers()
    })
    
    return {
      allUsers,
      registrationEnabled,
      totalUsers,
      adminUsers,
      regularUsers,
      formatDate,
      toggleRegistration,
      exportUsers,
      clearAllData,
      resetToDefaults
    }
  }
}
</script>

<style scoped>
/* admin panel styling */
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.admin-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.admin-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.admin-content {
  display: grid;
  gap: 2rem;
}

.admin-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

/* user statistics styling */
.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #667eea;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

/* user table styling */
.user-table {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 100px 120px;
  gap: 1rem;
  padding: 1rem;
  background: #667eea;
  color: white;
  font-weight: bold;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 100px 120px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
}

.role-badge.admin {
  background: #ffc107;
  color: #000;
}

.role-badge.user {
  background: #28a745;
  color: white;
}

/* settings grid styling */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.setting-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.setting-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.setting-card p {
  color: #666;
  margin-bottom: 1rem;
}

.status-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.status-button.active {
  background: #28a745;
  color: white;
}

.toggle-button {
  padding: 0.5rem 1rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-button:hover {
  background: #667eea;
  color: white;
}

/* action buttons styling */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button.primary {
  background: #007bff;
  color: white;
}

.action-button.primary:hover {
  background: #0056b3;
}

.action-button.secondary {
  background: #6c757d;
  color: white;
}

.action-button.secondary:hover {
  background: #545b62;
}

.action-button.warning {
  background: #ffc107;
  color: #000;
}

.action-button.warning:hover {
  background: #e0a800;
}

/* responsive design */
@media (max-width: 768px) {
  .admin-panel {
    padding: 1rem;
  }
  
  .user-stats {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
