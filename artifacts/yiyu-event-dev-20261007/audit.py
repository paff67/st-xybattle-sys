import json,pathlib,subprocess,os,signal
p=pathlib.Path('/opt/sillytavern/yiyu_data/default-user/chats/yiyu-battle-test/codex-event-dev-20261007.jsonl')
r=[json.loads(x) for x in p.read_text().splitlines()]
root=r[0]['chat_metadata']['xy_event_v1']
out={'messages':len(r)-1,'revision':root['revision'],'events':[{'eventId':e['eventId'],'status':e['status'],'generationBindings':e['generationBindings']} for e in root['events'].values()]}
for line in subprocess.check_output(['docker','top','sillytavern_yiyu','-eo','pid,args'],text=True).splitlines()[1:]:
 parts=line.strip().split(None,1)
 if len(parts)==2 and parts[1]=='node public/scripts/extensions/third-party/codex-event-dev/mock.cjs':
  os.kill(int(parts[0]),signal.SIGTERM)
  out['mockStopped']=True
print(json.dumps(out,ensure_ascii=False,indent=2))
