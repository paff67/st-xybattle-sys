"""Extract user-designated lore without inventing numerical combat rules.

Usage: python -X utf8 scripts/build-authoritative-six-arts.py SOURCE.json
Outputs are a reviewable rule catalogue, NOT an automatic battle migration.
"""
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'content/authoritative-six-arts'
SPECS = [
    ('9', 'dielang-xuanchaojue', '攻伐与持续潮势', 'qixian-chuchao liangong-dielang tiaogong-suichao changong-huichao boxian-nilang fanyin-chaoyan jiudie-cangchao'),
    ('14', 'taiyi-canglanjing', '水元供给、回收与神魂承载', 'chengyuan-qihai-huiliu wuxiang-fenshen canghai-yangshen zhirou-huae taiyi-huilan'),
    ('15', 'chengxin-tinglanjue', '感知、辨识与线索', 'xinyuan-chengting maixiang-xianwen mingzhen-zhaoying tianlai-tingxi suxi-zhuilan chengxin-huisheng tinglan-wanxiang-huisheng'),
    ('16', 'wuxiang-shuijingfa', '镜界节点与局部空间关系', 'shuijing-jiejie-jiedian chengjie-chaotianmu jingjie-zhichi-qianxun jingjie-yihua-yinsha jingjie-shuiyue-zhenshen jingjie-fanzhao-guitu wuxiang-jingjie-chongdie'),
    ('17', 'liuguang-tachaobu', '跨距换位与落点', 'tachao-jiejie chaohen-huishen liuguang-liuying huanba-zhuchao yibu-xiansheng liuguang-wudingmen'),
    ('18', 'xianhai-gongmingpian', '联系辨认、切断、改接与逆序', 'tingxian-bianluo duanxian-shixu jiexian-gaidiao daoxian-nixu jiyin-kongpai xianhai-hezou xianhai-zhongzhang-shitiao'),
]

# These are engineering labels, not additional in-world abilities or resources.
PORTS = {
    'dielang-xuanchaojue': (['water.intent', 'perception.opening', 'mirror.node', 'movement.position'], ['chord.structure', 'tide.structure', 'tide.eye', 'water.dispersed-own']),
    'taiyi-canglanjing': (['water.dispersed-own', 'external.force'], ['water.taiyi', 'mind.capacity', 'force.mitigated']),
    'chengxin-tinglanjue': (['observable.change', 'trace.known'], ['perception.warning', 'perception.opening', 'relation.observed', 'trace.known']),
    'wuxiang-shuijingfa': (['water.intent', 'water.taiyi', 'external.force'], ['mirror.node', 'mirror.field', 'mirror.echo', 'mirror.decoy']),
    'liuguang-tachaobu': (['water.intent', 'mirror.node', 'movement.trace', 'perception.warning'], ['movement.position', 'movement.trace', 'movement.afterimage']),
    'xianhai-gongmingpian': (['relation.observed', 'mirror.node', 'tide.structure', 'movement.position', 'mind.capacity'], ['relation.interrupted', 'force.redirected', 'sequence.inverted', 'system.connected']),
}

LINKS = [
    ('taiyi-canglanjing', 'chengxin-tinglanjue', 'mind.capacity', '太一提供听澜所需神魂承载。', '神魂过载时仍可能延迟、误判或术式失控。'),
    ('taiyi-canglanjing', 'wuxiang-shuijingfa', 'water.taiyi', '太一提供节点水元并支撑维持。', '正在维持节点的水元不能提前回收。'),
    ('taiyi-canglanjing', 'liuguang-tachaobu', 'water.taiyi', '太一提供连续换位所需水元与落点联系。', '水元供给不代替有效落点或解除封界。'),
    ('taiyi-canglanjing', 'dielang-xuanchaojue', 'water.taiyi', '提高水元纯度、潮势稳定性、持续时间和多线承载。', '不自动增加潮势层数或无限回收正在控制的潮势。'),
    ('taiyi-canglanjing', 'xianhai-gongmingpian', 'mind.capacity', '提供稳定的干涉媒介与神魂承载。', '承载不产生尚未观察到的敌方联系。'),
    ('chengxin-tinglanjue', 'wuxiang-shuijingfa', 'perception.opening', '为水镜寻找节点与关键交替。', '标记不是已经建成的镜界节点。'),
    ('chengxin-tinglanjue', 'liuguang-tachaobu', 'perception.warning', '判断敌意和落点，支持一步先声。', '不预知未来；变招和假动作需要重新辨识。'),
    ('chengxin-tinglanjue', 'dielang-xuanchaojue', 'perception.opening', '标记防御节奏，使叠浪沿标记留下弦势。', '感知成功不等于自动命中或摧毁防御。'),
    ('chengxin-tinglanjue', 'xianhai-gongmingpian', 'relation.observed', '为断弦、借调、倒序确定联系对象。', '未观察或接触到的联系不能凭空创建。'),
    ('wuxiang-shuijingfa', 'liuguang-tachaobu', 'mirror.node', '镜界节点为换位提供入口和落点。', '节点毁坏、失去联系或落点被封锁时重新评估；镜身替劫不等于换位成功。'),
    ('wuxiang-shuijingfa', 'dielang-xuanchaojue', 'mirror.node', '保存潮势，重叠节点使叠浪获得多个落点。', '多个落点不等于凭空复制法力、固定伤害或必中。'),
    ('wuxiang-shuijingfa', 'xianhai-gongmingpian', 'mirror.node', '把目标留在可接触范围，重叠节点支持接触多个联系。', '须先具备节点联系与目标联系，不是无范围限制的干涉。'),
    ('liuguang-tachaobu', 'dielang-xuanchaojue', 'movement.position', '在换位中完成转弓和变奏。', '移动与演奏可协同；仍要评估控制、落点和神魂负担。'),
    ('liuguang-tachaobu', 'xianhai-gongmingpian', 'movement.position', '取得法宝、阵法联系的接触位置。', '到达不等于已辨清联系或必然切断联系。'),
    ('xianhai-gongmingpian', 'dielang-xuanchaojue', 'force.redirected', '借弦将已打出的力量接入水势，叠浪可利用改道后的力量形成潮势。', '借用不等于吸收、夺取属性或复制传承。'),
    ('xianhai-gongmingpian', 'wuxiang-shuijingfa', 'force.redirected', '将敌方已离体力量接入水镜，改变落点。', '需可接触的联系；瞬发即散、结构少的力量效果弱。'),
]

def chunks(text, level):
    parts = re.split(r'(?m)^' + '#' * level + r' (.+)\n', text)
    return [(parts[i].strip(), parts[i + 1].strip()) for i in range(1, len(parts), 2)]

def paragraphs(text):
    return [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]

def dump(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def build(source):
    raw = source.read_bytes()
    data = json.loads(raw.decode('utf-8-sig'))
    sha = hashlib.sha256(raw).hexdigest()
    OUT.mkdir(parents=True, exist_ok=True)
    records, audit, narrative = [], [], []
    for key, slug, role, move_ids in SPECS:
        item = data['entries'][key]
        content = item['content'].strip()
        name = re.search(r'<cultivation_lore name="([^"]+)">', content)[1]
        if key != '9' and not item['comment'].strip().lower().endswith('new'):
            raise ValueError(f'{key}: source selection changed')
        sections = dict(chunks(re.sub(r'</?cultivation_lore[^>]*>', '', content), 2))
        archive = dict(re.findall(r'(?m)^([^：\n]+)：([^\n]+)', sections['功法档案']))
        entry_id = 'gongfa.' + slug
        combat_sections = {k: v for k, v in sections.items() if k != '叙事规则'}
        rules = []
        section_refs = {}
        for index, (title, body) in enumerate(combat_sections.items(), 1):
            ref = f'{entry_id}.source.section-{index}'
            section_refs[title] = ref
            rules.append({'id': ref, 'heading': title, 'text': body, 'authority': 'source-verbatim'})
        abilities = chunks(sections.get('主要攻击形式', sections.get('主要术式', '')), 3)
        ids = move_ids.split()
        assert len(ids) == len(abilities), (name, len(ids), len(abilities))
        techniques = []
        for (title, body), move_id in zip(abilities, ids):
            rule_id = f'{entry_id}.{move_id}.definition'
            move_name = title.strip('《》')
            rules.append({'id': rule_id, 'heading': title, 'text': body, 'authority': 'source-verbatim'})
            techniques.append({
                'id': f'{entry_id}.{move_id}', 'name': move_name, 'school': name,
                'category': archive['类型'], 'originalDefinition': body,
                'mechanics': paragraphs(body),
                'availability': {'default': 'conditional', 'conditions': ['依据原文适用条件、已确认修为、已修成招式和本轮战场对象判断；模板导入不代表已掌握。'], 'requires': []},
                'triggeredState': [], 'visibility': 'player', 'ruleRefs': [rule_id],
                'ui': {'kind': 'action', 'label': move_name, 'group': name, 'summary': paragraphs(body)[0]},
                'resolution': {
                    'conditionSourceRefs': [rule_id, section_refs['境界表现'], section_refs['功法弱点']],
                    'effectSourceRefs': [rule_id, section_refs['核心战斗结构']],
                    'numericCost': None, 'cooldownTurns': None, 'durationTurns': None, 'maxStacks': None,
                    'unspecifiedPolicy': '原文未定量的数值保持未指定；不能填入0、固定上限、固定回合或自动成功。',
                    'outcomePolicy': '能力定义描述可实现效果；本次是否实现、幅度与代价由交锋条件裁定。'
                }
            })
        glossary = [{'term': re.sub(r'^[一二三四五六七八九十]+、', '', title), 'definition': body,
                     'sourceRef': section_refs['核心战斗结构'], 'uiKind': 'concept-or-state'}
                    for title, body in chunks(sections['核心战斗结构'], 3)]
        if key == '9':
            glossary.extend([
                {'term': '跳弓', 'definition': '弦乐器演奏弓法；在本功法中形成多段短促爆发，不是跳跃步法或射箭动作。', 'sourceRefs': [section_refs['乐器化施术原理'], section_refs['核心战斗结构'], techniques[2]['ruleRefs'][0]], 'authority': 'source-grounded-disambiguation', 'uiKind': 'performance-technique'},
                {'term': '九叠', 'definition': '多层潮势在同一时刻共振，不是固定只能攻击九次；原文没有三层叠潮上限。', 'sourceRefs': [techniques[-1]['ruleRefs'][0]], 'authority': 'source-grounded-disambiguation', 'uiKind': 'concept'},
                {'term': '潮眼', 'definition': '稳定叠加形成的爆发核心，可扩大、转移、扩散、压缩或引爆；不是仅用于观察的窗口。', 'sourceRefs': [section_refs['核心战斗结构']], 'authority': 'source-grounded-disambiguation', 'uiKind': 'state'}
            ])
        accepts, provides = PORTS[slug]
        entry = {
            'id': entry_id, 'name': name, 'rank': archive['品阶'], 'element': archive['属性'],
            'version': '2026.10.06-source.1', 'visibility': 'player', 'corePrinciple': archive['核心理念'],
            'mechanics': paragraphs(sections['总体定位']), 'techniques': techniques,
            'synergies': paragraphs(sections['与其他功法的关系']), 'narrativeGuidance': [],
            'ruleRefs': list(section_refs.values()),
            'authority': {'kind': 'user-designated-source', 'sourceFile': source.name, 'sourceFileSha256': sha,
                          'entryKey': key, 'uid': item.get('uid'), 'sourceComment': item['comment'],
                          'sourceDisabled': item.get('disable', False), 'contentSha256': hashlib.sha256(content.encode()).hexdigest(),
                          'status': 'source-backed-template; runtime-v2-integration-pending'},
            'combatSpec': {
                'schema': 'xybattle-combat-spec-v2-draft', 'role': role,
                'glossary': glossary, 'rules': rules,
                'realmProgression': {'text': sections['境界表现'], 'sourceRef': section_refs['境界表现']},
                'limitations': {'text': sections['功法弱点'], 'sourceRef': section_refs['功法弱点']},
                'integrationPorts': {'authority': 'engineering-classification', 'accepts': accepts, 'provides': provides,
                                     'semantics': '可交互对象类型，不是每招的强制前提，也不表示每次施法同时生成全部效果。'},
                'ownership': '由人物实例引用，不由此模板决定',
                'numericPolicy': '未规定的成本、倍率、槽位、回合、层数与成功率不做数值补全'
            }
        }
        record = {'schema': 'xybattle-content-v1', 'protocolVersion': 1, 'id': entry_id,
                  'contentType': 'technique', 'name': name, 'version': entry['version'],
                  'createdAt': '2026-10-06T00:00:00+08:00', 'updatedAt': '2026-10-06T00:00:00+08:00', 'entry': entry}
        records.append(record)
        dump(OUT / (slug + '.json'), record)
        audit.append(f'## {name}（entries/{key}）\n\n{content}\n')
        narrative.append(f'## {name}\n\n{sections.get("叙事规则", "")}\n')
    dump(OUT / 'six-arts.content.json', {'schema': 'xybattle-content-export-v1', 'protocolVersion': 1, 'items': records})
    entries = {r['entry']['id']: r['entry'] for r in records}
    edges = []
    for index, (origin, target, via, interaction, boundary) in enumerate(LINKS, 1):
        origin_id, target_id = 'gongfa.' + origin, 'gongfa.' + target
        refs = [r['id'] for entry_id in [origin_id, target_id] for r in entries[entry_id]['combatSpec']['rules']
                if r['heading'] in ['与其他功法的关系', '核心战斗结构', '功法弱点']]
        edges.append({'id': f'six-arts.interaction-{index:02}', 'from': origin_id, 'to': target_id,
                      'via': via, 'interaction': interaction, 'boundary': boundary,
                      'authority': 'source-grounded-summary', 'sourceRefs': refs,
                      'activation': '本轮相关对象和条件经裁定成立后适用；不是无条件被动增益'})
    dump(OUT / 'system-interactions.json', {
        'schema': 'xybattle-system-interactions-v2-draft', 'sourceFileSha256': sha,
        'templateRefs': [{'id': r['id'], 'version': r['version']} for r in records],
        'ownership': '该清单描述六法潜在联动；人物实际掌握情况须另行确认',
        'edges': edges,
        'sharedObjectContract': {
            'authority': 'proposed-runtime-design',
            'fields': ['id', 'type', 'ownerId', 'sourceRuleRefs', 'createdByActionId', 'positionOrTarget',
                       'lifecycle', 'visibility', 'controlledBy', 'dependsOn', 'invalidatedBy'],
            'waterLifecycle': ['受控维持', '已散逸可回收', '被隔断', '已湮灭', '已回收'],
            'principle': '同一水元不能既维持活跃术式又被回收，已湮灭不可回流；此枚举为工程表达，不增加原文能力。'
        }
    })
    (OUT / '来源原文.md').write_text('# 本次指定六法原文摘录\n\n仅供追溯，不作为整体提示词注入。\n\n' + '\n'.join(audit), encoding='utf-8')
    (OUT / '正文侧参考.md').write_text('# 原文叙事规则归档\n\n供后续主预设设计参考，不进入裁定模板的 narrativeGuidance；其中涉及能力边界的内容已由相应机制原文保留。\n\n' + '\n'.join(narrative), encoding='utf-8')
    print(json.dumps({'entries': len(records), 'actions': sum(len(r['entry']['techniques']) for r in records), 'sha256': sha}, ensure_ascii=False))

if __name__ == '__main__':
    build(pathlib.Path(sys.argv[1]))
