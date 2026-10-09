// Preparation contracts, not executable adjudication modules. Each field is
// populated from referenced evidence; no artificial opponent is required.
export const EVENT_DOMAINS = Object.freeze({
  daily: { label: '日常事务', required: ['subject', 'purpose', 'conditions'], optional: ['method', 'resources', 'target', 'environment'], guidance: '有不确定性或持续后果的交涉、学习、劳作等行动；普通聊天和无风险例行动作直接放行，不人为制造检定。' },
  combat: { label: '战斗', required: ['actors', 'methods', 'resources', 'situation'], optional: ['battlefield'], guidance: '双方真实参与者、动作与目标、功法完整定义、可用资源、位置和持续效果。已有战局复用固定资料。' },
  cultivation: { label: '修炼突破', required: ['subject', 'method', 'progress', 'conditions'], optional: ['resources', 'tribulation', 'battlefield'], guidance: '境界、修炼功法、积累与瓶颈、突破条件、环境、辅助物。自然雷劫不是执法镇罚；天网不代受核心劫力。' },
  alchemy: { label: '炼丹', required: ['subject', 'recipe', 'materials', 'equipment', 'method'], optional: ['stage', 'environment'], guidance: '丹方、材料数量与性质、炉具、火候与技艺、工序进度；不凭模型补造已拥有的材料或成品。' },
  crafting: { label: '炼器', required: ['subject', 'blueprint', 'materials', 'equipment', 'method'], optional: ['stage', 'environment'], guidance: '图样、材料、器具、炼制技艺、现有工序和目标用途；成品与消耗属于后续裁定结果。' },
  perception: { label: '探查', required: ['subject', 'method', 'target', 'environment'], optional: ['clues', 'resources'], guidance: '感知手段、探查对象或区域、范围与已知阻隔。未知目标允许是区域，不要求敌人；未发现不等于不存在。' },
  recovery: { label: '疗伤', required: ['subject', 'injury', 'method'], optional: ['medicine', 'resources', 'environment', 'stage'], guidance: '伤者、伤势与已知病因、治疗能力与限制、药物、疗程。不能用重生资格推导无条件复活。' },
  formation: { label: '破阵', required: ['subject', 'target', 'method', 'environment'], optional: ['nodes', 'resources', 'countermeasures'], guidance: '已知阵法、观察到的节点与运转状态、破解手段和环境。看不见的核心不自动成为已知答案。' },
  pursuit: { label: '追逃', required: ['actors', 'positions', 'method', 'environment'], optional: ['clues', 'resources', 'battlefield'], guidance: '追逃双方、当前位置或最后可知位置、距离、身法与耐力、地形和线索。注销备案不能解除空间封锁。' },
  battlefield: { label: '战界操作', required: ['subject', 'purpose', 'connection'], optional: ['layer', 'location', 'participants', 'capacity', 'protection'], guidance: '区分备案请求、入场请求、应急下沉、已确认入场、退出与求援；确定用途及真实空间/交战联系。申请不是已完成事实。' },
});

export function domainContract(domain) {
  const contract = Object.prototype.hasOwnProperty.call(EVENT_DOMAINS, domain) ? EVENT_DOMAINS[domain] : null;
  if (!contract) throw new Error(`未定义的准备模块: ${domain}`);
  return contract;
}
