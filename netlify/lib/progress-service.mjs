const headers = { 'cache-control':'no-store', 'content-type':'application/json; charset=utf-8' };
const json = (data,status=200) => new Response(JSON.stringify(data),{status,headers});
const validRevision = value => typeof value === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(value);

export async function handleProgress(request, user, store) {
 if(!user?.id)return json({error:'Faça login para sincronizar o progresso.'},401);
 const key = 'users/'+user.id+'.json', url = new URL(request.url);
 const snapshotKey = revision => 'history/'+user.id+'/'+revision+'.json';
 if(request.method==='GET'){
  const record=await store.get(key,{type:'json',consistency:'strong'});
  if(url.searchParams.has('history'))return json({history:record ? [{revision:record.revision,updatedAt:record.updatedAt},...(record.history||[])] : []});
  const revision=url.searchParams.get('revision');
  if(revision){
   if(!validRevision(revision))return json({error:'Versão inválida.'},400);
   if(record?.revision===revision)return json({record});
   // Account-scoped keys and authenticated identity prevent cross-account access.
   const saved=await store.get(snapshotKey(revision),{type:'json',consistency:'strong'});
   return saved ? json({record:saved}) : json({error:'Versão não encontrada.'},404);
  }
  return json({record:record||null});
 }
 if(request.method!=='PUT')return json({error:'Método não permitido.'},405);
 const origin=request.headers.get('origin');
 if(origin && origin!==url.origin)return json({error:'Origem inválida.'},403);
 const raw=await request.text();
 if(new TextEncoder().encode(raw).byteLength>900000)return json({error:'O progresso excedeu o limite de 900 KB. Exporte seu backup.'},413);
 let body;
 try{body=JSON.parse(raw);}catch{return json({error:'Dados inválidos.'},400);}
 const state=body?.state;
 if(!state || typeof state!=='object' || Array.isArray(state) || !state.user || !Array.isArray(state.completedLessons) || !Number.isInteger(state.version) || state.version<1 || state.version>20)return json({error:'Estado de progresso inválido.'},400);
 const currentResult=await store.getWithMetadata(key,{type:'json',consistency:'strong'});
 const current=currentResult?.data||null;
 const expectedRevision=body.expectedRevision??null, currentRevision=current?.revision??null;
 if(expectedRevision !== currentRevision)return json({error:'Conflito de sincronização.',record:current},409);
 if(current){
  await store.setJSON(snapshotKey(current.revision),{revision:current.revision,updatedAt:current.updatedAt,state:current.state},{onlyIfNew:true});
 }
 const history=current?[{revision:current.revision,updatedAt:current.updatedAt},...(current.history||[])].slice(0,7):[];
 const record={revision:crypto.randomUUID(),updatedAt:new Date().toISOString(),state,history};
 const result=await store.setJSON(key,record,currentResult?{onlyIfMatch:currentResult.etag}:{onlyIfNew:true});
 if(!result.modified){
  const latest=await store.get(key,{type:'json',consistency:'strong'});
  return json({error:'Outra sessão salvou primeiro. Vamos combinar o progresso.',record:latest},409);
 }
 // Read-back avoids reporting a failed or superseded write as synchronized.
 const verified=await store.get(key,{type:'json',consistency:'strong'});
 if(verified?.revision!==record.revision)return json({error:'A gravação precisa ser confirmada novamente.',record:verified},409);
 return json({record});
}

