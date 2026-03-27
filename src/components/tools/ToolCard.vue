<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="tool-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <p v-if="description" class="card-desc">{{ description }}</p>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.tool-card {
  width: 100%;
}

.card-header {
  margin-bottom: var(--space-3);
}

.card-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, var(--accent), var(--accent-hover));
  border-radius: 2px;
}

.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 14px;
}

.card-body {
  width: 100%;
}
</style>
