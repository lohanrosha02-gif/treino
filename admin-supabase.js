(function(){
'use strict';
const $=id=>document.getElementById(id);
const defs=[['shoulder','Ombro'],['chest','Peito'],['bicepsLeft','Bíceps esquerdo'],['bicepsRight','Bíceps direito'],['forearmLeft','Antebraço esquerdo'],['forearmRight','Antebraço direito'],['abdomen','Abdômen'],['hip','Quadril'],['thighLeft','Coxa esquerda'],['thighRight','Coxa direita'],['calfLeft','Panturrilha esquerda'],['calfRight','Panturrilha direita']];
let db,clients=[],selected=null,measure={},plan={days:[]},template={days:[]},tab='measurements',busy=false,onlyPending=false;
function say(text,error=false){$('status').textContent=text;$('status').className='feedback'+(error?' error':' success');}
function check(result){if(result.error)throw result.error;return result.data;}
function setupOk(){const c=window.MEU_TREINO_SUPABASE||{};return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(c.url||'')&&typeof c.publishableKey==='string'&&c.publishableKey.length>15;}
function newId(){return crypto.randomUUID();}
function copy(v){return JSON.parse(JSON.stringify(v));}
function field(where,label,value,onInput,options={}){
  const box=document.createElement('div');box.className='field-block'+(options.full?' full':'');
  const lab=document.createElement('label');lab.textContent=label;
  const input=document.createElement(options.multi?'textarea':'input');input.className=options.multi?'field-area':'field-input';
  if(options.multi)input.rows=options.rows||3;else input.type=options.type||'text';
  input.maxLength=options.max||650;input.value=value??'';
  input.addEventListener('input',()=>onInput(input.value));
  box.append(lab,input);where.appendChild(box);return input;
}
function button(label,cls,onClick){
  const b=document.createElement('button');b.type='button';b.className='button '+cls;b.textContent=label;b.addEventListener('click',onClick);return b;
}
function setTab(name){tab=name;$('measureEditor').hidden=name!=='measurements';$('planEditor').hidden=name!=='plans';
  document.querySelectorAll('[data-tab]').forEach(b=>{
    const active=b.dataset.tab===name;
    b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));
  });
}
function clearClient(){selected=null;measure={};plan={days:[]};$('noClient').hidden=false;$('clientArea').hidden=true;listClients();}
function listClients(){
  const q=$('clientSearch').value.trim().toLowerCase(),mount=$('clientList');mount.replaceChildren();
  const waiting=clients.filter(c=>c.approval_status!=='approved').length;
  $('pendingCount').textContent=waiting;
  $('totalClientCount').textContent=clients.length;
  $('approvedClientCount').textContent=clients.length-waiting;
  $('waitingClientCount').textContent=waiting;
  $('showPending').setAttribute('aria-pressed',String(onlyPending));
  $('showAll').setAttribute('aria-pressed',String(!onlyPending));
  $('showPending').classList.toggle('filter-active',onlyPending);
  $('showAll').classList.toggle('filter-active',!onlyPending);
  const matching=clients.filter(c=>(!onlyPending||c.approval_status!=='approved')&&(c.full_name+' '+c.email).toLowerCase().includes(q));
  matching.forEach(c=>{
    const b=document.createElement('button');b.type='button';b.className='client-row'+(selected&&selected.id===c.id?' active':'');
    const name=document.createElement('strong');name.textContent=c.full_name;
    const email=document.createElement('small');email.textContent=c.email;
    const state=document.createElement('small');state.textContent=c.approval_status==='approved'?'✓ Aprovado':(c.auth_user_id?'● Aguardando aprovação':'Aguardando confirmação');
    state.className=c.approval_status==='approved'?'approved-status':'pending-status';
    b.append(name,email,state);
    b.addEventListener('click',()=>chooseClient(c.id).catch(fail));mount.appendChild(b);
  });
  if(!matching.length){
    const empty=document.createElement('p');empty.className='client-list-empty';empty.setAttribute('role','status');
    empty.textContent=clients.length?'Nenhum aluno encontrado.':'Ainda não há alunos cadastrados.';
    mount.appendChild(empty);
  }
}
async function loadClients(){
  clients=check(await db.from('clients').select('id,full_name,email,auth_user_id,approval_status').order('full_name'))||[];
  if(selected&&!clients.some(x=>x.id===selected.id))clearClient();
  listClients();
}
async function chooseClient(id){
  selected=clients.find(c=>c.id===id);if(!selected)return;
  const [a,b]=await Promise.all([
    db.from('client_measurements').select('measurement_date,values_cm').eq('client_id',id).maybeSingle(),
    db.from('client_plans').select('plan').eq('client_id',id).maybeSingle()
  ]);
  const mr=check(a),pr=check(b);measure={date:mr?.measurement_date||'',values:copy(mr?.values_cm||{})};
  plan=copy(pr?.plan||{days:[]});if(!Array.isArray(plan.days))plan.days=[];
  $('selectedName').textContent=selected.full_name;$('selectedEmail').textContent=selected.email;
  $('planStudentName').textContent='Ficha de '+selected.full_name;
  const pending=selected.approval_status!=='approved';
  $('linkedStatus').textContent=pending?(selected.auth_user_id?'Cadastro confirmado — aguardando sua aprovação':'Aguardando confirmação de e-mail'):'✓ Acesso aprovado';
  $('approvalActions').hidden=!(pending&&selected.auth_user_id);
  $('clientArea').hidden=false;$('noClient').hidden=true;
  paintMeasures();paintPlans();setTab(tab);listClients();
}
function paintMeasures(){
  const root=$('measureFields');root.replaceChildren();
  field(root,'Data da medição',measure.date,v=>measure.date=v,{type:'date',full:true});
  defs.forEach(([id,name])=>{
    const wrap=document.createElement('div');wrap.className='field-block';
    const lab=document.createElement('label');lab.textContent=name+' (cm)';
    const w=document.createElement('div');w.className='unit-wrap';
    const input=document.createElement('input');input.className='field-input';input.inputMode='decimal';input.maxLength=6;
    input.placeholder='Ex.: 35,5';input.value=measure.values[id]??'';
    input.addEventListener('input',()=>measure.values[id]=input.value.trim());
    const suffix=document.createElement('span');suffix.textContent='cm';w.append(input,suffix);wrap.append(lab,w);root.appendChild(wrap);
  });
}
function addDay(){return {id:newId(),title:'Novo treino',weekday:'',description:'',duration:'',recover:'',exercises:[]};}
function addExercise(){return {id:newId(),name:'Novo exercício',dose:'3 × 10',rest:'60 s',description:'',videoId:'',category:'exercise'};}
function exerciseCategory(ex){
  if(['exercise','mobility','cardio'].includes(ex.category))return ex.category;
  const id=String(ex.videoId||ex.id||'');
  return /^m[A-D]/i.test(id)?'mobility':/^cardio[A-D]/i.test(id)?'cardio':'exercise';
}
function exerciseCatalogue(){
  const all=new Map();
  for(const day of template?.days||[])for(const ex of day.exercises||[]){
    if(ex.videoId&&!all.has(ex.videoId))all.set(ex.videoId,ex);
  }
  return all;
}
function mediaSelector(parent,ex){
  const catalog=exerciseCatalogue(),clips=window.MeuTreinoVideos?.clips||{};
  const presetBox=document.createElement('div');presetBox.className='field-block full';
  const presetLabel=document.createElement('label');presetLabel.textContent='Adicionar / copiar exercício do acervo';
  const presetSelect=document.createElement('select');presetSelect.className='field-input';
  presetSelect.append(new Option('Escolha um dos exercícios originais (opcional)',''));
  for(const [id,item] of catalog)presetSelect.append(new Option(item.name+' · '+id,id));
  presetSelect.addEventListener('change',()=>{
    const item=catalog.get(presetSelect.value);
    if(!item)return;
    if(ex.name!=='Novo exercício'&&!confirm('Substituir os dados deste exercício pelos do acervo?')){presetSelect.value='';return;}
    const stableId=ex.id;
    Object.assign(ex,copy(item),{id:stableId,category:exerciseCategory(item)});
    paintPlans();
  });
  presetBox.append(presetLabel,presetSelect);parent.appendChild(presetBox);
  const box=document.createElement('div');box.className='field-block full';
  const label=document.createElement('label');label.textContent='Vídeo ou imagem demonstrativa';
  const select=document.createElement('select');select.className='field-input';
  select.appendChild(new Option('Sem vídeo',''));
  const ids=Object.keys(clips).filter(k=>clips[k]?.url&&k!=='version');
  if(ex.videoId&&!ids.includes(ex.videoId))select.appendChild(new Option(ex.videoId+' (não encontrado)',ex.videoId));
  for(const id of ids){
    const item=catalog.get(id),clip=clips[id];
    select.appendChild(new Option((item?.name||clip.name||id)+' · '+id,id));
  }
  select.value=String(ex.videoId||'');
  const preview=document.createElement('div');preview.className='media-preview';
  function render(){
    preview.replaceChildren();
    const clip=clips[select.value];
    if(!clip||!/^\.\/assets\/videos\/[a-z0-9_-]+\.mp4$/i.test(clip.url))return;
    const video=document.createElement('video');
    video.controls=true;video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';
    video.src='https://lohanrosha02-gif.github.io/treino-v2/'+clip.url.replace(/^\.\//,'');
    if(typeof clip.poster==='string'&&/^\.\/assets\/(?:videos|images)\/[a-z0-9_-]+\.webp$/i.test(clip.poster))
      video.poster='https://lohanrosha02-gif.github.io/treino-v2/'+clip.poster.replace(/^\.\//,'');
    preview.appendChild(video);
  }
  select.addEventListener('change',()=>{ex.videoId=select.value;render();});
  box.append(label,select,preview);parent.appendChild(box);render();
}
function categorySelector(parent,ex){
  const wrap=document.createElement('div');wrap.className='field-block';
  const label=document.createElement('label');label.textContent='Tipo de atividade';
  const select=document.createElement('select');select.className='field-input';
  [['exercise','Musculação'],['mobility','Mobilidade / aquecimento'],['cardio','Cardio']].forEach(([v,title])=>select.add(new Option(title,v)));
  select.value=exerciseCategory(ex);ex.category=select.value;
  select.addEventListener('change',()=>{ex.category=select.value;});
  wrap.append(label,select);parent.appendChild(wrap);
}
function paintPlans(){
  const root=$('daysList');root.replaceChildren();
  plan.days.forEach((day,di)=>{
    const card=document.createElement('section');card.className='day-card';
    const head=document.createElement('div');head.className='day-head';
    const heading=document.createElement('strong');heading.textContent='Treino '+(di+1);
    head.append(heading,button('Remover treino','danger mini',()=>{
      if(confirm('Remover este treino?')){plan.days.splice(di,1);paintPlans();}
    }));card.appendChild(head);
    const info=document.createElement('div');info.className='form-grid';
    field(info,'Nome do treino',day.title,v=>day.title=v);
    field(info,'Dia / frequência',day.weekday,v=>day.weekday=v);
    field(info,'Duração estimada',day.duration||'',v=>day.duration=v);
    field(info,'Intervalo até a próxima sessão',day.recover||'',v=>day.recover=v);
    field(info,'Orientações gerais',day.description,v=>day.description=v,{full:true,multi:true,max:2000});
    card.appendChild(info);
    const exercises=document.createElement('div');exercises.className='exercise-list';
    (day.exercises||[]).forEach((ex,ei)=>{
      const details=document.createElement('details');details.className='exercise';
      const summary=document.createElement('summary');summary.textContent=(ei+1)+'. '+ex.name;details.appendChild(summary);
      const body=document.createElement('div');body.className='exercise-fields';
      field(body,'Exercício',ex.name,v=>{ex.name=v;summary.textContent=(ei+1)+'. '+v;},{full:true,max:130});
      field(body,'Séries / repetições',ex.dose,v=>ex.dose=v,{max:100});
      field(body,'Descanso',ex.rest,v=>ex.rest=v,{max:70});
      categorySelector(body,ex);
      field(body,'Grupo muscular (opcional)',ex.muscle||'',v=>ex.muscle=v,{max:170});
      field(body,'Alternativa (opcional)',ex.hotel||'',v=>ex.hotel=v,{full:true,max:350});
      field(body,'Instruções',ex.description,v=>ex.description=v,{full:true,multi:true,max:2000});
      field(body,'Aviso / cuidado (opcional)',ex.cue||'',v=>ex.cue=v,{full:true,multi:true,max:450});
      mediaSelector(body,ex);
      body.appendChild(button('Remover exercício','danger mini',()=>{if(confirm('Excluir '+ex.name+'?')){day.exercises.splice(ei,1);paintPlans();}}));
      details.appendChild(body);exercises.appendChild(details);
    });
    card.appendChild(exercises);
    card.appendChild(button('+ Adicionar exercício','secondary mini',()=>{
      if(day.exercises.length>=40){say('Limite de 40 exercícios por treino.',true);return;}
      day.exercises.push(addExercise());paintPlans();
    }));
    root.appendChild(card);
  });
  if(!plan.days.length){const p=document.createElement('p');p.className='muted';p.textContent='Nenhum treino cadastrado. Clique em Novo treino ou Usar plano-base.';root.appendChild(p);}
}
function validatePlan(){
  if(!Array.isArray(plan.days)||plan.days.length>15)throw Error('Máximo de 15 treinos por cliente.');
  const seen=new Set();
  for(const d of plan.days){
    if(!d.id||seen.has(d.id)||typeof d.title!=='string'||!d.title.trim()||d.title.length>130||String(d.description||'').length>2000)throw Error('Verifique o nome e a descrição dos treinos.');
    seen.add(d.id);
    if(!Array.isArray(d.exercises)||d.exercises.length>40)throw Error('Máximo de 40 exercícios por treino.');
    for(const e of d.exercises)if(!e.id||!String(e.name||'').trim()||e.name.length>130||String(e.description||'').length>2000||String(e.dose||'').length>100)throw Error('Revise os campos dos exercícios.');
  }
}
async function loadTemplate(){try{const r=await fetch('./training-defaults.json',{cache:'no-store'});if(!r.ok)throw Error('Arquivo indisponível');template=await r.json();}catch(e){say('Não foi possível ler plano-base: '+e.message,true);}}
async function loadNotice(){
  const n=check(await db.from('site_announcements').select('enabled,title,message').eq('id',1).maybeSingle());
  $('noticeOn').checked=!!n?.enabled;$('noticeTitle').value=n?.title||'';$('noticeBody').value=n?.message||'';
}
async function onLogin(user){
  const admin=check(await db.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle());
  if(!admin){await db.auth.signOut();$('workspace').hidden=true;$('auth').hidden=false;throw Error('Seu usuário não está autorizado. Cadastre o UID em admin_users.');}
  $('auth').hidden=true;$('workspace').hidden=false;$('adminIdentity').textContent=user.email;
  await Promise.all([loadClients(),loadTemplate(),loadNotice()]);say('Conectado ao Supabase como administrador.');
}
function fail(e){say(e.message||String(e),true);}
async function init(){
  const config=window.MEU_TREINO_SUPABASE||{};
  if(!setupOk()||!window.supabase){$('setup').hidden=false;say('Configure o Supabase para ativar o painel.',true);return;}
  db=window.supabase.createClient(config.url,config.publishableKey);
  try{const u=check(await db.auth.getUser());if(u.user)await onLogin(u.user);else{$('auth').hidden=false;say('Entre para administrar os clientes.');}}
  catch(e){$('auth').hidden=false;fail(e);}
}
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();try{const v=check(await db.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value}));
    $('loginPassword').value='';await onLogin(v.user);
  }catch(err){fail(err);}
});
$('signOut').addEventListener('click',async()=>{await db.auth.signOut();clearClient();$('workspace').hidden=true;$('auth').hidden=false;say('Sessão encerrada.');});
$('clientSearch').addEventListener('input',listClients);
$('refreshClients').addEventListener('click',()=>loadClients().catch(fail));
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('showPending').addEventListener('click',function(){onlyPending=true;listClients();});
$('showAll').addEventListener('click',function(){onlyPending=false;listClients();});
$('approveClient').addEventListener('click',async function(){
  if(!selected||!selected.auth_user_id||selected.approval_status==='approved')return;
  if(!confirm('Aprovar o acesso de '+selected.full_name+' às próprias medidas e treinos?'))return;
  try{
    // Atribui o plano-base a quem ainda não tem um plano, sem apagar planos pessoais.
    const existing=check(await db.from('client_plans').select('client_id').eq('client_id',selected.id).maybeSingle());
    let initialPlan=false;
    if(!existing&&Array.isArray(template?.days)&&template.days.length){
      check(await db.from('client_plans').insert({client_id:selected.id,plan:copy(template)}));
      initialPlan=true;
    }
    const updated=check(await db.from('clients')
      .update({approval_status:'approved',approved_at:new Date().toISOString()})
      .eq('id',selected.id)
      .eq('approval_status','pending')
      .not('auth_user_id','is',null)
      .select('id').maybeSingle());
    if(!updated)throw Error('A aprovação não foi aplicada. Atualize a lista.');
    const id=selected.id;await loadClients();await chooseClient(id);
    say('Aluno aprovado! '+(initialPlan?'Os treinos A, B, C e D foram adicionados. ':'')+'Ele já pode acessar o site principal.');
  }catch(e){fail(e);}
});
$('deleteClient').addEventListener('click',async()=>{
  if(!selected||!confirm('Excluir definitivamente '+selected.full_name+' e todas as suas medições e treinos?'))return;
  try{check(await db.from('clients').delete().eq('id',selected.id));clearClient();await loadClients();say('Cliente excluído.');}catch(e){fail(e);}
});
$('saveMeasures').addEventListener('submit',async e=>{
  e.preventDefault();if(!selected)return;
  try{
    const values={};
    for(const [id,label] of defs){const v=String(measure.values[id]??'').trim();
      if(v&&!/^\d{1,3}(?:[.,]\d{1,2})?$/.test(v))throw Error('Valor inválido: '+label);
      if(v){const num=Number(v.replace(',','.'));if(num<=0||num>300)throw Error('Verifique '+label);values[id]=num;}
    }
    check(await db.from('client_measurements').upsert({client_id:selected.id,measurement_date:measure.date||null,values_cm:values,updated_at:new Date().toISOString()}));
    say('Medidas salvas para '+selected.full_name+'. O portal atualiza automaticamente em até 30 segundos.');
  }catch(err){fail(err);}
});
$('addDay').addEventListener('click',()=>{if(plan.days.length>=15){say('Limite de 15 treinos.',true);return;}plan.days.push(addDay());paintPlans();});
$('useTemplate').addEventListener('click',()=>{
  if(!template.days?.length){say('Plano-base não disponível.',true);return;}
  if(confirm('Substituir o rascunho atual pelo plano-base?')){plan=copy(template);paintPlans();}
});
$('savePlan').addEventListener('click',async()=>{
  if(!selected)return;
  const recipient=selected,snapshot=copy(plan),button=$('savePlan');
  button.disabled=true;button.textContent='Enviando…';
  try{
    validatePlan();
    check(await db.from('client_plans').upsert({client_id:recipient.id,plan:snapshot,updated_at:new Date().toISOString()}));
    say('Ficha enviada para '+recipient.full_name+'. O portal atualiza automaticamente em até 30 segundos.');
  }catch(err){fail(err);}
  finally{button.disabled=false;button.textContent='Salvar e enviar ao aluno';}
});
$('saveAllPlans').addEventListener('click',async()=>{
  if(!selected)return;try{
    validatePlan();if(!clients.length)throw Error('Nenhum cliente cadastrado.');
    if(!confirm('Substituir os treinos de TODOS os '+clients.length+' clientes? As medidas serão preservadas.'))return;
    if(prompt('Para confirmar, digite TODOS:')!=='TODOS')return;
    const count=check(await db.rpc('admin_apply_plan_to_all',{new_plan:plan}));
    say('Planos atualizados para '+count+' clientes, sem alterar as medições.');
  }catch(e){fail(e);}
});
$('noticeForm').addEventListener('submit',async e=>{
  e.preventDefault();try{check(await db.from('site_announcements').upsert({id:1,enabled:$('noticeOn').checked,title:$('noticeTitle').value.trim(),message:$('noticeBody').value.trim(),updated_at:new Date().toISOString()}));say('Comunicado geral salvo.');}catch(err){fail(err);}
});
init();
})();
