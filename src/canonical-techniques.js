import taiyi from '../sample-data/techniques/taiyi-canglanjing.json' with { type: 'json' };
import tinglan from '../sample-data/techniques/chengxin-tinglanjue.json' with { type: 'json' };
import shuijing from '../sample-data/techniques/wuxiang-shuijingfa.json' with { type: 'json' };
import tachaobu from '../sample-data/techniques/liuguang-tachaobu.json' with { type: 'json' };
import dielang from '../sample-data/techniques/dielang-xuanchaojue.json' with { type: 'json' };
import gongming from '../sample-data/techniques/xianhai-gongmingpian.json' with { type: 'json' };
import chaoyin from '../sample-data/techniques/cangxian-chaoyin.json' with { type: 'json' };
import xinglv from '../sample-data/techniques/chaochen-xinglv.json' with { type: 'json' };
import wuxiangjing from '../sample-data/techniques/chengjie-wuxiangjing.json' with { type: 'json' };

export const SIX_HEAVENLY_TECHNIQUES = [taiyi, tinglan, shuijing, tachaobu, dielang, gongming];
// The mirror was removed from the formal canon. Keep the source export available
// only as an explicitly excluded reference so importing it is an intentional act.
export const EXCLUDED_CANONICAL_REGISTRIES = [wuxiangjing];
export const FORMAL_HEAVENLY_TREASURES = [chaoyin, xinglv];
// Kept under the historic name for callers that already import this symbol.
export const THREE_HEAVENLY_TREASURES = FORMAL_HEAVENLY_TREASURES;
export const ALL_CANONICAL_REGISTRIES = [...SIX_HEAVENLY_TECHNIQUES, ...FORMAL_HEAVENLY_TREASURES];
