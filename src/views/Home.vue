<template>
  <div class="home">
    <h1>Welcome to Youth Mental Health</h1>
    
    <!-- category filter -->
    <div class="category-filter">
      <!-- category button -->
      <button 
        v-for="category in categories" 
        :key="category"
        @click="filterByCategory(category)"
        class="filter-btn"
      >
        {{ category }}
      </button>
    </div>
    <!-- dynamic resource list -->
    <div class="resources-grid">
      <!-- resource card -->
      <div 
        v-for="resource in filteredResources" 
        :key="resource.id"
        class="resource-card"
      >
      <!-- resource title -->
        <h3 class="resource-title">{{ resource.title }}</h3>
        <!-- resource description -->
        <p class="resource-description">{{ resource.description }}</p>
        <span class="resource-category">{{ resource.category }}</span>
        
        <!-- admin-only actions for resource management -->
        <!-- 仅管理员可见的资源管理操作 -->
        <div v-if="authService.isAdmin()" class="admin-actions">
          <button class="admin-btn edit" @click="editResource(resource)">
            Edit
          </button>
          <button class="admin-btn delete" @click="deleteResource(resource)">
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <!-- admin-only section for adding new resources -->
    <!-- 仅管理员可见的添加新资源部分 -->
    <div v-if="authService.isAdmin()" class="admin-section">
      <h2>Admin: Add New Resource</h2>
      <form @submit.prevent="addResource" class="admin-form">
        <div class="form-group">
          <label>Title:</label>
          <input type="text" v-model="newResource.title" required>
        </div>
        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="newResource.description" required></textarea>
        </div>
        <div class="form-group">
          <label>Category:</label>
          <select v-model="newResource.category" required>
            <option value="">Select Category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <button type="submit" class="add-btn">Add Resource</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import mentalHealthData from '../data/mentalHealthData.json'
import { authService } from '../services/auth'

// home page component with dynamic data and role-based features
// 首页组件，包含动态数据和基于角色的功能
export default {
  name: 'Home',
  setup() {
    const resources = ref([])
    const categories = ref([])
    const selectedCategory = ref('All')
    
    // new resource form data for admin
    // 管理员新资源表单数据
    const newResource = ref({
      title: '',
      description: '',
      category: ''
    })
    
    const loadData = () => {
      resources.value = mentalHealthData.resources
      categories.value = mentalHealthData.categories
    }
    
    // filter by category
    const filterByCategory = (category) => {
      selectedCategory.value = category
    }
    
    // filter by category
    const filteredResources = computed(() => {  
      if (selectedCategory.value === 'All') {
        return resources.value
      }
      // filter by category return the resources that match the selected category
      return resources.value.filter(resource => resource.category === selectedCategory.value)
    })
    
    // admin functions for resource management
    // 管理员资源管理功能
    const addResource = () => {
      const newId = Math.max(...resources.value.map(r => r.id)) + 1
      const resource = {
        id: newId,
        title: newResource.value.title,
        description: newResource.value.description,
        category: newResource.value.category
      }
      resources.value.push(resource)
      
      // reset form
      newResource.value = {
        title: '',
        description: '',
        category: ''
      }
    }
    
    const editResource = (resource) => {
      const newTitle = prompt('Edit title:', resource.title)
      if (newTitle) {
        resource.title = newTitle
      }
      
      const newDescription = prompt('Edit description:', resource.description)
      if (newDescription) {
        resource.description = newDescription
      }
    }
    
    const deleteResource = (resource) => {
      if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
        const index = resources.value.findIndex(r => r.id === resource.id)
        if (index > -1) {
          resources.value.splice(index, 1)
        }
      }
    }
    
    onMounted(() => {
      loadData()
    })
    
    return {
      resources,
      categories,
      selectedCategory,
      filteredResources,
      filterByCategory,
      authService,
      newResource,
      addResource,
      editResource,
      deleteResource
    }
  }
}
</script>

<style>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.home h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.category-filter {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: #ecf0f1;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #bdc3c7;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.resource-title {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.resource-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.resource-category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

/* responsive design */
/* detecting the screen size */
@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  /* responsive design */
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .category-filter {
    justify-content: center;
  }
  
  .filter-btn {
    margin-bottom: 0.5rem;
  }
}

/* admin-only features styling */
/* 仅管理员可见功能的样式 */
.admin-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.admin-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.admin-btn.edit {
  background-color: #ffc107;
  color: #000;
}

.admin-btn.edit:hover {
  background-color: #e0a800;
}

.admin-btn.delete {
  background-color: #dc3545;
  color: white;
}

.admin-btn.delete:hover {
  background-color: #c82333;
}

.admin-section {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.admin-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.admin-form {
  display: grid;
  gap: 1rem;
  max-width: 500px;
}

.admin-form .form-group {
  display: flex;
  flex-direction: column;
}

.admin-form label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.admin-form input,
.admin-form textarea,
.admin-form select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.admin-form textarea {
  min-height: 100px;
  resize: vertical;
}

.add-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #218838;
}
</style>
