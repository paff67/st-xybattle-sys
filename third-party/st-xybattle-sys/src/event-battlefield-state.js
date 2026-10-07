// One current-state projection. These names/values are shared by MVU and ACU;
// ACU's displayed headers add 当前. No history/person/enforcement table is needed.
export const BATTLEFIELD_FIELDS = Object.freeze({
  空间层: ['现实', '下沉战界'],
  战界ID: null,
  备案状态: ['无', '已备案', '紧急备案', '未备案'],
  战斗状态: ['无', '待裁定', '进行中', '已结束'],
});
export const ACU_BATTLEFIELD_COLUMNS = Object.freeze(Object.fromEntries(Object.keys(BATTLEFIELD_FIELDS).map(key => [key, `当前${key}`])));

export function normalizeBattlefieldState(value) {
  if (value == null) return { state: null, issues: ['battlefield_state_absent'] };
  const state = {}, issues = [];
  for (const [key, values] of Object.entries(BATTLEFIELD_FIELDS)) {
    const item = value[key];
    if (typeof item !== 'string' || !item.trim() || item.length > 64 || (values && !values.includes(item))) issues.push(`invalid:${key}`);
    else state[key] = item;
  }
  if (state.空间层 === '下沉战界' && state.战界ID === '无') issues.push('layer_without_id');
  return { state: issues.length ? null : state, issues };
}

export function readAcuBattlefieldState(exported, { tableName = '全局数据表' } = {}) {
  // Select exactly one configured table; never merge two competing projections.
  const tables = Object.entries(exported || {}).filter(([key, table]) => key === tableName || table?.name === tableName);
  if (!tables.length) return { state: null, issues: ['acu_table_absent'] };
  if (tables.length !== 1) return { state: null, issues: ['acu_table_ambiguous'] };
  const content = tables[0][1]?.content;
  if (!Array.isArray(content) || content.length !== 2 || !Array.isArray(content[0]) || !Array.isArray(content[1])) return { state: null, issues: ['acu_requires_one_current_row'] };
  const headers = content[0], row = content[1], data = {};
  for (const [key, header] of Object.entries(ACU_BATTLEFIELD_COLUMNS)) {
    if (headers.filter(value => value === header).length !== 1) return { state: null, issues: [`acu_column_missing_or_duplicate:${header}`] };
    data[key] = row[headers.indexOf(header)];
  }
  return normalizeBattlefieldState(data);
}

export function battlefieldProjection(mvuRoot, acuExport, options) {
  const mvu = normalizeBattlefieldState(mvuRoot?.世界?.战界);
  const acu = readAcuBattlefieldState(acuExport, options);
  const differences = mvu.state && acu.state ? Object.keys(BATTLEFIELD_FIELDS).filter(key => mvu.state[key] !== acu.state[key]) : [];
  return { current: mvu.state, acuHint: acu.state, differences, mvuIssues: mvu.issues, acuIssues: acu.issues, acuBranchKnown: false };
}
