import { stripSecrets } from './common.js';
const prefix='battle_v2';
function token(scope){return JSON.stringify([String(scope.chatId||'default-chat'),String(scope.branchId||'main')]);}
export class BattleStorage{
  constructor(storage=globalThis.localStorage,scope={chatId:'default-chat',branchId:'main'}){this.storage=storage&&typeof storage.getItem==='function'?storage:null;this.scope={chatId:String(scope.chatId||'default-chat'),branchId:String(scope.branchId||'main')};this.token=encodeURIComponent(token(this.scope));this.memory=new Map();}
  withScope(scope){return new BattleStorage(this.storage,scope);}
  key(kind){return`${prefix}.${kind}.${this.token}`;}
  readSettings(){return this.read(`${prefix}.settings`,this.read(this.key('settings'),{}));}
  writeSettings(settings){const safe=stripSecrets(settings);this.write(`${prefix}.settings`,safe);return safe;}
  readSession(){return this.read(this.key('session'),null);}
  writeSession(state){if(state?.scope&&(state.scope.chatId!==this.scope.chatId||state.scope.branchId!==this.scope.branchId))throw new Error('存储作用域不匹配，拒绝串写');this.write(this.key('session'),stripSecrets(state));return state;}
  readLogs(){return this.read(this.key('logs'),[]);}
  replaceLogs(logs){this.write(this.key('logs'),stripSecrets(logs));return logs;}
  appendLog(entry){const logs=[...this.readLogs(),{...entry,at:new Date().toISOString()}].slice(-300);return this.replaceLogs(logs);}
  clear(){for(const kind of['session','logs']){const key=this.key(kind);if(typeof this.storage?.removeItem==='function')this.storage.removeItem(key);else if(this.storage?.setItem)this.storage.setItem(key,'');}this.memory.clear();}
  read(key,fallback){const raw=this.storage?.getItem(key)||this.memory.get(key);if(!raw)return fallback;try{return JSON.parse(raw);}catch{return fallback;}}
  write(key,value){const raw=JSON.stringify(value);if(this.storage)this.storage.setItem(key,raw);else this.memory.set(key,raw);}
}
export const STORAGE_PREFIX=prefix;
