(function(){
  'use strict';
  var REPO='lohanrosha02-gif/treino-v2';
  var PATH='data/site-content.json';
  var BASE='https://api.github.com/repos/'+REPO+'/contents/'+PATH;
  var token='',documentData=null,baseline=null,blobSha='',activeTab='site',activeDay='A',busy=false,dirty=false;
  var el=function(id){return document.getElementById(id);};
  var feedback=el('feedback');
  function tell(message,type){feedback.textContent=message;feedback.className='feedback'+(type?' '+type:'');}
  function setBusy(value){
    busy=value;
    el('connectButton').disabled=value;
    el('publishButton').disabled=value||!dirty;
    el('reloadButton').disabled=value;
    el('disconnectButton').disabled=value;
  }
  function changed(){
    dirty=JSON.stringify(documentData)!==baseline;
    el('saveState').textContent=dirty?'Alterações não publicadas.':'Conteúdo sincronizado com o GitHub.';
    el('publishButton').disabled=busy||!dirty;
  }
  function decode(value){
    var binary=atob(value.replace(/\s/g,'')),bytes=new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function encode(value){
    var bytes=new TextEncoder().encode(value),binary='';
    for(var i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode.apply(null,bytes.subarray(i,i+8192));
    return btoa(binary);
  }
  async function api(method,payload){
    var response=await fetch(BASE+(method==='GET'?'?ref=main':''),{
      method:method,
      headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},
      cache:'no-store',
      body:payload?JSON.stringify(payload):undefined
    });
    var body=await response.json().catch(function(){return {};});
    if(!response.ok){
      if(response.status===401)throw Error('Token inválido ou expirado.');
      if(response.status===403)throw Error('Acesso negado. Confira as permissões Contents: Read and write somente para treino-v2.');
      if(response.status===404)throw Error('Arquivo não encontrado ou sem acesso a treino-v2.');
      if(response.status===409||response.status===422)throw Error('O arquivo mudou no GitHub. Recarregue para evitar sobrescrever alterações de outra pessoa.');
      throw Error('GitHub retornou erro '+response.status+'. '+(body.message||''));
    }
    return body;
  }
  function validate(input){
    if(!input||input.schemaVersion!==1||!input.site||!input.plans)throw Error('Conteúdo inesperado; publicação cancelada.');
    ['A','B','C','D'].forEach(function(day){
      var p=input.plans[day];
      if(!p||!Array.isArray(p.mobility)||!Array.isArray(p.exercises)||!p.cardio)throw Error('Ficha '+day+' incompleta.');
      ['mobility','exercises'].forEach(function(group){
        if(p[group].some(function(item){return !item.id||!Array.isArray(item.steps)||!item.steps.length||item.steps.length>12||item.steps.some(function(s){return typeof s!=='string'||s.length>650;});}))throw Error('Passos inválidos no treino '+day+'.');
      });
    });
    var all=(function collect(obj){
      if(Array.isArray(obj))return obj.flatMap(collect);
      if(obj&&typeof obj==='object')return Object.values(obj).flatMap(collect);
      return typeof obj==='string'?[obj]:[];
    })(input);
    if(all.some(function(s){return s.length>1100;}))throw Error('Um dos textos excede o tamanho permitido.');
    if(JSON.stringify(input).length>300000)throw Error('Conteúdo muito grande para publicar.');
  }
  async function load(){
    setBusy(true);
    tell('Lendo o conteúdo atualizado do GitHub…');
    try{
      var response=await api('GET');
      var next=JSON.parse(decode(response.content));
      validate(next);
      blobSha=response.sha;
      documentData=next;
      baseline=JSON.stringify(next);
      changed();
      render();
      el('editor').hidden=false;
      el('disconnectButton').hidden=false;
      el('connectionStatus').textContent='Conectado';
      el('connectionStatus').classList.add('connected');
      el('githubToken').value='';
      tell('Conteúdo carregado. Edite os campos e clique em “Publicar para todos” quando terminar.','success');
    }catch(error){
      tell('Não foi possível carregar: '+error.message,'error');
      if(!documentData)el('editor').hidden=true;
    }finally{setBusy(false);}
  }
  function field(parent,label,target,key,opts){
    opts=opts||{};
    var wrapper=document.createElement('div');wrapper.className='field'+(opts.wide?' wide':'');
    var ident='field-'+Math.random().toString(36).slice(2);
    var labelEl=document.createElement('label');labelEl.className='field-label';labelEl.setAttribute('for',ident);labelEl.textContent=label;
    var input=document.createElement(opts.multiline?'textarea':'input');
    input.id=ident;input.className=opts.multiline?'field-area':'field-input';input.maxLength=opts.maxLength||650;
    if(opts.multiline){input.rows=opts.rows||3;input.value=Array.isArray(target[key])?target[key].join('\n'):(target[key]||'');}
    else {input.type='text';input.value=target[key]||'';}
    input.addEventListener('input',function(){
      if(opts.lines)target[key]=input.value.split(/\r?\n/).map(function(s){return s.trim();}).filter(Boolean).slice(0,12);
      else target[key]=input.value;
      changed();
      if(opts.onChange)opts.onChange();
    });
    wrapper.append(labelEl,input);
    if(opts.hint){var hint=document.createElement('small');hint.className='field-hint';hint.textContent=opts.hint;wrapper.appendChild(hint);}
    parent.appendChild(wrapper);
    return input;
  }
  function grid(parent){var block=document.createElement('div');block.className='form-grid';parent.appendChild(block);return block;}
  function panel(title,desc){
    var section=document.createElement('section');section.className='panel';
    var heading=document.createElement('h2');heading.textContent=title;section.appendChild(heading);
    if(desc){var p=document.createElement('p');p.className='section-intro';p.textContent=desc;section.appendChild(p);}
    el('editorFields').appendChild(section);return section;
  }
  function note(parent,msg){var p=document.createElement('p');p.className='message-note';p.textContent=msg;parent.appendChild(p);}
  function siteFields(){
    var section=panel('Mensagens do site','Esses textos aparecem para todas as pessoas que abrirem o site principal após a publicação.');
    var g=grid(section),site=documentData.site;
    field(g,'Identificação da página',site,'eyebrow',{maxLength:80});
    field(g,'Rodapé',site,'footer',{maxLength:120});
    field(g,'Título da avaliação inicial',site,'evaluationTitle');
    field(g,'Título da área de treinos',site,'trainingTitle');
    field(g,'Descrição da avaliação inicial',site,'evaluationLead',{wide:true,multiline:true,rows:2});
    field(g,'Descrição da área de treinos',site,'trainingLead',{wide:true,multiline:true,rows:2});
    section=panel('Aviso para todos','Use este espaço para comunicados importantes, mudanças de calendário e orientações gerais.');
    var notice=site.announcement;
    var label=document.createElement('label');label.className='switch-field';
    var checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=notice.enabled===true;
    checkbox.addEventListener('change',function(){notice.enabled=checkbox.checked;changed();});
    label.append(checkbox,document.createTextNode('Exibir aviso no topo do site'));
    section.appendChild(label);
    g=grid(section);
    field(g,'Título do aviso',notice,'title',{wide:true,maxLength:120});
    field(g,'Mensagem do aviso',notice,'message',{wide:true,multiline:true,rows:5,maxLength:1000,hint:'Não inclua informações pessoais ou dados de alunos.'});
  }
  function activity(parent,item,index,kind){
    var details=document.createElement('details');details.className='activity';
    var summary=document.createElement('summary');summary.textContent=(index+1)+'. '+item.name;
    details.appendChild(summary);
    var inner=document.createElement('div');inner.className='activity-inner';
    var g=grid(inner);
    field(g,'Nome',item,'name',{wide:true,onChange:function(){summary.textContent=(index+1)+'. '+item.name;}});
    field(g,'Dose / séries',item,'dose',{hint:'Mudanças em número de séries podem afetar registros já preenchidos.'});
    if(kind==='exercises'){
      field(g,'Intervalo de descanso',item,'rest');
      field(g,'Grupos musculares',item,'muscle',{wide:true});
      field(g,'Alternativa no hotel',item,'hotel',{wide:true,multiline:true,rows:2});
    }
    if(Object.prototype.hasOwnProperty.call(item,'cue'))field(g,'Orientação adicional',item,'cue',{wide:true,multiline:true,rows:2});
    field(g,'Passo a passo (um por linha)',item,'steps',{wide:true,multiline:true,rows:5,lines:true,maxLength:7000,hint:'Até 12 passos, cada um com no máximo 650 caracteres.'});
    details.appendChild(inner);parent.appendChild(details);
  }
  function plansFields(){
    var p=panel('Editar fichas de treino','Selecione a sessão e ajuste orientações, repetições, descansos e textos. Os exercícios existentes, seus IDs e vídeos permanecem vinculados ao site.');
    note(p,'Atenção: alterar doses ou repetições pode mudar a contagem de séries dos alunos. Revise as prescrições com cuidado antes de publicar.');
    var picker=document.createElement('div');picker.className='day-picker';
    ['A','B','C','D'].forEach(function(d){
      var btn=document.createElement('button');btn.type='button';btn.className='day-tab'+(d===activeDay?' active':'');btn.textContent='Treino '+d;
      btn.addEventListener('click',function(){activeDay=d;render();});
      picker.appendChild(btn);
    });p.appendChild(picker);
    var day=documentData.plans[activeDay],g=grid(p);
    field(g,'Título da sessão',day,'title',{wide:true});
    field(g,'Resumo da sessão',day,'subtitle',{wide:true,multiline:true,rows:2});
    field(g,'Dia da semana',day,'interval');
    field(g,'Duração prevista',day,'duration');
    field(g,'Recuperação',day,'recover',{wide:true});
    p=panel('Mobilidade · '+activeDay,'Instruções exibidas antes dos exercícios.');
    day.mobility.forEach(function(item,i){activity(p,item,i,'mobility');});
    p=panel('Exercícios · '+activeDay,'Preserve o vínculo entre prescrição e demonstração existente.');
    day.exercises.forEach(function(item,i){activity(p,item,i,'exercises');});
    p=panel('Cardio · '+activeDay,'Orientações da atividade final.');
    g=grid(p);
    field(g,'Nome do cardio',day.cardio,'name',{wide:true});
    field(g,'Dose / duração',day.cardio,'dose',{wide:true});
    field(g,'Orientações',day.cardio,'suggestion',{wide:true,multiline:true,rows:4});
  }
  function render(){
    if(!documentData)return;
    var mount=el('editorFields');mount.replaceChildren();
    document.querySelectorAll('[data-tab]').forEach(function(btn){
      var on=btn.dataset.tab===activeTab;
      btn.classList.toggle('active',on);btn.setAttribute('aria-selected',String(on));
    });
    if(activeTab==='site')siteFields();else plansFields();
  }
  el('authForm').addEventListener('submit',function(event){
    event.preventDefault();if(busy)return;
    var value=el('githubToken').value.trim();
    if(!value){tell('Informe um token válido para conectar.','error');return;}
    if(dirty&&!confirm('Há mudanças não publicadas. Substituir o conteúdo local?'))return;
    token=value;load();
  });
  el('disconnectButton').addEventListener('click',function(){
    if(dirty&&!confirm('Descartar alterações não publicadas e desconectar?'))return;
    token='';documentData=null;baseline=null;blobSha='';dirty=false;
    el('editor').hidden=true;el('disconnectButton').hidden=true;el('connectionStatus').textContent='Não conectado';
    el('connectionStatus').classList.remove('connected');el('githubToken').value='';
    tell('Desconectado. Nenhuma credencial foi salva.');
  });
  el('reloadButton').addEventListener('click',function(){
    if(dirty&&!confirm('Descartar as edições e carregar a última versão publicada?'))return;
    load();
  });
  document.querySelectorAll('[data-tab]').forEach(function(btn){
    btn.addEventListener('click',function(){activeTab=btn.dataset.tab;render();});
  });
  el('publishButton').addEventListener('click',async function(){
    if(busy||!token||!dirty)return;
    var before=JSON.parse(baseline);
    try{validate(documentData);}catch(err){tell(err.message,'error');return;}
    var dosesChanged=['A','B','C','D'].some(function(day){
      var prev=before.plans[day],now=documentData.plans[day];
      return ['mobility','exercises'].some(function(group){return now[group].some(function(item,index){return item.dose!==prev[group][index].dose;});})||now.cardio.dose!==prev.cardio.dose;
    });
    var warning=dosesChanged?'\n\nAtenção: você modificou doses/séries e isso pode alterar o acompanhamento de registros existentes.':'';
    if(!confirm('Publicar essas alterações para todos os usuários do treino-v2?'+warning))return;
    setBusy(true);tell('Publicando alterações em treino-v2…');
    try{
      var data=JSON.parse(JSON.stringify(documentData));
      data.updatedAt=new Date().toISOString();
      var out=await api('PUT',{message:'admin: atualizar conteúdo público do Meu Treino',content:encode(JSON.stringify(data,null,2)+'\n'),sha:blobSha,branch:'main'});
      documentData=data;blobSha=out.content.sha;baseline=JSON.stringify(data);changed();
      tell('Publicado no GitHub com sucesso! O site dos alunos receberá o conteúdo após a atualização do GitHub Pages e quando a página for recarregada.','success');
    }catch(error){tell('Não foi possível publicar: '+error.message,'error');}
    finally{setBusy(false);}
  });
  window.addEventListener('beforeunload',function(event){if(dirty){event.preventDefault();event.returnValue='';}});
})();
