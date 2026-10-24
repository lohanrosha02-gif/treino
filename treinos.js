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
        {id:'mA1',name:'Circundução dos ombros',dose:'1 × 10 para cada sentido',kind:'mobility',steps:['Em pé ou sentado, relaxe os braços junto ao corpo.','Eleve e gire os ombros para trás em círculos lentos.','Faça o mesmo movimento para a frente, sem dor.']},
        {id:'mA2',name:'Rotação torácica sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Sente-se com os pés apoiados e cruze os braços no peito.','Gire suavemente a parte superior do tronco, mantendo a pelve estável.','Retorne ao centro e alterne os lados sem forçar a lombar.']},
        {id:'mA3',name:'Deslizamento dos braços na parede',dose:'1 × 8–10',kind:'raise',steps:['Fique de frente para uma parede com antebraços apoiados.','Deslize-os para cima até onde os ombros permitirem confortavelmente.','Desça devagar, evitando arquear a lombar.']}
      ],
      exercises:[
        {id:'a1',name:'Chest press na máquina',dose:'3 × 8–12',rest:'90–120 s',muscle:'Peito · tríceps · deltoide anterior',kind:'press',hotel:'Supino com halteres em banco, se houver apoio e boa estabilidade.',steps:['Ajuste o banco para manter as alças próximas à altura do peito.','Com costas apoiadas, empurre as alças sem trancar os cotovelos.','Retorne lentamente, mantendo os ombros confortáveis.'],cue:'Sem impulso das pernas; inicie com carga que permita aproximadamente 3 repetições de reserva.'},
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
        {id:'mC3',name:'Retração escapular',dose:'1 × 10–12',kind:'row',steps:['Mantenha os braços relaxados e pescoço solto.','Aproxime suavemente as escápulas sem elevar os ombros.','Solte e repita, mantendo a respiração.']}
      ],
      exercises:[
        {id:'c1',name:'Supino inclinado na máquina',dose:'3 × 8–12',rest:'90–120 s',muscle:'Peito · tríceps',kind:'press',hotel:'Supino inclinado com halteres e banco estável.',steps:['Ajuste o encosto para apoiar completamente as costas.','Empurre as alças na direção indicada pela máquina.','Retorne com controle sem descer além do conforto.']},
        {id:'c2',name:'Remada sentada com apoio',dose:'3 × 8–12',rest:'90–120 s',muscle:'Costas · bíceps',kind:'row',hotel:'Remada apoiada unilateral com halter.',steps:['Sente-se com peito apoiado ou tronco estabilizado.','Puxe as alças sem inclinar o corpo para trás.','Estenda os braços devagar e repita.']},
        {id:'c3',name:'Crucifixo no peck deck',dose:'2 × 12–15',rest:'60–90 s',muscle:'Peitoral',kind:'fly',hotel:'Crucifixo com halteres leves e amplitude curta, se orientado.',steps:['Ajuste o banco na altura adequada dos ombros.','Aproxime as alças à frente do peito em movimento controlado.','Abra os braços até uma amplitude confortável.']},
        {id:'c4',name:'Puxada alta na polia',dose:'2 × 10–12',rest:'75–90 s',muscle:'Dorsais · bíceps',kind:'pull',hotel:'Polia alta, se disponível.',steps:['Segure a barra com pegada confortável.','Puxe para a parte superior do peito, sem inclinar excessivamente o tronco.','Devolva a barra de forma lenta.']},
        {id:'c5',name:'Face pull',dose:'2 × 12–15',rest:'60 s',muscle:'Deltoide posterior · escápulas',kind:'row',hotel:'Remada alta leve com elástico, somente se houver técnica e conforto.',steps:['Ajuste a corda na altura do rosto ou um pouco acima.','Puxe em direção ao rosto, abrindo os cotovelos.','Retorne devagar, sem elevar os ombros.']},
        {id:'c6',name:'Rosca bíceps na polia',dose:'2 × 10–15',rest:'60 s',muscle:'Bíceps',kind:'curl',hotel:'Rosca com halteres sentado.',steps:['Fique estável, preferencialmente sentado se necessário.','Flexione os cotovelos sem balançar o tronco.','Retorne lentamente.']},
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
        {id:'mD3',name:'Mobilidade de ombros',dose:'1 × 10 para cada sentido',kind:'mobility',steps:['Relaxe os braços ao lado do corpo.','Gire os ombros lentamente para trás e depois para a frente.','Mantenha o pescoço solto para preparar o cardio de braços.']}
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
  function movementSvg(kind){
    var vectors={
      press:[22,0,'Empurrar'],
      row:[-20,0,'Puxar'],
      pull:[0,20,'Puxar'],
      fly:[-13,0,'Aproximar'],
      raise:[0,-22,'Elevar'],
      curl:[0,-16,'Flexionar'],
      hip:[-14,0,'Mover'],
      ankle:[0,-11,'Elevar'],
      knee:[0,-12,'Movimentar'],
      rotate:[14,0,'Girar'],
      mobility:[0,-10,'Mobilizar'],
      isometric:[0,0,'Contrair'],
      cardio:[18,0,'Ritmo leve']
    };
    var v=vectors[kind]||vectors.mobility;
    var arrow=kind==='pull'||kind==='raise'||kind==='curl'||kind==='knee'||kind==='ankle'
      ?'<path d="M 116 75 L 116 42 M 109 49 L 116 42 L 123 49" stroke="#47775b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
      :'<path d="M 102 67 L 134 67 M 126 60 L 134 67 L 126 74" stroke="#47775b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    return '<svg viewBox="0 0 160 126" role="img" aria-label="Guia ilustrativo animado: '+escapeHtml(v[2])+'; não representa a execução técnica exata" xmlns="http://www.w3.org/2000/svg">'
      +'<rect x="2" y="2" width="156" height="122" rx="14" fill="#edf4ec"/>'
      +'<circle cx="52" cy="25" r="13" fill="#83a58c"/>'
      +'<path d="M 52 41 L 52 81 M 52 51 L 28 74 M 52 51 L 77 74 M 52 81 L 33 109 M 52 81 L 71 109" fill="none" stroke="#648d70" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
      +'<g class="demo-motion" style="--dx:'+v[0]+'px;--dy:'+v[1]+'px">'
      +'<circle cx="82" cy="70" r="8" fill="#275f42" opacity=".94"/>'
      +'<path d="M 77 67 L 87 73" stroke="#d7ebd7" stroke-width="2" stroke-linecap="round"/>'
      +'</g>'+arrow
      +'<text x="113" y="100" text-anchor="middle" fill="#526b58" font-size="11" font-weight="700">'+escapeHtml(v[2])+'</text>'
      +'</svg>';
  }

  // Sequência fotográfica de três poses: material ilustrativo, não filmagem.
  var photoIndexes={
    mA1:['a',0],mA2:['a',1],mA3:['a',2],a1:['a',3],a2:['a',4],a3:['a',5],a4:['a',6],a5:['a',7],a6:['a',8],a7:['a',9],
    mB1:['b',0],mB2:['b',1,true],mB3:['b',2],b1:['b',3],b2:['b',4],b3:['b',5],b4:['b',7,true],b5:['b',7,true],b6:['b',8],
    mC1:['c',0],mC2:['c',1],mC3:['c',2],c1:['c',3],c2:['c',4],c3:['c',5],c4:['c',6],c5:['c',7],c6:['c',8],c7:['c',9],
    mD1:['d',0],mD2:['d',1],mD3:['d',2],d1:['d',3],d2:['d',4],d3:['d',5],d4:['d',7,true],d5:['d',7]
  };
  var photoStripRows={a:11,b:10,c:11,d:9};
  function exercisePhoto(id,kind){
    var item=photoIndexes[id];
    if(!item)return '<div class="exercise-demo">'+movementSvg(kind)+'</div>';
    var letter=item[0],row=item[1],still=!!item[2];
    return '<div class="exercise-demo real-demo">'
      +'<div class="photo-frame'+(still?' still':'')+'"'
      +' style="--photo-sheet:url(./assets/animacoes/treino-'+letter+'-quadros.webp);--sheet-height:'+(photoStripRows[letter]*192)+'px;--frame-y:-'+(row*192)+'px"'
      +' role="img" aria-label="'+(still?'Posição inicial ilustrativa':'Sequência ilustrativa de três poses')+'"></div></div>';
  }
  function bicyclePhoto(){
    return '<div class="exercise-demo bike-demo"><div class="bike-photo" role="img" aria-label="Exemplo de bicicleta ergométrica">'
      +'<span class="bike-pedal" aria-hidden="true">↻</span></div></div>';
  }
  function driveVideoFor(id,fallback){
    var library=window.MeuTreinoVideos||{};
    var mapped=library.videos&&library.videos[id];
    if(typeof mapped!=='string'||!/^[a-zA-Z0-9_-]{10,}$/.test(mapped))return fallback;
    var url='https://drive.google.com/file/d/'+encodeURIComponent(mapped)+'/preview';
    return '<div class="exercise-demo drive-video" data-drive-video="'+escapeHtml(id)+'">'
      +'<iframe loading="lazy" src="'+url+'" title="Vídeo do exercício no Google Drive" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen" allowfullscreen></iframe>'
      +'</div>';
  }
  function driveFolderLibrary(){
    var cfg=window.MeuTreinoVideos||{};
    var folder=cfg.pastaId;
    if(typeof folder!=='string'||!/^[a-zA-Z0-9_-]{10,}$/.test(folder))return '';
    var direct='https://drive.google.com/drive/folders/'+encodeURIComponent(folder);
    var embed='https://drive.google.com/embeddedfolderview?id='+encodeURIComponent(folder)+'#grid';
    return '<details class="drive-library">'
      +'<summary><strong>Vídeos do Drive</strong><span>Ver biblioteca</span></summary>'
      +'<div class="drive-library-body"><iframe loading="lazy" title="Biblioteca de vídeos Meu Treino no Google Drive" data-folder-src="'+escapeHtml(embed)+'" referrerpolicy="no-referrer"></iframe>'
      +'<a href="'+direct+'" target="_blank" rel="noopener noreferrer">Abrir pasta no Drive</a></div>'
      +'</details>';
  }
  function stepsList(steps){return '<ol>'+steps.map(function(s){return '<li>'+escapeHtml(s)+'</li>';}).join('')+'</ol>';}
  function guideSteps(items){
    return '<div class="train-step-row">'+items.map(function(m,index){
      return '<details class="train-step"><summary><span class="train-step-index">'+(index+1)+'</span>'
        +'<span class="train-step-content"><strong>'+escapeHtml(m.name)+'</strong><small>'+escapeHtml(m.dose)+'</small></span></summary>'
        +'<div class="train-step-body">'+stepsList(m.steps)
        +driveVideoFor(m.id,exercisePhoto(m.id,m.kind))+'</div></details>';
    }).join('')+'</div>';
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
      +driveVideoFor(x.id,exercisePhoto(x.id,x.kind))
      +stepsList(x.steps)
      +(disp?'<p class="exercise-note">'+escapeHtml(disp)+'</p>':'')
      +(x.cue?'<p class="exercise-note caution">'+escapeHtml(x.cue)+'</p>':'')
      +'<div class="workout-field-row">'
      +'<div class="workout-field"><label for="load-'+x.id+'">Carga usada (kg, opcional)</label><input id="load-'+x.id+'" data-exercise="'+x.id+'" data-exfield="load" inputmode="decimal" placeholder="Ex.: 5" value="'+escapeHtml(entry.load||'')+'"></div>'
      +'<div class="workout-field"><label for="reps-'+x.id+'">Repetições realizadas</label><input id="reps-'+x.id+'" data-exercise="'+x.id+'" data-exfield="reps" placeholder="Ex.: 12/12" maxlength="40" value="'+escapeHtml(entry.reps||'')+'"></div>'
      +'</div><label class="workout-check" style="margin-top:10px"><input type="checkbox" data-exercise="'+x.id+'" data-exfield="done" '+(entry.done?'checked':'')+'>Concluído</label>'
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
    var completedExercises=p.exercises.filter(function(x){return r.exercises[x.id]&&r.exercises[x.id].done;}).length;

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
      +'<details class="train-step"><summary><span class="train-step-index">♥</span><span class="train-step-content"><strong>'+escapeHtml(p.cardio.name)+'</strong><small>'+escapeHtml(p.cardio.dose)+'</small></span></summary><div class="train-step-body"><p>'+escapeHtml(p.cardio.suggestion)+'</p>'+driveVideoFor('cardio'+dayChoice,bicyclePhoto())+'</div></details>'
      +driveFolderLibrary()
      +'<details class="train-log"><summary><strong>Registro</strong><span>'+completedExercises+'/'+p.exercises.length+' exercícios</span></summary>'
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
      var id=target.getAttribute('data-exercise'),key=target.getAttribute('data-exfield');
      if(!id||!['load','reps','done'].includes(key))return;
      if(!plans[dayChoice].exercises.some(function(x){return x.id===id;}))return;
      if(!r.exercises[id])r.exercises[id]={};
      var entry=r.exercises[id];
      if(key==='done')entry.done=target.checked;
      else if(key==='load')entry.load=target.value.slice(0,16);
      else entry.reps=target.value.slice(0,40);
      saveAuto();
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
    var details=event.target;
    if(details&&details.open&&details.classList&&details.classList.contains('drive-library')){
      var iframe=details.querySelector('iframe[data-folder-src]');
      if(iframe&&!iframe.src)iframe.src=iframe.getAttribute('data-folder-src');
    }
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