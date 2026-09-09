import { getStore } from '@netlify/blobs';
import { getUser } from '@netlify/identity';
import { handleProgress } from '../lib/progress-service.mjs';

export default async function progress(request) {
 try {
  const user = await getUser();
  if (!user) return new Response(JSON.stringify({error:'Faça login para sincronizar o progresso.'}),{status:401,headers:{'content-type':'application/json','cache-control':'no-store'}});
  const store = getStore({ name:'javaflow-user-progress', consistency: 'strong' });
  return await handleProgress(request,user,store);
 } catch(error) {
  console.error('Progress service unavailable',error.name);
  return new Response(JSON.stringify({error:'Nuvem indisponível. Sua cópia local está preservada; tente novamente.'}),{status:503,headers:{'content-type':'application/json','cache-control':'no-store'}});
 }
}
export const config = { path:'/api/progress' };

