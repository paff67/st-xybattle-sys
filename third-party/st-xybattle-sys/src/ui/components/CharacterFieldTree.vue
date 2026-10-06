<template>
  <div class="xy-character-tree">
    <template v-for="node in nodes" :key="node.path">
      <details v-if="node.group" class="xy-character-tree__group" :data-field-group="node.path">
        <summary>{{ node.label }} <small>{{ node.children.length }} 项</small></summary>
        <CharacterFieldTree :nodes="node.children" :disabled="disabled" :errors="errors" @edit="$emit('edit', $event)" @add="$emit('add', $event)" />
        <p v-if="!node.children.length">暂无条目</p>
        <button v-if="node.canAdd" type="button" :disabled="disabled" @click="$emit('add', node)">添加条目</button>
      </details>
      <div v-else class="xy-character-tree__field" :data-field-path="node.path">
        <strong>{{ node.label }}</strong>
        <div class="xy-character-tree__value">
          <span>{{ node.display }}</span>
          <details v-if="node.editable" class="xy-character-tree__edit">
            <summary>修改</summary>
            <label>
              <span>{{ node.label }}</span>
              <select v-if="node.options" :value="node.value" :disabled="disabled" @change="emitEdit(node, $event.target.value)">
                <option v-for="(label, value) in node.options" :key="value" :value="value">{{ label }}</option>
              </select>
              <select v-else-if="typeof node.value === 'boolean'" :value="String(node.value)" :disabled="disabled" @change="emitEdit(node, $event.target.value)">
                <option value="true">是</option><option value="false">否</option>
              </select>
              <input v-else-if="typeof node.value === 'number' || node.value === null && ['current','min','max'].includes(node.keys.at(-1))" type="number" step="any" :value="node.value" :disabled="disabled" @input="emitEdit(node, $event.target.value)" />
              <textarea v-else :value="node.value" rows="3" :disabled="disabled" @input="emitEdit(node, $event.target.value)"></textarea>
            </label>
          </details>
          <span v-if="errors[node.path]" class="xy-character-tree__error" role="alert">{{ errors[node.path] }}</span>
          <small v-if="node.source === 'user_edited'">用户修改，待确认</small>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
defineOptions({ name: 'CharacterFieldTree' });
defineProps({ nodes: { type: Array, default: () => [] }, disabled: Boolean, errors: { type: Object, default: () => ({}) } });
const emit = defineEmits(['edit', 'add']);
function emitEdit(field, input) { emit('edit', { field, input }); }
</script>
<style scoped>
.xy-character-tree { display: grid; gap: 10px; min-width: 0; }
.xy-character-tree__group { border: 1px solid #33475b; border-radius: 6px; min-width: 0; }
.xy-character-tree__group > summary { padding: 12px; cursor: pointer; color: #d4e4ef; font-size: 14px; }
.xy-character-tree__group > .xy-character-tree { padding: 0 12px 12px; }
.xy-character-tree small { color: #9fb3c7; font-size: 12px; margin-left: 8px; }
.xy-character-tree__field { display: grid; grid-template-columns: minmax(100px, .6fr) minmax(0, 2fr); gap: 12px; padding: 10px 0; border-bottom: 1px solid #243449; font-size: 14px; }
.xy-character-tree__value { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.65; min-width: 0; }
.xy-character-tree__edit summary { color: #9ccce5; font-size: 12px; cursor: pointer; padding: 6px 0; }
.xy-character-tree label { display: grid; gap: 6px; }
.xy-character-tree :is(textarea,input,select) { width: 100%; box-sizing: border-box; color: #e2e8f0; background: #07101e; border: 1px solid #50627a; padding: 10px; font: inherit; }
.xy-character-tree textarea { resize: vertical; }
.xy-character-tree button { margin: 8px 12px; padding: 8px 12px; color: #d4e4ef; background: #142337; border: 1px solid #50627a; border-radius: 6px; cursor: pointer; }
.xy-character-tree__error { color: #fda4af; display: block; }
@media (max-width:600px) { .xy-character-tree__field { grid-template-columns: minmax(0,1fr); gap: 6px; } }
</style>
