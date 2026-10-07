import json, pathlib, hashlib, subprocess
root=pathlib.Path('/opt/sillytavern')
data=root/'yiyu_data/default-user'
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
out={'instance':'sillytavern_yiyu','chats':{},'extensions':[]}
for name in ['codex-event-p0-20261007','codex-event-p0-empty-20261007']:
    p=data/'chats/yiyu-battle-test'/f'{name}.jsonl'
    rows=[json.loads(s) for s in p.read_text().splitlines()]
    out['chats'][name]={'sha256':digest(p),'messages':len(rows)-1,
        'metadata':{k:v for k,v in rows[0].get('chat_metadata',{}).items() if k.startswith('xy_p0')},
        'receipts':[{'index':i,'is_user':m.get('is_user'),'receipt':m.get('extra',{}).get('xy_event_v1'),
          'swipes':[x.get('xy_event_v1') for x in m.get('swipe_info',[])]} for i,m in enumerate(rows[1:])]}
for p in sorted((root/'yiyu_extensions').glob('*/manifest.json')):
    m=json.loads(p.read_text())
    out['extensions'].append({'directory':p.parent.name,'version':m.get('version'),'loading_order':m.get('loading_order'),'generate_interceptor':m.get('generate_interceptor')})
baseline=json.loads((root/'backups/yiyu-p0-20261007/settings.json').read_text())
current=json.loads((data/'settings.json').read_text())
fields=['chat_completion_source','custom_url','custom_model','stream_openai']
out['connectionFieldsEqualBaseline']={k:current.get('oai_settings',{}).get(k)==baseline.get('oai_settings',{}).get(k) for k in fields}
out['containers']={}
for name in ['sillytavern_yiyu','sillytavern_me']:
    d=json.loads(subprocess.check_output(['docker','inspect',name]))[0]
    out['containers'][name]={'image':d['Image'],'startedAt':d['State']['StartedAt'],'running':d['State']['Running']}
print(json.dumps(out,ensure_ascii=False,indent=2))
