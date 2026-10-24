(function(){
  'use strict';
  var bridge=window.MeuTreinoBridge;
  var mount=document.getElementById('trainingMount');
  if(!bridge||!mount)return;
  var dayChoice='A';
  var plans={
    A:{
      title:'Peito + costas + braços',
      subtitle:'Força e hipertrofia com exercícios de empurrar e puxar.',
      duration:'60–70 min',interval:'Segunda-feira',recover:'72 h até o próximo superior',
      mobility:[
        {id:'mA1',name:'Aquecimento dos ombros com elástico',dose:'1 × 8 movimentos suaves',kind:'mobility',steps:['Segure o elástico com as mãos mais afastadas que os ombros.','Eleve lentamente os braços à frente e acima da cabeça, sem dor.','Se houver mobilidade confortável, leve a faixa para trás da cabeça; depois retorne. Nunca force a amplitude.']},
        {id:'mA2',name:'Rotação torácica sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Sente-se com os pés apoiados e cruze os braços no peito.','Gire suavemente a parte superior do tronco, mantendo a pelve estável.','Retorne ao centro e alterne os lados sem forçar a lombar.']},
        {id:'mA3',name:'Deslizamento dos braços na parede',dose:'1 × 8–10',kind:'raise',steps:['Fique de frente para uma parede com antebraços apoiados.','Deslize-os para cima até onde os ombros permitirem confortavelmente.','Desça devagar, evitando arquear a lombar.']}
      ],
      exercises:[
        {id:'a1',name:'Chest press reto na máquina (deitado)',dose:'3 × 8–12',rest:'90–120 s',muscle:'Peito · tríceps · deltoide anterior',kind:'press',hotel:'Supino reto com halteres em banco estável, se disponível.',steps:['Deite-se no banco da máquina com pés firmes no apoio ou no chão e segure as alças à altura do peito.','Empurre as alças para cima e à frente, sem travar os cotovelos.','Retorne devagar à posição inicial sem tirar as costas do apoio.'],cue:'Use a máquina de supino reto deitado mostrada no vídeo. Se a academia tiver apenas chest press sentado, ajuste a prescrição e a demonstração; não use o vídeo como modelo de máquina diferente.'},
        {id:'a2',name:'Remada com apoio peitoral',dose:'3 × 8–12',rest:'90–120 s',muscle:'Costas · bíceps',kind:'row',hotel:'Remada unilateral com halter e mão apoiada no banco.',steps:['Ajuste o apoio de peito e mantenha a coluna estável.','Puxe os cotovelos para trás sem levantar o tronco.','Retorne até estender os braços de modo confortável.'],cue:'Alterne com o chest press somente se a técnica não piorar.'},
        {id:'a3',name:'Supino inclinado na máquina',dose:'2 × 10–12',rest:'75–90 s',muscle:'Peito superior · tríceps',kind:'press',hotel:'Supino inclinado com halteres, com banco estável.',steps:['Ajuste o banco e mantenha as costas apoiadas.','Empurre as alças para cima e à frente em trajetória confortável.','Volte devagar, sem forçar os ombros.']},
        {id:'a4',name:'Puxada frontal na polia',dose:'3 × 10–12',rest:'75–90 s',muscle:'Dorsais · bíceps',kind:'pull',hotel:'Polia alta do hotel, se disponível; caso contrário, registrar não realizado.',steps:['Segure a barra com pegada confortável e peito aberto.','Puxe a barra em direção à parte superior do peito.','Retorne devagar, sem jogar o tronco para trás.'],cue:'Não puxar atrás da nuca.'},
        {id:'a5',name:'Elevação lateral sentada',dose:'2 × 12–15',rest:'60 s',muscle:'Deltoide lateral',kind:'raise',hotel:'Halteres leves, sentado.',steps:['Sente-se com tronco apoiado e braços ao lado do corpo.','Eleve os braços para os lados até uma amplitude confortável.','Desça devagar, sem balançar.']},
        {id:'a6',name:'Tríceps na polia com corda',dose:'2 × 10–15',rest:'60 s',muscle:'Tríceps',kind:'press',hotel:'Extensão de tríceps com halter leve apoiado, se houver segurança.',steps:['Mantenha os cotovelos próximos ao tronco.','Estenda os cotovelos para empurrar a corda para baixo.','Retorne controladamente sem abrir os cotovelos.']},
        {id:'a7',name:'Rosca bíceps sentada',dose:'2 × 10–15',rest:'60 s',muscle:'Bíceps',kind:'curl',hotel:'Rosca sentada com halteres.',steps:['Sente-se com a coluna apoiada e braços ao lado do corpo.','Flexione os cotovelos sem impulsionar com o tronco.','Desça lentamente, mantendo os punhos neutros.']}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'5–8 min · leve',suggestion:'Ajuste o selim e pedale com resistência leve, somente se os joelhos tolerarem. Pare se houver dor crescente.',kind:'cardio'}
    },
    B:{
      title:'Inferiores adaptados + cardio',
      subtitle:'Quadril e pernas com baixa exigência dos joelhos.',
      duration:'45–60 min',interval:'Terça-feira',recover:'Até sábado para a próxima sessão de inferiores',
      mobility:[
        {id:'mB1',name:'Flexão e extensão dos tornozelos sentado',dose:'1 × 12–15 por lado',kind:'ankle',steps:['Sente-se com as pernas em posição confortável.','Aponte os dedos dos pés para a frente e depois leve-os para cima.','Repita sem forçar os joelhos.']},
        {id:'mB2',name:'Movimento leve do quadril sentado',dose:'1 × 8 por lado',kind:'hip',steps:['Sente-se com os pés apoiados e quadril confortável.','Afaste levemente um joelho e volte, sem rotação forçada.','Use amplitude pequena e suspenda se o joelho doer.']},
        {id:'mB3',name:'Extensão torácica sentado',dose:'1 × 8',kind:'rotate',steps:['Sente-se com os pés apoiados e braços cruzados.','Abra suavemente o peito, movendo principalmente a parte alta das costas.','Retorne à postura neutra, sem hiperestender a lombar.']}
      ],
      exercises:[
        {id:'b1',name:'Abdução de quadril na máquina',dose:'2 × 12–15',rest:'60–90 s',muscle:'Glúteo médio · estabilizadores do quadril',kind:'hip',hotel:'Abdução sentada com miniband, somente se houver e for confortável.',steps:['Ajuste o banco e apoie as costas sem forçar os joelhos.','Afaste as pernas lentamente em amplitude indolor.','Retorne devagar, sem deixar o peso bater.'],cue:'Não utilizar a máquina se a posição sentada ou o apoio nos joelhos causar dor.',caution:true},
        {id:'b2',name:'Extensão de quadril na polia com apoio',dose:'2 × 10–12 por lado',rest:'60–90 s',muscle:'Glúteo máximo',kind:'hip',hotel:'Extensão de quadril sem carga em apoio firme, apenas se indolor.',steps:['Segure um apoio estável, mantendo o joelho em posição confortável.','Leve uma perna discretamente para trás sem arquear a lombar.','Retorne devagar; evite compensar com a perna de apoio.'],caution:true},
        {id:'b3',name:'Panturrilha sentado com pouca carga',dose:'2 × 12–15',rest:'60 s',muscle:'Sóleo · panturrilhas',kind:'ankle',hotel:'Elevação de calcanhar sentado em cadeira firme, sem carga.',steps:['Sente-se, mantendo os pés apoiados no chão.','Eleve suavemente os calcanhares sem tirar as pontas dos pés do chão.','Desça controladamente, sem provocar dor no joelho.'],cue:'Preferir sem carga até confirmar conforto na posição.',caution:true},
        {id:'b4',name:'Contração de glúteos sentado',dose:'2 × 10 · sustentar 4 s',rest:'45–60 s',muscle:'Glúteos · isometria',kind:'isometric',hotel:'Mesmo exercício sentado em cadeira estável.',steps:['Sente-se com os pés apoiados e respiração natural.','Contraia suavemente os glúteos sem mover o tronco.','Mantenha por quatro segundos e relaxe sem prender o ar.']},
        {id:'b5',name:'Isometria suave de quadríceps',dose:'2 × 8 · sustentar 3–5 s',rest:'45–60 s',muscle:'Quadríceps · ativação leve',kind:'isometric',hotel:'Mesmo exercício com perna em posição apoiada e confortável.',steps:['Sente-se ou deite em posição confortável e mantenha a perna apoiada.','Contraia levemente a parte da frente da coxa sem forçar a extensão do joelho.','Relaxe após três a cinco segundos; não tente destravar a articulação.'],cue:'Se houver dor, travamento ou dificuldade relevante de amplitude, não realizar.',caution:true},
        {id:'b6',name:'Adução de quadril na máquina (opcional)',dose:'2 × 12 · só se confortável',rest:'60–90 s',muscle:'Adutores do quadril',kind:'hip',hotel:'Sem substituição obrigatória: registrar não realizado se faltar equipamento.',steps:['Ajuste a posição do banco para não forçar joelhos nem quadril.','Aproxime as coxas suavemente, em amplitude curta.','Retorne lentamente e interrompa se houver desconforto articular.'],cue:'Opcional. Se a máquina exigir flexão desconfortável dos joelhos, não executar.',caution:true}
      ],
      optional:[
        {name:'Leg press com amplitude adaptada',note:'Somente após avaliação funcional e liberação para carga; definir amplitude e carga individualmente.'},
        {name:'Cadeira flexora e extensora',note:'Somente após esclarecimento da dor e limitação dos joelhos e definição profissional de amplitude, carga e progressão.'}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'8–12 min · leve',suggestion:'Prefira bicicleta reclinada se mais confortável. Ajuste o banco e não force os joelhos. Pare se houver dor ou bloqueio.',kind:'cardio'}
    },
    C:{
      title:'Costas + peito + braços',
      subtitle:'Segundo estímulo para peito e costas.',
      duration:'60–70 min',interval:'Quinta-feira',recover:'~72 h depois do treino A',
      mobility:[
        {id:'mC1',name:'Rotação torácica sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Sente-se e cruze os braços em frente ao peito.','Gire o tronco lentamente para um lado sem deslocar o quadril.','Retorne ao centro e repita para o outro lado.']},
        {id:'mC2',name:'Wall slides (braços na parede)',dose:'1 × 8–10',kind:'raise',steps:['Apoie os antebraços em uma parede.','Deslize para cima até uma amplitude livre de dor.','Retorne lentamente sem compensar na lombar.']},
        {id:'mC3',name:'Mobilidade escapular sentado',dose:'1 × 8–10',kind:'row',steps:['Sente-se ereto com os pés apoiados.','Eleve os braços de forma confortável, sem forçar os ombros.','Abaixe suavemente os ombros, aproxime as escápulas e relaxe.']}
      ],
      exercises:[
        {id:'c1',name:'Supino inclinado na máquina',dose:'3 × 8–12',rest:'90–120 s',muscle:'Peito · tríceps',kind:'press',hotel:'Supino inclinado com halteres e banco estável.',steps:['Ajuste o encosto para apoiar completamente as costas.','Empurre as alças na direção indicada pela máquina.','Retorne com controle sem descer além do conforto.']},
        {id:'c2',name:'Remada sentada com apoio',dose:'3 × 8–12',rest:'90–120 s',muscle:'Costas · bíceps',kind:'row',hotel:'Remada apoiada unilateral com halter.',steps:['Sente-se com peito apoiado ou tronco estabilizado.','Puxe as alças sem inclinar o corpo para trás.','Estenda os braços devagar e repita.']},
        {id:'c3',name:'Crucifixo no peck deck',dose:'2 × 12–15',rest:'60–90 s',muscle:'Peitoral',kind:'fly',hotel:'Crucifixo com halteres leves e amplitude curta, se orientado.',steps:['Ajuste o banco na altura adequada dos ombros.','Aproxime as alças à frente do peito em movimento controlado.','Abra os braços até uma amplitude confortável.']},
        {id:'c4',name:'Puxada alta na polia',dose:'2 × 10–12',rest:'75–90 s',muscle:'Dorsais · bíceps',kind:'pull',hotel:'Polia alta, se disponível.',steps:['Segure a barra com pegada confortável.','Puxe para a parte superior do peito, sem inclinar excessivamente o tronco.','Devolva a barra de forma lenta.']},
        {id:'c5',name:'Remada para deltoide posterior na polia',dose:'2 × 12–15',rest:'60 s',muscle:'Deltoide posterior · escápulas',kind:'row',hotel:'Remada para deltoide posterior com elástico, se tiver bom controle.',steps:['Prenda a corda numa polia baixa e afaste-se até criar uma leve tensão.','Incline discretamente o tronco com costas alinhadas e puxe a corda em direção ao peito alto, abrindo os cotovelos.','Retorne lentamente, sem arredondar as costas.']},
        {id:'c6',name:'Rosca bíceps unilateral na polia',dose:'2 × 10–15 por braço',rest:'60 s',muscle:'Bíceps',kind:'curl',hotel:'Rosca unilateral com halter, se a polia não estiver disponível.',steps:['Ajuste a polia baixa e fique em pé de frente para ela, segurando um pegador com a palma voltada para cima.','Mantenha o cotovelo próximo ao tronco e flexione lentamente em direção ao ombro.','Retorne com controle, complete as séries e repita no outro braço.']},
        {id:'c7',name:'Tríceps na polia com corda',dose:'2 × 10–15',rest:'60 s',muscle:'Tríceps',kind:'press',hotel:'Extensão de tríceps com halter leve e apoio adequado.',steps:['Mantenha os cotovelos ao lado do tronco.','Estenda os cotovelos para abaixar a corda.','Retorne lentamente sem movimentar os ombros.']}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'5–8 min · leve',suggestion:'Selim ajustado e pedalada suave. Use apenas se não agravar o joelho.',kind:'cardio'}
    },
    D:{
      title:'Quadril + mobilidade + cardio',
      subtitle:'Mobilidade, pernas adaptadas e cardio leve.',
      duration:'45–60 min',interval:'Sábado',recover:'~96 h depois do treino B',
      mobility:[
        {id:'mD1',name:'Círculos de tornozelo sentado',dose:'1 × 10 por sentido e lado',kind:'ankle',steps:['Sente-se e mantenha a perna relaxada.','Desenhe círculos pequenos com o pé, sem girar o joelho.','Inverta a direção e repita do outro lado.']},
        {id:'mD2',name:'Rotação do tronco sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Com os pés apoiados, cruze os braços sobre o peito.','Gire a parte superior do tronco suavemente.','Volte ao centro e alterne.']},
        {id:'mD3',name:'Aquecimento dos ombros com elástico',dose:'1 × 8 movimentos suaves',kind:'mobility',steps:['Segure o elástico com as mãos mais afastadas que os ombros.','Leve os braços lentamente para cima dentro da amplitude confortável.','Se for confortável, passe a faixa por trás da cabeça e retorne devagar, sem forçar os ombros.']}
      ],
      exercises:[
        {id:'d1',name:'Abdução de quadril na máquina, leve',dose:'2 × 12–15',rest:'60–90 s',muscle:'Glúteo médio',kind:'hip',hotel:'Abdução sentada com miniband se houver e sem dor.',steps:['Ajuste o banco e não force a flexão dos joelhos.','Afaste as pernas lentamente em pequena amplitude confortável.','Retorne com controle.'],caution:true},
        {id:'d2',name:'Extensão de quadril com apoio',dose:'2 × 10 por lado',rest:'60 s',muscle:'Glúteo máximo',kind:'hip',hotel:'Extensão de quadril sem resistência e com apoio firme.',steps:['Segure um apoio e estabilize o tronco.','Leve a perna suavemente para trás sem movimentar a lombar.','Retorne e troque de lado.'],caution:true},
        {id:'d3',name:'Panturrilha sentado, leve',dose:'2 × 12–15',rest:'60 s',muscle:'Panturrilhas',kind:'ankle',hotel:'Elevação de calcanhares sentado sem carga.',steps:['Sente-se, pés apoiados no chão.','Eleve os calcanhares mantendo as pontas dos pés no chão.','Desça devagar em amplitude indolor.'],caution:true},
        {id:'d4',name:'Contração isométrica de glúteos',dose:'2 × 10 · sustentar 4 s',rest:'45–60 s',muscle:'Glúteos',kind:'isometric',hotel:'Mesmo exercício sentado.',steps:['Sente-se em posição confortável.','Contraia levemente os glúteos, sem prender a respiração.','Relaxe e repita.']},
        {id:'d5',name:'Mobilização ativa confortável do joelho',dose:'1–2 × 6–8 por lado',rest:'45–60 s',muscle:'Controle de movimento articular',kind:'knee',hotel:'Mesmo movimento em cadeira estável, sem resistência.',steps:['Sente-se com a coxa apoiada e a perna em posição confortável.','Dobre e estique suavemente apenas até onde não houver dor.','Retorne sem forçar; pare se houver bloqueio ou estalo doloroso.'],cue:'Pode ser omitida até avaliação, sobretudo se a extensão ou a flexão estiver bloqueada.',caution:true}
      ],
      optional:[
        {name:'Leg press ou sentar-levantar de banco alto',note:'Incluir apenas após avaliação da condição articular, com amplitude e carga individualizadas.'},
        {name:'Ponte de glúteos',note:'Considerar somente após esclarecer a cirurgia abdominal, verificar posicionamento confortável dos joelhos e confirmar que não há restrições.'}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'10–15 min · leve',suggestion:'Bicicleta confortável com selim ajustado. Progrida tempo antes da carga, sem dor crescente.',kind:'cardio'}
    }
  };
  var progression=[
    {range:'Semanas 1–2',text:'Aprender a execução e usar cargas leves.'},
    {range:'Semanas 3–4',text:'Progredir repetições se estiver confortável.'},
    {range:'Semanas 5–6',text:'Progredir cargas aos poucos, com boa técnica.'},
    {range:'Semanas 7–8',text:'Reavaliar evolução, dor, cargas e cardio.'}
  ];
  function escapeHtml(value){
    return String(value===null||value===undefined?'':value).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function safeRecord(){
    var data=bridge.getData(),week=bridge.getWeek();
    if(!data.weeks[week-1]||typeof data.weeks[week-1]!=='object')data.weeks[week-1]={};
    var weekData=data.weeks[week-1];
    if(!weekData.training||typeof weekData.training!=='object'||Array.isArray(weekData.training))weekData.training={};
    if(!weekData.training[dayChoice]||typeof weekData.training[dayChoice]!=='object')weekData.training[dayChoice]={};
    var row=weekData.training[dayChoice];
    if(!row.exercises||typeof row.exercises!=='object')row.exercises={};
    return row;
  }
  function getDayRecord(day){
    var data=bridge.getData(),week=bridge.getWeek();
    var w=data.weeks[week-1]||{};
    return w.training&&w.training[day]||{};
  }
  function teachingVideo(id){
    // Reprodução automática ao abrir o exercício, sem controles e sem cliques no vídeo.
    var cfg=window.MeuTreinoVideos||{};
    var clip=cfg.clips&&cfg.clips[id];
    var source=null;
    if(clip&&clip.type==='mp4'&&typeof clip.url==='string'
      &&/^https:\/\/pub-585d42eb1aa64a67aedf483ec328d3fe\.r2\.dev\/exercise-videos\/male\/[a-z0-9-]+\.mp4$/.test(clip.url)){
      source=clip.url;
    }else if(clip&&clip.type==='local'&&typeof clip.url==='string'
      &&/^\.\/assets\/videos\/[a-z]+\.mp4$/.test(clip.url)){
      source=clip.url;
    }
    if(!source){
      return '<p class="video-unavailable">Demonstração indisponível.</p>';
    }
    var caption=escapeHtml(clip.name||'execução do exercício');
    return '<div class="teaching-video auto-loop" data-video-exercise="'+escapeHtml(id)+'" role="group" aria-label="Vídeo em loop: '+caption+'">'
      +'<video class="loop-video" autoplay muted loop playsinline webkit-playsinline preload="none" tabindex="-1" data-src="'+escapeHtml(source)+'" aria-label="Demonstração visual automática"></video>'
      +'</div>';
  }
  function autoLoopIn(details){
    if(!details||typeof details.querySelectorAll!=='function')return;
    var videos=details.querySelectorAll('video.loop-video');
    for(var i=0;i<videos.length;i++){
      var player=videos[i];
      if(details.open){
        if(!player.getAttribute('src')){
          player.setAttribute('src',player.getAttribute('data-src'));
          player.load();
        }
        player.muted=true;
        player.defaultMuted=true;
        var playing=player.play();
        if(playing&&typeof playing.catch==='function')playing.catch(function(){/* alguns navegadores limitam autoplay */});
      }else if(typeof player.pause==='function'){
        player.pause();
      }
    }
  }
  function stepsList(steps){return '<ol>'+steps.map(function(s){return '<li>'+escapeHtml(s)+'</li>';}).join('')+'</ol>';}
  function guideSteps(items){
    return '<div class="train-step-row">'+items.map(function(m,index){
      return '<details class="train-step"><summary><span class="train-step-index">'+(index+1)+'</span>'
        +'<span class="train-step-content"><strong>'+escapeHtml(m.name)+'</strong><small>'+escapeHtml(m.dose)+'</small></span></summary>'
        +'<div class="train-step-body">'+stepsList(m.steps)
        +teachingVideo(m.id)+'</div></details>';
    }).join('')+'</div>';
  }

  function setCount(exercise){
    var dose=String(exercise.dose||'');
    var found=dose.match(/^\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*[×xX]/);
    return found?Math.min(10,Number(found[2]||found[1])):1;
  }
  function exerciseIsComplete(exercise,entry){
    if(!entry||typeof entry!=='object')return false;
    if(Array.isArray(entry.series)){
      var count=setCount(exercise);
      return entry.series.length>=count&&Array.from({length:count},function(_,i){return entry.series[i]&&entry.series[i].done===true;}).every(Boolean);
    }
    return entry.done===true;
  }
  function completedSets(exercise,entry){
    if(!entry||!Array.isArray(entry.series))return 0;
    return Array.from({length:setCount(exercise)},function(_,i){return entry.series[i]&&entry.series[i].done===true;}).filter(Boolean).length;
  }
  function previousSeries(id){
    var weeks=bridge.getData().weeks||[];
    for(var number=bridge.getWeek()-2;number>=0;number--){
      var data=weeks[number]&&weeks[number].training&&weeks[number].training[dayChoice];
      var value=data&&data.exercises&&data.exercises[id];
      if(value&&Array.isArray(value.series)&&value.series.some(function(s){return s&&(s.load||s.reps||s.done);})){
        return {week:number+1,series:value.series};
      }
    }
    return null;
  }
  function seriesProgressNote(id){
    var earlier=previousSeries(id);
    if(!earlier)return '';
    var entries=earlier.series.map(function(s,i){
      if(!s||(s.load===undefined||s.load==='')&&(s.reps===undefined||s.reps===''))return '';
      var parts=[];
      if(s.load!==undefined&&s.load!=='')parts.push(String(s.load).replace('.',',')+' kg');
      if(s.reps!==undefined&&s.reps!=='')parts.push(s.reps+' rep.');
      return 'S'+(i+1)+' '+parts.join(' · ');
    }).filter(Boolean);
    return entries.length?'<p class="series-history">Semana '+earlier.week+': '+escapeHtml(entries.join('  |  '))+'</p>':'';
  }
  function seriesRows(exercise,entry){
    var count=setCount(exercise),existing=Array.isArray(entry.series)?entry.series:[];
    var rows=Array.from({length:count},function(_,i){
      var record=existing[i]&&typeof existing[i]==='object'?existing[i]:{};
      var number=i+1;
      return '<div class="series-row" data-series-row="'+number+'">'
        +'<strong class="series-number">Série '+number+'</strong>'
        +'<label class="series-input"><span>Carga (kg)</span><input type="text" inputmode="decimal" autocomplete="off" maxlength="8" id="load-'+exercise.id+'-'+number+'" data-exercise="'+exercise.id+'" data-series="'+i+'" data-exfield="load" aria-label="Carga em quilos da série '+number+'" placeholder="kg" value="'+escapeHtml(record.load===undefined?'':record.load)+'"></label>'
        +'<label class="series-input"><span>Repetições</span><input type="number" inputmode="numeric" min="0" max="200" step="1" id="reps-'+exercise.id+'-'+number+'" data-exercise="'+exercise.id+'" data-series="'+i+'" data-exfield="reps" aria-label="Repetições da série '+number+'" placeholder="reps" value="'+escapeHtml(record.reps===undefined?'':record.reps)+'"></label>'
        +'<label class="series-done"><input type="checkbox" data-exercise="'+exercise.id+'" data-series="'+i+'" data-exfield="done" aria-label="Série '+number+' concluída" '+(record.done?'checked':'')+'><span>Feita</span></label>'
        +'</div>';
    }).join('');
    var old=(entry.load||entry.reps)&&!Array.isArray(entry.series)
      ?'<p class="series-legacy">Registro antigo: '+escapeHtml([entry.load?(entry.load+' kg'):'',entry.reps?(entry.reps+' repetições'):''].filter(Boolean).join(' · '))+'</p>':'';
    return '<div class="series-tracker"><div class="series-tracker-title"><strong>Séries</strong><span data-series-progress="'+exercise.id+'">'+completedSets(exercise,entry)+'/'+count+' feitas</span></div>'
      +rows+old+seriesProgressNote(exercise.id)+'</div>';
  }
  function refreshSeriesIndicators(exercise){
    if(typeof mount.querySelector!=='function')return;
    var entry=safeRecord().exercises[exercise.id]||{};
    var done=completedSets(exercise,entry),progress=mount.querySelector('[data-series-progress="'+exercise.id+'"]');
    if(progress)progress.textContent=done+'/'+setCount(exercise)+' feitas';
    var completed=plans[dayChoice].exercises.filter(function(x){return exerciseIsComplete(x,safeRecord().exercises[x.id]);}).length;
    var total=mount.querySelector('[data-exercises-progress]');
    if(total)total.textContent=completed+'/'+plans[dayChoice].exercises.length+' exercícios';
  }
  function renderExercise(x,index,location,entry){
    entry=entry&&typeof entry==='object'?entry:{};
    var disp=location==='hotel'?(x.hotel||'Sem alternativa definida.'):'';
    return '<details class="train-exercise" id="exercise-'+escapeHtml(x.id)+'">'
      +'<summary><span class="exercise-ordinal">'+(index+1)+'</span><span>'
      +'<div class="exercise-name">'+escapeHtml(x.name)+'</div>'
      +'<div class="exercise-description">'+escapeHtml(x.dose)+' · '+escapeHtml(x.rest)+' descanso</div>'
      +'</span><span class="exercise-caret" aria-hidden="true">⌄</span></summary>'
      +'<div class="train-exercise-body">'
      +'<div class="exercise-meta"><span>'+escapeHtml(x.muscle)+'</span>'
      +(x.caution?'<span class="safety">Sem dor</span>':'')+'</div>'
      +teachingVideo(x.id)
      +stepsList(x.steps)
      +(disp?'<p class="exercise-note">'+escapeHtml(disp)+'</p>':'')
      +(x.cue?'<p class="exercise-note caution">'+escapeHtml(x.cue)+'</p>':'')
      +seriesRows(x,entry)
      +'</div></details>';
  }
  function field(label,id,type,value,extra){
    extra=extra||'';
    if(type==='textarea')return '<div class="workout-field"><label for="'+id+'">'+escapeHtml(label)+'</label><textarea id="'+id+'" data-field="'+id+'" maxlength="650" '+extra+'>'+escapeHtml(value||'')+'</textarea></div>';
    return '<div class="workout-field"><label for="'+id+'">'+escapeHtml(label)+'</label><input id="'+id+'" type="'+(type||'text')+'" data-field="'+id+'" value="'+escapeHtml(value===undefined?'':value)+'" '+extra+'></div>';
  }
  function render(){
    if(!mount)return;
    var week=bridge.getWeek(),p=plans[dayChoice],r=safeRecord(),location=r.location==='hotel'?'hotel':'condominio';
    var completed=['A','B','C','D'].filter(function(key){return getDayRecord(key).complete===true;}).length;
    var completedExercises=p.exercises.filter(function(x){return exerciseIsComplete(x,r.exercises[x.id]);}).length;

    mount.innerHTML='<div class="training-guide">'
      +'<div class="train-safety-short" role="note">Joelhos: não forçar dor ou travamento. Avaliar antes de aumentar cargas.</div>'
      +'<nav class="train-day-nav" aria-label="Escolha a sessão">'+['A','B','C','D'].map(function(key){
        var done=getDayRecord(key).complete===true,day=plans[key];
        var shortName={A:'Superior',B:'Inferiores',C:'Superior',D:'Mobilidade'}[key];
        return '<button type="button" class="train-day-btn'+(dayChoice===key?' active':'')+'" data-day="'+key+'" aria-pressed="'+(dayChoice===key)+'"><strong>'+key+'</strong><small>'+shortName+'</small><span class="train-done">'+(done?'✓':'')+'</span></button>';
      }).join('')+'</nav>'
      +'<section class="panel train-panel" aria-labelledby="trainingDetailTitle"><div class="train-panel-head"><div>'
      +'<h3 id="trainingDetailTitle">'+dayChoice+' · '+escapeHtml(p.title)+'</h3></div>'
      +'<div class="training-summary"><span class="training-stat">'+escapeHtml(p.duration)+'</span></div></div>'
      +'<div class="train-equipment"><label for="trainingLocation">Local</label><select id="trainingLocation" aria-label="Local do treinamento"><option value="condominio"'+(location==='condominio'?' selected':'')+'>Condomínio</option><option value="hotel"'+(location==='hotel'?' selected':'')+'>Hotel</option></select></div>'
      +'<h4 class="train-section-title">Mobilidade · 6–8 min</h4>'
      +guideSteps(p.mobility)
      +'<h4 class="train-section-title">Musculação</h4>'
      +'<div class="train-exercises">'+p.exercises.map(function(x,index){return renderExercise(x,index,location,r.exercises[x.id]);}).join('')+'</div>'

      +'<h4 class="train-section-title">Cardio</h4>'
      +'<details class="train-step"><summary><span class="train-step-index">♥</span><span class="train-step-content"><strong>'+escapeHtml(p.cardio.name)+'</strong><small>'+escapeHtml(p.cardio.dose)+'</small></span></summary><div class="train-step-body"><p>'+escapeHtml(p.cardio.suggestion)+'</p>'+teachingVideo('cardio'+dayChoice)+'</div></details>'

      +'<details class="train-log"><summary><strong>Registro</strong><span data-exercises-progress>'+completedExercises+'/'+p.exercises.length+' exercícios</span></summary>'
      +'<div class="workout-session-form">'
      +'<div class="workout-field-row">'
      +field('Dor antes (0–10)','painBefore','number',r.painBefore===undefined?'':r.painBefore,'min="0" max="10" step="1"')
      +field('Dor depois (0–10)','painAfter','number',r.painAfter===undefined?'':r.painAfter,'min="0" max="10" step="1"')
      +'</div><div class="workout-field-row">'
      +field('Esforço (0–10)','effort','number',r.effort===undefined?'':r.effort,'min="0" max="10" step="1"')
      +field('Cardio (min)','cardioMinutes','number',r.cardioMinutes===undefined?'':r.cardioMinutes,'min="0" max="180" step="1"')
      +'</div>'+field('Observações','notes','textarea',r.notes||'','rows="3"')
      +'<label class="workout-check"><input type="checkbox" data-field="mobilityDone" '+(r.mobilityDone?'checked':'')+'>Mobilidade feita</label>'
      +'<div class="workout-actions"><button class="save" type="button" data-action="save">Salvar</button>'
      +'<button class="finish" type="button" data-action="finish">'+(r.complete?'✓ Sessão concluída':'Concluir sessão')+'</button>'
      +'<button class="clear" type="button" data-action="clear">Limpar</button></div>'
      +'<p class="workout-last">Salvo neste aparelho.</p>'
      +'</div></details></section>'
      +'</div>';
  }
  function saveAuto(){
    var ok=bridge.save();
    return ok;
  }
  function fieldValue(fieldId,el){
    if(['painBefore','painAfter','effort','cardioMinutes'].indexOf(fieldId)>-1){
      var text=el.value.trim();
      if(text==='')return '';
      var n=Number(text),max=fieldId==='cardioMinutes'?180:10;
      if(!Number.isFinite(n)||n<0||n>max){el.setCustomValidity('Valor fora da faixa permitida');return null;}
      el.setCustomValidity('');
      return String(n);
    }
    if(fieldId==='mobilityDone')return el.checked;
    return el.value.slice(0,650);
  }
  function recordInput(target){
    var r=safeRecord();
    if(target.hasAttribute('data-field')){
      var fieldId=target.getAttribute('data-field');
      var val=fieldValue(fieldId,target);
      if(val===null)return;
      r[fieldId]=val;
      saveAuto();
      return;
    }
    if(target.hasAttribute('data-exercise')){
      var id=target.getAttribute('data-exercise');
      var key=target.getAttribute('data-exfield');
      var idxText=target.getAttribute('data-series');
      var exercise=plans[dayChoice].exercises.find(function(x){return x.id===id;});
      if(!exercise||!['load','reps','done'].includes(key))return;
      if(idxText===null)return;
      var seriesNumber=Number(idxText);
      if(!Number.isInteger(seriesNumber)||seriesNumber<0||seriesNumber>=setCount(exercise))return;
      if(!r.exercises[id])r.exercises[id]={};
      var entry=r.exercises[id];
      if(!Array.isArray(entry.series))entry.series=[];
      if(!entry.series[seriesNumber])entry.series[seriesNumber]={load:'',reps:'',done:false};
      var set=entry.series[seriesNumber];
      if(key==='done'){
        set.done=target.checked;
      }else{
        var value=target.value.trim();
        if(key==='load'){
          // Aceita vírgula e ponto decimal; mantém o texto para exibição.
          var validLoad=value===''||(/^\d{1,4}([.,]\d{1,2})?$/.test(value)&&Number(value.replace(',','.'))<=9999);
          if(typeof target.setCustomValidity==='function')target.setCustomValidity(validLoad?'':'Digite uma carga válida em kg');
          if(!validLoad)return;
          set.load=value.slice(0,8);
        }else{
          var validReps=value===''||(/^\d{1,3}$/.test(value)&&Number(value)<=200);
          if(typeof target.setCustomValidity==='function')target.setCustomValidity(validReps?'':'Use de 0 a 200 repetições');
          if(!validReps)return;
          set.reps=value;
        }
      }
      entry.done=exerciseIsComplete(exercise,entry);
      saveAuto();
      refreshSeriesIndicators(exercise);
    }
  }
  mount.addEventListener('click',function(event){
    var dayBtn=event.target.closest('[data-day]');
    if(dayBtn&&plans[dayBtn.dataset.day]){dayChoice=dayBtn.dataset.day;render();return;}
    var act=event.target.closest('[data-action]');if(!act)return;
    var r=safeRecord();
    if(act.dataset.action==='save'){
      if(saveAuto())bridge.toast('Treino '+dayChoice+' salvo na semana '+bridge.getWeek()+'.');
    }else if(act.dataset.action==='finish'){
      var before=r.painBefore===''||r.painBefore===undefined?null:Number(r.painBefore);
      var after=r.painAfter===''||r.painAfter===undefined?null:Number(r.painAfter);
      if(after!==null&&before!==null&&after>before){
        bridge.toast('A dor aumentou. Revise a sessão e os exercícios antes de progredir.');
      }
      r.complete=!r.complete;
      r.completedAt=r.complete?new Date().toISOString():'';
      if(saveAuto()){render();bridge.toast(r.complete?'Sessão registrada como concluída.':'Sessão reaberta.');}
    }else if(act.dataset.action==='clear'){
      if(!confirm('Apagar somente o treino '+dayChoice+' da semana '+bridge.getWeek()+'?'))return;
      var w=bridge.getData().weeks[bridge.getWeek()-1];
      if(w.training)delete w.training[dayChoice];
      if(saveAuto()){render();bridge.toast('Registro removido.');}
    }
  });
  mount.addEventListener('toggle',function(event){
    // <details> emite toggle sem bubbling: captura permite iniciar o vídeo sem tocar no player.
    var details=event.target;
    if(details&&details.tagName==='DETAILS')autoLoopIn(details);
  },true);
  mount.addEventListener('input',function(event){recordInput(event.target);});
  mount.addEventListener('change',function(event){
    var t=event.target;
    if(t.id==='trainingLocation'){
      var r=safeRecord();r.location=t.value==='hotel'?'hotel':'condominio';
      saveAuto();render();
    } else recordInput(t);
  });
  window.MeuTreinoTreinos={render:render};
  render();
})();