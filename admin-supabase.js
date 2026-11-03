(function(){
'use strict';
const $=id=>document.getElementById(id);
const defs=[['shoulder','Ombro'],['chest','Peito'],['bicepsLeft','Bíceps esquerdo'],['bicepsRight','Bíceps direito'],['forearmLeft','Antebraço esquerdo'],['forearmRight','Antebraço direito'],['abdomen','Abdômen'],['hip','Quadril'],['thighLeft','Coxa esquerda'],['thighRight','Coxa direita'],['calfLeft','Panturrilha esquerda'],['calfRight','Panturrilha direita']];
let db,clients=[],selected=null,measure={},plan={days:[]},template={days:[]},tab='measurements',busy=false;
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
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
}
function clearClient(){selected=null;measure={};plan={days:[]};$('noClient').hidden=false;$('clientArea').hidden=true;listClients();}
function listClients(){
  const q=$('clientSearch').value.trim().toLowerCase(),mount=$('clientList');mount.replaceChildren();
  clients.filter(c=>(c.full_name+' '+c.email).toLowerCase().includes(q)).forEach(c=>{
    const b=document.createElement('button');b.type='button';b.className='client-row'+(selected&&selected.id===c.id?' active':'');
    const name=document.createElement('strong');name.textContent=c.full_name;
    const email=document.createElement('small');email.textContent=c.email;b.append(name,email);
    b.addEventListener('click',()=>chooseClient(c.id).catch(fail));mount.appendChild(b);
  });
}
async function loadClients(){
  clients=check(await db.from('clients').select('id,full_name,email,auth_user_id').order('full_name'))||[];
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
  $('linkedStatus').textContent=selected.auth_user_id?'Conta já vinculada':'Aguardando cadastro e confirmação de e-mail do cliente';
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
function addDay(){return {id:newId(),title:'Novo treino',weekday:'',description:'',exercises:[]};}
function addExercise(){return {id:newId(),name:'Novo exercício',dose:'3 × 10',rest:'60 s',description:'',videoId:''};}
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
      field(body,'Instruções',ex.description,v=>ex.description=v,{full:true,multi:true,max:2000});
      field(body,'ID de vídeo (opcional)',ex.videoId,v=>ex.videoId=v,{full:true,max:60});
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
$('createClient').addEventListener('submit',async e=>{
  e.preventDefault();if(busy)return;busy=true;
  try{
    const name=$('clientName').value.trim(),email=$('clientEmail').value.trim().toLowerCase();
    if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Informe nome e e-mail válido.');
    const c=check(await db.from('clients').insert({full_name:name,email}).select('id').single());
    check(await db.from('client_measurements').upsert({client_id:c.id,values_cm:{}}));
    check(await db.from('client_plans').upsert({client_id:c.id,plan:copy(template?.days?.length?template:{days:[]})}));
    $('clientName').value='';$('clientEmail').value='';$('createClientDetails').open=false;
    await loadClients();await chooseClient(c.id);say('Cliente cadastrado. O acesso dependerá da confirmação de e-mail.');
  }catch(err){fail(err);}finally{busy=false;}
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
    say('Medições salvas para '+selected.full_name+'.');
  }catch(err){fail(err);}
});
$('addDay').addEventListener('click',()=>{if(plan.days.length>=15){say('Limite de 15 treinos.',true);return;}plan.days.push(addDay());paintPlans();});
$('useTemplate').addEventListener('click',()=>{
  if(!template.days?.length){say('Plano-base não disponível.',true);return;}
  if(confirm('Substituir o rascunho atual pelo plano-base?')){plan=copy(template);paintPlans();}
});
$('savePlan').addEventListener('click',async()=>{
  if(!selected)return;try{validatePlan();check(await db.from('client_plans').upsert({client_id:selected.id,plan:plan,updated_at:new Date().toISOString()}));say('Treinos salvos para '+selected.full_name+'.');}catch(err){fail(err);}
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