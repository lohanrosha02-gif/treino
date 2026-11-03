(function(){
'use strict';
const $=id=>document.getElementById(id);
const measurementGroups=[
  {title:'Dados básicos',fields:[['idade','Idade','anos'],['peso','Peso','kg'],['altura','Altura','cm']]},
  {title:'Tronco',fields:[['abdomen','Abdômen','cm'],['hip','Quadril','cm'],['chest','Peito / tórax','cm'],['shoulder','Ombro','cm']]},
  {title:'Braços',fields:[['bicepsLeft','Bíceps esquerdo','cm'],['bicepsRight','Bíceps direito','cm'],['armRelaxedLeft','Braço relaxado esquerdo','cm'],['armRelaxedRight','Braço relaxado direito','cm']]},
  {title:'Pernas',fields:[['thighLeft','Coxa esquerda','cm'],['thighRight','Coxa direita','cm'],['calfLeft','Panturrilha esquerda','cm'],['calfRight','Panturrilha direita','cm']]}
];
const defs=measurementGroups.flatMap(group=>group.fields);
let db,clients=[],selected=null,measure={},plan={days:[]},template={days:[]},tab='measurements',onlyPending=false,selectionRevision=0,previewDayId='',previewExerciseId='',previewMediaKey='',catalogTargetDayId='';
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
  input.addEventListener('input',()=>{onInput(input.value);if(where.closest('#daysList'))paintPlanPreview();});
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
function clearClient(){
  selectionRevision++;selected=null;measure={};plan={days:[]};previewDayId='';previewExerciseId='';previewMediaKey='';
  $('noClient').querySelector('h2').textContent='Selecione um aluno';
  $('noClient').querySelector('p').textContent='As medidas e a ficha aparecem aqui para você conferir e editar.';
  $('noClient').hidden=false;$('clientArea').hidden=true;listClients();
}
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
  const recipient=clients.find(c=>c.id===id);if(!recipient)return;
  selected=recipient;
  const request=++selectionRevision;
  measure={date:'',values:{}};plan={days:[]};previewDayId='';previewExerciseId='';previewMediaKey='';listClients();
  $('clientArea').hidden=true;$('noClient').hidden=false;
  $('noClient').querySelector('h2').textContent='Carregando '+recipient.full_name+'…';
  $('noClient').querySelector('p').textContent='Buscando a avaliação e a ficha vinculadas a este cadastro.';
  say('Carregando a ficha individual…');
  let a,b;
  try{
    [a,b]=await Promise.all([
      db.from('client_measurements').select('measurement_date,values_cm').eq('client_id',id).maybeSingle(),
      db.from('client_plans').select('plan').eq('client_id',id).maybeSingle()
    ]);
  }catch(error){
    if(request!==selectionRevision)return;
    $('noClient').querySelector('h2').textContent='Não foi possível carregar';
    $('noClient').querySelector('p').textContent='Confira sua conexão e selecione o aluno novamente.';
    throw error;
  }
  if(request!==selectionRevision||selected?.id!==id)return;
  const mr=check(a),pr=check(b);measure={date:mr?.measurement_date||'',values:copy(mr?.values_cm||{})};
  plan=copy(pr?.plan||{days:[]});if(!Array.isArray(plan.days))plan.days=[];
  $('selectedName').textContent=recipient.full_name;$('selectedEmail').textContent=recipient.email;
  $('planStudentName').textContent='Ficha de '+recipient.full_name;
  const pending=recipient.approval_status!=='approved';
  $('linkedStatus').textContent=pending?(recipient.auth_user_id?'Cadastro confirmado — aguardando sua aprovação':'Aguardando confirmação de e-mail'):'✓ Acesso aprovado';
  $('approvalActions').hidden=!(pending&&recipient.auth_user_id);
  $('clientArea').hidden=false;$('noClient').hidden=true;
  paintMeasures();paintPlans();setTab(tab);listClients();say('Ficha de '+recipient.full_name+' carregada.');
}
function paintMeasures(){
  const root=$('measureFields');root.replaceChildren();
  field(root,'Data da medição',measure.date,v=>measure.date=v,{type:'date',full:true});
  measurementGroups.forEach(group=>{
    const section=document.createElement('section');section.className='measurement-group';
    const heading=document.createElement('h3');heading.textContent=group.title;section.appendChild(heading);
    const grid=document.createElement('div');grid.className='form-grid';
    group.fields.forEach(([id,name,unit])=>{
      const wrap=document.createElement('div');wrap.className='field-block';
      const lab=document.createElement('label');lab.textContent=name+' ('+unit+')';
      const w=document.createElement('div');w.className='unit-wrap';
      const input=document.createElement('input');input.className='field-input';input.inputMode='decimal';input.maxLength=7;
      input.placeholder=unit==='kg'?'Ex.: 68,5':unit==='anos'?'Ex.: 32':'Ex.: 35,5';input.value=measure.values[id]??'';
      input.addEventListener('input',()=>measure.values[id]=input.value.trim());
      const suffix=document.createElement('span');suffix.textContent=unit;w.append(input,suffix);wrap.append(lab,w);grid.appendChild(wrap);
    });
    section.appendChild(grid);root.appendChild(section);
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
function mediaSelector(parent,ex,onMediaChange=()=>{}){
  const clips=window.MeuTreinoVideos?.clips||{};
  const box=document.createElement('div');box.className='field-block full';
  const label=document.createElement('label');label.textContent='Vídeo ou imagem demonstrativa';
  const select=document.createElement('select');select.className='field-input';
  select.appendChild(new Option('Sem vídeo',''));
  const ids=Object.keys(clips).filter(k=>clips[k]?.url&&k!=='version');
  if(ex.videoId&&!ids.includes(ex.videoId))select.appendChild(new Option(ex.videoId+' (não encontrado)',ex.videoId));
  for(const id of ids){const clip=clips[id];select.appendChild(new Option((clip.name||id)+' · '+id,id));}
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
  select.addEventListener('change',()=>{ex.videoId=select.value;render();onMediaChange();paintPlanPreview();});
  box.append(label,select,preview);parent.appendChild(box);render();
}
function mediaAssetUrl(path){
  if(typeof path!=='string'||!/^\.\/assets\/(?:videos|images)\/[a-z0-9_-]+\.(?:webp|png|jpe?g)$/i.test(path))return '';
  return 'https://lohanrosha02-gif.github.io/treino-v2/'+path.replace(/^\.\//,'');
}
function videoAssetUrl(path){
  if(typeof path!=='string'||!/^\.\/assets\/videos\/[a-z0-9_-]+\.mp4$/i.test(path))return '';
  return 'https://lohanrosha02-gif.github.io/treino-v2/'+path.replace(/^\.\//,'');
}
function paintPlanPreview(){
  const daySelect=$('previewDaySelect'),clips=window.MeuTreinoVideos?.clips||{};
  if(!daySelect)return;
  daySelect.replaceChildren();
  plan.days.forEach((day,index)=>daySelect.add(new Option((index+1)+' · '+(day.title||'Novo treino'),day.id)));
  let day=plan.days.find(item=>item.id===previewDayId)||plan.days[0]||null;
  previewDayId=day?.id||'';daySelect.value=previewDayId;daySelect.disabled=!day;
  $('previewStudentName').textContent=selected?.full_name||'Aluno';
  $('previewAvatar').textContent=(selected?.full_name||'A').trim().charAt(0).toLocaleUpperCase('pt-BR');
  const media=$('previewMedia'),items=$('previewExerciseList');items.replaceChildren();
  if(!day){
    $('previewWeekday').textContent='FICHA DE TREINO';$('previewDayTitle').textContent='Adicione um treino para começar';
    $('previewMeta').textContent='A prévia vai acompanhar as alterações feitas nesta ficha.';
    $('previewExerciseName').textContent='Nenhum exercício selecionado';$('previewExerciseDose').textContent='';
    $('previewInstructions').hidden=true;$('previewGuidance').hidden=true;$('previewExerciseCount').textContent='0';
    media.replaceChildren();previewMediaKey='';
    const art=document.createElement('div');art.className='preview-empty-art';art.setAttribute('aria-hidden','true');art.textContent='＋';
    const note=document.createElement('p');note.textContent='Escolha um exercício com demonstração para ver a imagem ou o vídeo aqui.';media.append(art,note);
    return;
  }
  $('previewWeekday').textContent=day.weekday||'FICHA DE TREINO';
  $('previewDayTitle').textContent=day.title||'Novo treino';
  const meta=[day.duration&&'Duração '+day.duration,day.recover&&'Intervalo '+day.recover].filter(Boolean);
  $('previewMeta').textContent=meta.join(' · ')||'Treino personalizado para você';
  const exercises=Array.isArray(day.exercises)?day.exercises:[];
  let focused=exercises.find(ex=>ex.id===previewExerciseId)||exercises[0]||null;
  previewExerciseId=focused?.id||'';
  $('previewExerciseCount').textContent=String(exercises.length);
  if(focused){
    const clip=clips[focused.videoId||focused.id]||{};
    const videoUrl=videoAssetUrl(clip.url),posterUrl=mediaAssetUrl(clip.poster);
    const key=[focused.id,videoUrl,posterUrl].join('|');
    if(key!==previewMediaKey){
      media.replaceChildren();
      if(videoUrl){
        const video=document.createElement('video');video.className='preview-demo-video';video.autoplay=true;video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.src=videoUrl;
        if(posterUrl)video.poster=posterUrl;
        video.setAttribute('aria-label','Demonstração em vídeo de '+(focused.name||'exercício'));
        media.appendChild(video);video.play().catch(()=>{});
      }else if(posterUrl){
        const image=document.createElement('img');image.className='preview-demo-image';image.src=posterUrl;image.alt='Demonstração de '+(focused.name||'exercício');image.loading='lazy';media.appendChild(image);
      }else{
        const art=document.createElement('div');art.className='preview-empty-art';art.setAttribute('aria-hidden','true');art.textContent='✳';
        const note=document.createElement('p');note.textContent='Adicione uma demonstração pelo acervo para exibir a imagem ou o vídeo.';media.append(art,note);
      }
      previewMediaKey=key;
    }
    $('previewExerciseName').textContent=focused.name||'Exercício sem nome';
    $('previewExerciseDose').textContent=[focused.dose,focused.rest&&'Descanso '+focused.rest].filter(Boolean).join(' · ');
    const instructions=$('previewInstructions');instructions.textContent=focused.description||'';instructions.hidden=!focused.description;
  }else{
    media.replaceChildren();previewMediaKey='';
    const art=document.createElement('div');art.className='preview-empty-art';art.setAttribute('aria-hidden','true');art.textContent='＋';
    const note=document.createElement('p');note.textContent='Adicione exercícios para montar a sessão do aluno.';media.append(art,note);
    $('previewExerciseName').textContent='Nenhum exercício nesta sessão';$('previewExerciseDose').textContent='';$('previewInstructions').hidden=true;
  }
  exercises.forEach((ex,index)=>{
    const clip=clips[ex.videoId||ex.id]||{},posterUrl=mediaAssetUrl(clip.poster);
    const row=document.createElement('button');row.type='button';row.className='preview-exercise-row'+(focused?.id===ex.id?' active':'');row.setAttribute('aria-pressed',String(focused?.id===ex.id));
    const thumb=document.createElement('span');thumb.className='preview-exercise-thumb';
    if(posterUrl){const image=document.createElement('img');image.src=posterUrl;image.alt='';image.loading='lazy';thumb.appendChild(image);}else thumb.textContent='✳';
    const details=document.createElement('span');details.className='preview-exercise-copy';
    const name=document.createElement('strong');name.textContent=(index+1)+'. '+(ex.name||'Novo exercício');
    const dose=document.createElement('small');dose.textContent=[ex.dose,ex.rest&&'Descanso '+ex.rest].filter(Boolean).join(' · ')||'Sem séries definidas';
    details.append(name,dose);row.append(thumb,details);
    row.addEventListener('click',()=>{previewExerciseId=ex.id;paintPlanPreview();});items.appendChild(row);
  });
  const guidance=$('previewGuidance');guidance.textContent=day.description||'';guidance.hidden=!day.description;
}
function paintExercisePicker(){
  const root=$('exercisePickerGrid'),query=$('exercisePickerSearch').value.trim().toLocaleLowerCase('pt-BR');
  const clips=window.MeuTreinoVideos?.clips||{},catalog=[...exerciseCatalogue().values()];root.replaceChildren();
  const matching=catalog.filter(item=>[item.name,item.muscle,item.category].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR').includes(query));
  if(!matching.length){const empty=document.createElement('p');empty.className='exercise-picker-empty';empty.textContent=catalog.length?'Nenhum exercício encontrado. Tente outro nome.':'O acervo de exercícios não está disponível.';root.appendChild(empty);return;}
  matching.forEach(item=>{
    const clip=clips[item.videoId]||{},poster=mediaAssetUrl(clip.poster);
    const option=document.createElement('button');option.type='button';option.className='exercise-library-card';
    const imageWrap=document.createElement('span');imageWrap.className='exercise-library-image';
    if(poster){const image=document.createElement('img');image.src=poster;image.alt='';image.loading='lazy';imageWrap.appendChild(image);}else imageWrap.textContent='✳';
    const name=document.createElement('strong');name.textContent=item.name||clip.name||'Exercício';
    const meta=document.createElement('small');meta.textContent=[item.muscle,exerciseCategory(item)==='mobility'?'Mobilidade':exerciseCategory(item)==='cardio'?'Cardio':'Musculação'].filter(Boolean).join(' · ');
    const add=document.createElement('span');add.className='exercise-library-add';add.textContent='Adicionar +';
    option.append(imageWrap,name,meta,add);
    option.addEventListener('click',()=>{
      const day=plan.days.find(entry=>entry.id===catalogTargetDayId);
      if(!day)return;
      if(day.exercises.length>=40){say('Limite de 40 exercícios por treino.',true);return;}
      const added={...copy(item),id:newId(),category:exerciseCategory(item)};
      day.exercises.push(added);previewDayId=day.id;previewExerciseId=added.id;previewMediaKey='';
      paintPlans();$('exercisePickerDialog').close();
    });
    root.appendChild(option);
  });
}
function categorySelector(parent,ex,onChange=()=>{}){
  const wrap=document.createElement('div');wrap.className='field-block';
  const label=document.createElement('label');label.textContent='Tipo de atividade';
  const select=document.createElement('select');select.className='field-input';
  [['exercise','Musculação'],['mobility','Mobilidade / aquecimento'],['cardio','Cardio']].forEach(([v,title])=>select.add(new Option(title,v)));
  select.value=exerciseCategory(ex);ex.category=select.value;
  select.addEventListener('change',()=>{ex.category=select.value;onChange();paintPlanPreview();});
  wrap.append(label,select);parent.appendChild(wrap);
}
function paintPlans(){
  const root=$('daysList');root.replaceChildren();
  plan.days.forEach((day,di)=>{
    if(!Array.isArray(day.exercises))day.exercises=[];
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
    if(day.exercises?.length){const hint=document.createElement('p');hint.className='exercise-list-hint';hint.textContent='↑ ↓ muda a ordem · ⧉ duplica · × remove';exercises.appendChild(hint);}
    (day.exercises||[]).forEach((ex,ei)=>{
      const item=document.createElement('div');item.className='exercise-editor-item';
      const details=document.createElement('details');details.className='exercise';
      const summary=document.createElement('summary');summary.className='exercise-summary';
      const thumb=document.createElement('span');thumb.className='exercise-summary-thumb';
      const summaryCopy=document.createElement('span');summaryCopy.className='exercise-summary-copy';
      const summaryName=document.createElement('strong'),summaryMeta=document.createElement('small');
      summaryCopy.append(summaryName,summaryMeta);
      const badge=document.createElement('span');badge.className='exercise-media-badge';
      summary.append(thumb,summaryCopy,badge);
      function paintSummary(){
        const clip=(window.MeuTreinoVideos?.clips||{})[ex.videoId||ex.id]||{},poster=mediaAssetUrl(clip.poster);
        thumb.replaceChildren();
        if(poster){const image=document.createElement('img');image.src=poster;image.alt='';image.loading='lazy';thumb.appendChild(image);}
        else{thumb.textContent=ex.category==='mobility'?'↗':ex.category==='cardio'?'◌':'✳';}
        summaryName.textContent=(ei+1)+'. '+(ex.name||'Novo exercício');
        const category=ex.category==='mobility'?'Mobilidade':ex.category==='cardio'?'Cardio':'Musculação';
        summaryMeta.textContent=[category,ex.dose||'Séries não definidas',ex.rest&&'Pausa '+ex.rest].filter(Boolean).join(' · ');
        const hasVideo=!!videoAssetUrl(clip.url);badge.textContent=hasVideo?'▶ Vídeo':poster?'Imagem':'Sem mídia';
        badge.classList.toggle('has-media',hasVideo||!!poster);
      }
      details.appendChild(summary);
      const body=document.createElement('div');body.className='exercise-fields';
      field(body,'Exercício',ex.name,v=>{ex.name=v;paintSummary();},{full:true,max:130});
      field(body,'Séries / repetições',ex.dose,v=>{ex.dose=v;paintSummary();},{max:100});
      field(body,'Descanso',ex.rest,v=>{ex.rest=v;paintSummary();},{max:70});
      categorySelector(body,ex,paintSummary);
      field(body,'Grupo muscular (opcional)',ex.muscle||'',v=>ex.muscle=v,{max:170});
      field(body,'Alternativa (opcional)',ex.hotel||'',v=>ex.hotel=v,{full:true,max:350});
      field(body,'Instruções',ex.description,v=>ex.description=v,{full:true,multi:true,max:2000});
      field(body,'Aviso / cuidado (opcional)',ex.cue||'',v=>ex.cue=v,{full:true,multi:true,max:450});
      mediaSelector(body,ex,paintSummary);
      details.appendChild(body);paintSummary();
      const actions=document.createElement('div');actions.className='exercise-card-actions';
      function action(icon,label,cls,onClick,disabled=false){const b=button(icon,cls+' exercise-icon-button',onClick);b.title=label;b.setAttribute('aria-label',label);b.disabled=disabled;return b;}
      actions.append(
        action('↑','Mover para cima','secondary mini',()=>{const moved=day.exercises.splice(ei,1)[0];day.exercises.splice(ei-1,0,moved);paintPlans();},ei===0),
        action('↓','Mover para baixo','secondary mini',()=>{const moved=day.exercises.splice(ei,1)[0];day.exercises.splice(ei+1,0,moved);paintPlans();},ei===day.exercises.length-1),
        action('⧉','Duplicar exercício','secondary mini',()=>{if(day.exercises.length>=40){say('Limite de 40 exercícios por treino.',true);return;}const duplicate={...copy(ex),id:newId(),name:((ex.name||'Exercício')+' (cópia)').slice(0,130)};day.exercises.splice(ei+1,0,duplicate);previewDayId=day.id;previewExerciseId=duplicate.id;paintPlans();}),
        action('×','Excluir exercício','danger mini',()=>{if(confirm('Excluir '+ex.name+'?')){day.exercises.splice(ei,1);paintPlans();}})
      );
      item.append(details,actions);exercises.appendChild(item);
    });
    card.appendChild(exercises);
    const addActions=document.createElement('div');addActions.className='day-exercise-add-actions';
    addActions.appendChild(button('+ Exercício personalizado','secondary mini',()=>{
      if(day.exercises.length>=40){say('Limite de 40 exercícios por treino.',true);return;}
      day.exercises.push(addExercise());paintPlans();
    }));
    addActions.appendChild(button('Escolher do acervo com imagens','secondary mini',()=>{
      catalogTargetDayId=day.id;$('exercisePickerSearch').value='';paintExercisePicker();$('exercisePickerDialog').showModal();$('exercisePickerSearch').focus();
    }));
    card.appendChild(addActions);
    root.appendChild(card);
  });
  if(!plan.days.length){const p=document.createElement('p');p.className='muted';p.textContent='Nenhum treino cadastrado. Clique em Novo treino ou Usar plano-base.';root.appendChild(p);}
  paintPlanPreview();
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
  const recipient=selected;
  if(!recipient||!recipient.auth_user_id||recipient.approval_status==='approved')return;
  if(!confirm('Aprovar o acesso de '+recipient.full_name+' às próprias medidas e treinos?'))return;
  try{
    // Atribui o plano-base a quem ainda não tem um plano, sem apagar planos pessoais.
    const existing=check(await db.from('client_plans').select('client_id').eq('client_id',recipient.id).maybeSingle());
    let initialPlan=false;
    if(!existing&&Array.isArray(template?.days)&&template.days.length){
      check(await db.from('client_plans').insert({client_id:recipient.id,plan:copy(template)}));
      initialPlan=true;
    }
    const updated=check(await db.from('clients')
      .update({approval_status:'approved',approved_at:new Date().toISOString()})
      .eq('id',recipient.id)
      .eq('approval_status','pending')
      .not('auth_user_id','is',null)
      .select('id').maybeSingle());
    if(!updated)throw Error('A aprovação não foi aplicada. Atualize a lista.');
    await loadClients();
    if(selected?.id===recipient.id)await chooseClient(recipient.id);
    say('Aluno aprovado! '+(initialPlan?'Os treinos A, B, C e D foram adicionados. ':'')+'Ele já pode acessar o site principal.');
  }catch(e){fail(e);}
});
$('deleteClient').addEventListener('click',async()=>{
  const recipient=selected;
  if(!recipient||!confirm('Excluir definitivamente '+recipient.full_name+' e todas as suas medições e treinos?'))return;
  try{
    check(await db.from('clients').delete().eq('id',recipient.id));
    if(selected?.id===recipient.id)clearClient();
    await loadClients();say('Cliente excluído.');
  }catch(e){fail(e);}
});
$('saveMeasures').addEventListener('submit',async e=>{
  e.preventDefault();
  const recipient=selected,snapshot=selected?copy(measure):null;
  if(!recipient||!snapshot)return;
  const submit=e.currentTarget.querySelector('[type="submit"]');
  submit.disabled=true;submit.textContent='Salvando…';
  try{
    const values={};
    for(const [id,label,unit] of defs){const v=String(snapshot.values[id]??'').trim();
      const valid=unit==='anos'?/^\d{1,3}$/.test(v):/^\d{1,3}(?:[.,]\d{1,2})?$/.test(v);
      if(v&&!valid)throw Error('Valor inválido: '+label);
      const limit=unit==='anos'?120:unit==='kg'?400:300;
      if(v){const num=Number(v.replace(',','.'));if(num<=0||num>limit)throw Error('Verifique '+label);values[id]=num;}
    }
    check(await db.from('client_measurements').upsert({client_id:recipient.id,measurement_date:snapshot.date||null,values_cm:values,updated_at:new Date().toISOString()}));
    say('Medidas salvas para '+recipient.full_name+'. O portal atualiza automaticamente em até 15 segundos.');
  }catch(err){fail(err);}
  finally{submit.disabled=false;submit.textContent='Salvar medidas do aluno';}
});
$('addDay').addEventListener('click',()=>{if(plan.days.length>=15){say('Limite de 15 treinos.',true);return;}plan.days.push(addDay());paintPlans();});
$('useTemplate').addEventListener('click',()=>{
  if(!template.days?.length){say('Plano-base não disponível.',true);return;}
  if(confirm('Substituir o rascunho atual pelo plano-base?')){plan=copy(template);paintPlans();}
});
$('closeExercisePicker').addEventListener('click',()=>$('exercisePickerDialog').close());
$('exercisePickerSearch').addEventListener('input',paintExercisePicker);
$('previewDaySelect').addEventListener('change',()=>{previewDayId=$('previewDaySelect').value;previewExerciseId='';previewMediaKey='';paintPlanPreview();});
$('savePlan').addEventListener('click',async()=>{
  if(!selected)return;
  const recipient=selected,snapshot=copy(plan),button=$('savePlan');
  button.disabled=true;button.textContent='Enviando…';
  try{
    validatePlan();
    check(await db.from('client_plans').upsert({client_id:recipient.id,plan:snapshot,updated_at:new Date().toISOString()}));
    say('Ficha enviada para '+recipient.full_name+'. O portal atualiza automaticamente em até 15 segundos.');
  }catch(err){fail(err);}
  finally{button.disabled=false;button.textContent='Salvar e enviar ao aluno';}
});
$('saveAllPlans').addEventListener('click',async()=>{
  if(!selected)return;try{
    const snapshot=copy(plan);
    validatePlan();if(!clients.length)throw Error('Nenhum cliente cadastrado.');
    if(!confirm('Substituir os treinos de TODOS os '+clients.length+' clientes? As medidas serão preservadas.'))return;
    if(prompt('Para confirmar, digite TODOS:')!=='TODOS')return;
    const count=check(await db.rpc('admin_apply_plan_to_all',{new_plan:snapshot}));
    say('Planos atualizados para '+count+' clientes, sem alterar as medições.');
  }catch(e){fail(e);}
});
$('noticeForm').addEventListener('submit',async e=>{
  e.preventDefault();try{check(await db.from('site_announcements').upsert({id:1,enabled:$('noticeOn').checked,title:$('noticeTitle').value.trim(),message:$('noticeBody').value.trim(),updated_at:new Date().toISOString()}));say('Comunicado geral salvo.');}catch(err){fail(err);}
});
init();
})();
