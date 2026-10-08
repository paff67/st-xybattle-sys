import { jsonrepair } from '../vendor/jsonrepair/index.js';

export const USER_PROTAGONIST_NAME = '许妍';
export function isProtagonistRecord(value) {
  if (!value || typeof value !== 'object') return false;
  const data = value.candidate || value.profile || value.fields || value;
  return [value, data].some((item) => item.side === 'player' || item.role === 'player' ||
    [item.name, item.姓名, item.characterName, item.explicitFacts?.name, item.explicitFacts?.姓名].some((name) => typeof name === 'string' && name.replace(/\s/g, '') === USER_PROTAGONIST_NAME));
}

export function parseCharacterJson(content) {
  if (typeof content !== 'string') return content;
  const raw = (content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || content).trim();
  try { return JSON.parse(raw); }
  catch {
    try { return JSON.parse(jsonrepair(raw)); }
    catch { throw Object.assign(new Error('人物 AI 返回的 JSON 格式错误，本地语法修复未成功。请重新生成。'), { code: 'CHARACTER_JSON_INVALID' }); }
  }
}

export function normalizeParticipantResponse(value) {
  // Some models put candidates/scene inside the unwanted player object.
  const candidates = Array.isArray(value) ? value : value?.candidates ?? value?.player?.candidates;
  if (!Array.isArray(candidates) || candidates.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
    throw Object.assign(new Error('人物识别返回格式错误：缺少敌人 candidates 数组。请重新生成。'), { code: 'CHARACTER_SCHEMA_INVALID' });
  }
  return { player: { name: USER_PROTAGONIST_NAME }, candidates: candidates.filter((item) => !isProtagonistRecord(item)), scene: value?.scene || value?.player?.scene || {} };
}
