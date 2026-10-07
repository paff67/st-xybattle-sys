// Test transport only. Never forwards upstream or records prompt text/headers.
const http=require('node:http'),fs=require('node:fs');
let n=0;
http.createServer(async(req,res)=>{
 if(req.url.includes('/models')){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({data:[{id:'yiyu-p0-mock',object:'model'}]}));}
 let raw='';for await(const p of req)raw+=p;
 let b;try{b=JSON.parse(raw)}catch{res.writeHead(400);return res.end();}
 const text=JSON.stringify(b.messages||[]);
 const markers=['P0_INPUT_CLICK','P0_INPUT_ENTER','P0_INPUT_CANCEL','P0_INPUT_FAIL','P0_PACKET_20261007','P0_RULE_SCAN','P0_AUX','P0_FIRST','P0_RETRY'];
 const record={index:++n,time:Date.now(),path:req.url,model:b.model,stream:b.stream,markers:Object.fromEntries(markers.map(x=>[x,text.split(x).length-1]))};
 fs.appendFileSync('/tmp/yiyu-p0-20261007.jsonl',JSON.stringify(record)+'\n');
 res.setHeader('Content-Type','application/json');
 res.end(JSON.stringify({id:'p0-'+n,object:'chat.completion',model:'yiyu-p0-mock',choices:[{index:0,message:{role:'assistant',content:'【P0接口测试】本轮仅验证宿主传输，未执行任何剧情裁定。'},finish_reason:'stop'}],usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}}));
}).listen(19997,'127.0.0.1');
