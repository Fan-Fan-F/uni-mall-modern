<template>
  <div class="address-edit-page">
    <NavBar :title="isEdit ? '编辑收货地址' : '新增收货地址'" :show-back="true" />

    <div class="card form-card">
      <div class="form-item">
        <label class="form-label">收货人</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="请填写收货人姓名"
          class="form-input"
        />
      </div>

      <div class="form-item">
        <label class="form-label">手机号码</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="请填写11位手机号码"
          class="form-input"
        />
      </div>

      <div class="form-item">
        <label class="form-label">所在地区</label>
        <input
          v-model="form.region"
          type="text"
          placeholder="省/市/区（如：广东省深圳市南山区）"
          class="form-input"
        />
      </div>

      <div class="form-item textarea-item">
        <label class="form-label">详细地址</label>
        <textarea
          v-model="form.detail"
          rows="3"
          placeholder="街道门牌、楼层房间号等信息"
          class="form-textarea"
        ></textarea>
      </div>

      <div class="form-item">
        <label class="form-label">地址标签</label>
        <div class="tags-group">
          <button
            v-for="t in ['家', '公司', '学校']"
            :key="t"
            type="button"
            class="tag-btn"
            :class="{ active: form.tag === t }"
            @click="form.tag = form.tag === t ? '' : t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <div class="form-item switch-item">
        <label class="form-label">设为默认收货地址</label>
        <input
          v-model="form.isDefault"
          type="checkbox"
          class="switch-checkbox"
        />
      </div>
    </div>

    <div class="save-bar">
      <button class="btn-primary save-btn" @click="handleSave">
        保存收货地址
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAddressStore } from '../../stores/address.js';
import NavBar from '../../components/NavBar.vue';

const route = useRoute();
const router = useRouter();
const addressStore = useAddressStore();

const addressId = ref(null);
const form = ref({
  name: '',
  phone: '',
  region: '',
  detail: '',
  tag: '',
  isDefault: false
});

const isEdit = computed(() => !!addressId.value);

onMounted(() => {
  if (route.query.id) {
    addressId.value = route.query.id;
    const existing = addressStore.list.find((a) => a.id === addressId.value);
    if (existing) {
      form.value = { ...existing };
    }
  }
});

function handleSave() {
  if (!form.value.name.trim()) {
    alert('请填写收货人姓名');
    return;
  }
  if (!form.value.phone.trim()) {
    alert('请填写联系电话');
    return;
  }
  if (!form.value.region.trim()) {
    alert('请填写所在地区');
    return;
  }
  if (!form.value.detail.trim()) {
    alert('请填写详细地址');
    return;
  }

  if (isEdit.value) {
    addressStore.updateAddress(addressId.value, form.value);
  } else {
    addressStore.addAddress(form.value);
  }

  router.back();
}
</script>

<style scoped>
.address-edit-page {
  padding-bottom: 70px;
}

.form-card {
  padding: 0 14px;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  width: 90px;
  font-size: 14px;
  color: var(--text-main);
  font-weight: 500;
}

.form-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-main);
}

.textarea-item {
  align-items: flex-start;
}

.form-textarea {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-main);
  font-family: inherit;
  resize: none;
}

.tags-group {
  display: flex;
  gap: 8px;
}

.tag-btn {
  border: 1px solid var(--border-color);
  background-color: #fff;
  border-radius: var(--radius-round);
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  color: var(--text-regular);
}

.tag-btn.active {
  border-color: var(--primary-color);
  background-color: #fff0eb;
  color: var(--primary-color);
  font-weight: 600;
}

.switch-item {
  justify-content: space-between;
}

.switch-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.save-bar {
  padding: 24px 14px;
}

.save-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
}
</style>
