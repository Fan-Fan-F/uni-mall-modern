<template>
  <div class="stepper-container">
    <button
      class="step-btn"
      :disabled="modelValue <= min"
      @click="handleMinus"
    >
      -
    </button>
    <input
      type="number"
      class="step-input"
      :value="modelValue"
      :min="min"
      :max="max"
      @change="handleInput"
    />
    <button
      class="step-btn"
      :disabled="modelValue >= max"
      @click="handlePlus"
    >
      +
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

function handleMinus() {
  if (props.modelValue > props.min) {
    const nextVal = props.modelValue - 1;
    emit('update:modelValue', nextVal);
    emit('change', nextVal);
  }
}

function handlePlus() {
  if (props.modelValue < props.max) {
    const nextVal = props.modelValue + 1;
    emit('update:modelValue', nextVal);
    emit('change', nextVal);
  }
}

function handleInput(e) {
  let val = parseInt(e.target.value, 10);
  if (isNaN(val)) val = props.min;
  val = Math.max(props.min, Math.min(props.max, val));
  emit('update:modelValue', val);
  emit('change', val);
  e.target.value = val;
}
</script>

<style scoped>
.stepper-container {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: #fff;
  overflow: hidden;
}

.step-btn {
  width: 26px;
  height: 26px;
  border: none;
  background-color: #f7f8fa;
  color: var(--text-main);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-btn:active {
  background-color: #e8e8e8;
}

.step-btn:disabled {
  color: #c8c9cc;
  cursor: not-allowed;
  background-color: #fafafa;
}

.step-input {
  width: 36px;
  height: 26px;
  border: none;
  text-align: center;
  font-size: 13px;
  color: var(--text-main);
  outline: none;
  -moz-appearance: textfield;
}

.step-input::-webkit-outer-spin-button,
.step-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
