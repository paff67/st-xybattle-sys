"""Restore only this probe's settings and remove its exact runtime files."""
import json,pathlib,subprocess,os,signal
root=pathlib.Path('/opt/sillytavern')
p=root/'yiyu_data/default-user/settings.json'
b=json.loads((root/'backups/yiyu-p0-20261007/settings.json').read_text())
c=json.loads(p.read_text())
for k in ['chat_completion_source','custom_url','custom_model','stream_openai']:
    if k in b['oai_settings']: c['oai_settings'][k]=b['oai_settings'][k]
    else: c['oai_settings'].pop(k,None)
p.write_text(json.dumps(c,ensure_ascii=False,indent=4))
probe=root/'yiyu_extensions/codex-event-p0'
assert str(probe)=='/opt/sillytavern/yiyu_extensions/codex-event-p0'
for name in ['manifest.json','interceptor.js']:
    (probe/name).unlink(missing_ok=True)
probe.rmdir()
(root/'yiyu_extensions/codex-battle-qa/p0-mock.cjs').unlink(missing_ok=True)
# Match the exact executable arguments from docker top; no broad pkill.
top=subprocess.check_output(['docker','top','sillytavern_yiyu','-eo','pid,args'],text=True)
killed=[]
for line in top.splitlines()[1:]:
    pieces=line.strip().split(None,1)
    if len(pieces)==2 and pieces[1]=='node public/scripts/extensions/third-party/codex-battle-qa/p0-mock.cjs':
        os.kill(int(pieces[0]),signal.SIGTERM);killed.append(int(pieces[0]))
print(json.dumps({'restoredFields':4,'removedProbeExtension':True,'mockPidsStopped':killed}))
