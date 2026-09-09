(()=>{
'use strict';
const ROLE_LABEL={K:'王',R:'飛',B:'角',G:'金',S:'銀',N:'桂',L:'香',P:'歩'};
const ROLE_NAME={K:'王将',R:'飛車',B:'角行',G:'金将',S:'銀将',N:'桂馬',L:'香車',P:'歩兵'};
const PROMO_LABEL={R:'龍',B:'馬',S:'全',N:'圭',L:'杏',P:'と'};
const ROLE_VALUE={K:10000,R:900,B:800,G:600,S:500,N:350,L:300,P:120};
const TEAMS={
  angel:{label:'天使軍',promotionPawn:'kawazu',roles:{K:'seraphiel',R:'jihal',B:'yellow',G:'orange',S:'green',N:'blue',L:'remiel',P:'mob'}},
  devil:{label:'悪魔軍',promotionPawn:'kokabiel',roles:{K:'satanael',R:'flauros',B:'beelzebub',G:'samael',S:'black',N:'purple',L:'sariel',P:'mob'}}
};
const STAGES={
  standard:{id:'standard',label:'標準盤',size:9,promoDepth:3},
  compact:{id:'compact',label:'小型決戦',size:7,promoDepth:2},
  current:{id:'current',label:'急流回廊',size:7,promoDepth:2,battleHazard:'current'},
  channel:{id:'channel',label:'狭水路',size:7,promoDepth:2,shape:'channel'}
};
const DIFFICULTIES={
  easy:{id:'easy',label:'やさしい',think:700,pool:12,captureMul:1.55,promoBonus:30,noise:70},
  normal:{id:'normal',label:'ふつう',think:520,pool:5,captureMul:3,promoBonus:80,noise:18},
  hard:{id:'hard',label:'むずかしい',think:430,pool:2,captureMul:4.4,promoBonus:130,noise:5}
};

const CHAR={
 seraphiel:{name:'セラフィエルさん',body:'#f5f1df',eye:'#fff9d5',iris:'#ffd85c',skills:['セラフィックアッパー','セラフィックレイ','セラフィックキック']},
 jihal:{name:'ジィハルさん',body:'#244f78',eye:'#f1d64e',iris:'#17364f',skills:['雷','ライトニングダッシュ','ボルトショット']},
 yellow:{name:'ラファエルさん',body:'#e3cf42',eye:'#f2df66',iris:'#26351c',skills:['水圧カッター','ヒーリングバブル','高速バブル移動']},
 orange:{name:'ウリエルさん',body:'#ef8c36',eye:'#f6a24e',iris:'#26321d',skills:['ホワイトカウンター','ガーディアンタックル','ホワイトリーチ']},
 green:{name:'ミカエルさん',body:'#35d851',eye:'#69e86e',iris:'#173126',skills:['バーニングアッパー','バーニングキック','バーニングサイクロン']},
 blue:{name:'ガブリエルさん',body:'#35bde6',eye:'#63d9f5',iris:'#15362f',skills:['アクアトルネード','アクアストリーム','アクアボルテックス']},
 remiel:{name:'レミエルさん',body:'#87b7c9',eye:'#bfe6ee',iris:'#5d8fa8',skills:['ミラージュ','アクアパリィ','フロストショット']},
 kawazu:{name:'カワズさん',body:'#1ad248',eye:'#2fd451',iris:'#191919',skills:['成り専用ファイター','スピンキックカッター','水中格闘の技を使用']},
 satanael:{name:'サタナエルさん',body:'#690b1b',eye:'#16090c',iris:'#ff352e',skills:['ディザスターフレア','ダークレイ','インフェルノウェーブ']},
 flauros:{name:'フラウロスさん',body:'#e20b22',eye:'#ff3326',iris:'#f4c542',skills:['ヘルフレイム','フレイムクロー','レオパードラッシュ']},
 beelzebub:{name:'ベルゼブブさん',body:'#17121d',eye:'#35ff00',iris:'#b7e234',skills:['ヴェノム・ウォーター','アビスショック','ベノムショット']},
 samael:{name:'サマエルさん',body:'#2b193d',eye:'#7760be',iris:'#d9f7ff',skills:['ポイズンゲート','ヴェノムタン','毒系必殺技']},
 black:{name:'ルシファーさん',body:'#3b3e47',eye:'#50545f',iris:'#101010',skills:['ヘルクラッシュ','アビスチャージ','アイスショット']},
 purple:{name:'リリスさん',body:'#f24ca5',eye:'#ff66b8',iris:'#111',skills:['舌ラッシュ','バブルショット','バックスピンキック']},
 sariel:{name:'サリエルさん',body:'#5d6488',eye:'#d8ddf5',iris:'#991126',skills:['ルナ・スラッシュ','イーブルアイ','ブラッドムーン']},
 kokabiel:{name:'コカビエルさん',body:'#20263f',eye:'#63dbe7',iris:'#202738',skills:['成り専用ファイター','グラビティボール','メテオレイン']},
 mob:{name:'モブさん',body:'#9be348',eye:'#c9f57a',iris:'#29420f',skills:['前 ＋ パンチ：バブルショット（大きめ・ゆっくり）','上 ＋ パンチ：カエル跳びアッパー','前 ＋ キック：トリプルキック（横移動しながら3回）']}
};

const boardEl=document.getElementById('board'),turnBanner=document.getElementById('turnBanner');
const angelHandEl=document.getElementById('angelHand'),devilHandEl=document.getElementById('devilHand');
const notice=document.getElementById('battleNotice');
const info={portrait:document.getElementById('piecePortrait'),name:document.getElementById('pieceName'),role:document.getElementById('pieceRole'),skills:document.getElementById('skillList')};
const promoModal=document.getElementById('promotionModal'),promoText=document.getElementById('promotionText');
const promoteStandard=document.getElementById('promoteStandard'),promoteSpecial=document.getElementById('promoteSpecial'),promoteNo=document.getElementById('promoteNo');
const gameOverModal=document.getElementById('gameOverModal');
const battleLoading=document.getElementById('battleLoading'),loadingAttacker=document.getElementById('loadingAttacker'),loadingDefender=document.getElementById('loadingDefender');
const boardResultEffect=document.getElementById('boardResultEffect'),boardResultKicker=document.getElementById('boardResultKicker'),boardResultMain=document.getElementById('boardResultMain'),boardResultSub=document.getElementById('boardResultSub');
const startModal=document.getElementById('startModal'),startGameBtn=document.getElementById('startGameBtn'),modeSummary=document.getElementById('modeSummary');
let setupChoice={difficulty:'normal',stage:'standard',hands:'auto'};
let state,selected=null,legal=[],selectedHand=null,pendingMove=null,cpuTimer=null,cpuBusy=false,resultEffectTimer=null;

function other(t){return t==='angel'?'devil':'angel'}
function mk(team,role,promoted=false,promotionForm=null){return{team,role,promoted,promotionForm}}
function initialBoard(stageId='standard') {
  const stage=STAGES[stageId]||STAGES.standard, n=stage.size;
  const b=Array.from({length:n},()=>Array(n).fill(null));
  if(stageId==='compact'||stageId==='current'||stageId==='channel'){
    // 各役割＝各キャラ1体。歩だけ前列中央に置く7×7決戦。
    const back=['L','N','S','K','G','B','R'];
    back.forEach((r,x)=>b[0][x]=mk('devil',r));
    b[1][Math.floor(n/2)]=mk('devil','P');
    const angelBack=['R','B','G','K','S','N','L'];
    angelBack.forEach((r,x)=>b[n-1][x]=mk('angel',r));
    b[n-2][Math.floor(n/2)]=mk('angel','P');
  }else{
    const back=['L','N','S','G','K','G','S','N','L'];
    back.forEach((r,x)=>b[0][x]=mk('devil',r)); b[1][1]=mk('devil','R'); b[1][7]=mk('devil','B'); for(let x=0;x<n;x++)b[2][x]=mk('devil','P');
    back.forEach((r,x)=>b[n-1][x]=mk('angel',r)); b[n-2][7]=mk('angel','R'); b[n-2][1]=mk('angel','B'); for(let x=0;x<n;x++)b[n-3][x]=mk('angel','P');
  }
  return b;
}
function emptyHands(){return{angel:{R:0,B:0,G:0,S:0,N:0,L:0,P:0},devil:{R:0,B:0,G:0,S:0,N:0,L:0,P:0}}}
function freshState(opts=setupChoice){
  const stage=opts.stage||'standard',difficulty=opts.difficulty||'normal';
  const handsMode=stage==='standard'?'on':(opts.hands||'off');
  return{schemaVersion:218,board:initialBoard(stage),boardSize:STAGES[stage].size,stage,difficulty,handsMode,turn:'angel',hands:emptyHands(),winner:null,lastMessage:'天使軍の手番'}
}
function normalizeState(s){
  if(!s||!s.board||s.schemaVersion!==218)return null;
  s.stage=s.stage||((s.board.length===7)?'compact':'standard');
  s.difficulty=s.difficulty||'normal';
  s.boardSize=s.board.length;
  s.hands=s.hands||emptyHands();
  return s;
}
function save(){localStorage.setItem('waterFrogShogiState',JSON.stringify(state))}
function load(){try{return normalizeState(JSON.parse(localStorage.getItem('waterFrogShogiState')||'null'))}catch(e){return null}}
function boardSize(){return state?.boardSize||state?.board?.length||9}
function stageConfig(){return STAGES[state?.stage]||STAGES.standard}
function difficultyConfig(){return DIFFICULTIES[state?.difficulty]||DIFFICULTIES.normal}
function updateModeSummary(){if(modeSummary&&state)modeSummary.textContent=`${stageConfig().label} / CPU ${difficultyConfig().label} / 持ち駒${state.handsMode==='on'?'あり':'なし'}`}

function fighterType(piece){if(piece.promoted&&piece.promotionForm==='special')return TEAMS[piece.team].promotionPawn;return TEAMS[piece.team].roles[piece.role]}
function charOf(piece){return CHAR[fighterType(piece)]||CHAR.mob}
function tokenHTML(piece){const c=charOf(piece),label=piece.promoted?(PROMO_LABEL[piece.role]||ROLE_LABEL[piece.role]):ROLE_LABEL[piece.role];return `<div class="frog-token" style="--body:${c.body};--eye:${c.eye};--iris:${c.iris}"><span class="role-kanji">${label}</span>${piece.promoted?'<span class="promoted-badge">成</span>':''}</div>`}
function updateInfo(piece){
  if(!piece){info.name.textContent='駒を選択';info.role.textContent='動けるマスと技表を表示します';info.skills.innerHTML='';info.portrait.removeAttribute('style');return}
  const c=charOf(piece);info.portrait.style.setProperty('--body',c.body);info.portrait.style.setProperty('--eye',c.eye);info.portrait.style.setProperty('--iris',c.iris);info.name.textContent=c.name;
  const label=piece.promoted?(PROMO_LABEL[piece.role]||ROLE_LABEL[piece.role]):ROLE_LABEL[piece.role];
  const form=piece.promoted?(piece.promotionForm==='special'?'・特殊成':'・通常成'):'';
  info.role.textContent=`${TEAMS[piece.team].label} / ${label}（${ROLE_NAME[piece.role]}${form}）`;info.skills.innerHTML=c.skills.map(s=>`<div class="skill">${s}</div>`).join('');
}
function isBlocked(x,y){if(state?.stage!=='channel')return false;const n=boardSize();return (y===2||y===4)&&(x<2||x>n-3)}
function inBounds(x,y){const n=boardSize();return x>=0&&x<n&&y>=0&&y<n&&!isBlocked(x,y)}
function pathMoves(x,y,dirs,piece){const out=[];for(const [dx,dy] of dirs){let nx=x+dx,ny=y+dy;while(inBounds(nx,ny)){const q=state.board[ny][nx];if(!q)out.push({x:nx,y:ny});else{if(q.team!==piece.team)out.push({x:nx,y:ny,capture:true});break}nx+=dx;ny+=dy}}return out}
function stepMoves(x,y,dirs,piece){const out=[];for(const [dx0,dy0] of dirs){const dir=piece.team==='angel'?-1:1;const nx=x+dx0,ny=y+dy0*dir;if(!inBounds(nx,ny))continue;const q=state.board[ny][nx];if(!q||q.team!==piece.team)out.push({x:nx,y:ny,capture:!!q})}return out}
function movesFor(x,y){
  const p=state.board[y][x];if(!p)return[];const gold=[[0,1],[-1,1],[1,1],[-1,0],[1,0],[0,-1]];
  if(p.promoted&&['P','L','N','S'].includes(p.role))return stepMoves(x,y,gold,p);
  if(p.role==='K')return stepMoves(x,y,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]],p);
  if(p.role==='G')return stepMoves(x,y,gold,p);
  if(p.role==='S')return stepMoves(x,y,[[-1,1],[0,1],[1,1],[-1,-1],[1,-1]],p);
  if(p.role==='N')return stepMoves(x,y,[[-1,2],[1,2]],p);
  if(p.role==='P')return stepMoves(x,y,[[0,1]],p);
  if(p.role==='L'){const dy=p.team==='angel'?-1:1;return pathMoves(x,y,[[0,dy]],p)}
  if(p.role==='R'){let o=pathMoves(x,y,[[1,0],[-1,0],[0,1],[0,-1]],p);if(p.promoted)o=o.concat(stepMoves(x,y,[[1,1],[-1,1],[1,-1],[-1,-1]],p));return o}
  if(p.role==='B'){let o=pathMoves(x,y,[[1,1],[-1,1],[1,-1],[-1,-1]],p);if(p.promoted)o=o.concat(stepMoves(x,y,[[1,0],[-1,0],[0,1],[0,-1]],p));return o}
  return[];
}
function dropMoves(role,team){
  const out=[],n=boardSize();for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    if(state.board[y][x])continue;
    if((role==='P'||role==='L')&&((team==='angel'&&y===0)||(team==='devil'&&y===n-1)))continue;
    if(role==='N'&&((team==='angel'&&y<=1)||(team==='devil'&&y>=n-2)))continue;
    if(role==='P'){let same=false;for(let yy=0;yy<n;yy++){const p=state.board[yy][x];if(p&&p.team===team&&p.role==='P'&&!p.promoted){same=true;break}}if(same)continue}
    out.push({x,y,drop:true});
  }return out;
}
function canPromote(piece,fromY,toY){if(piece.promoted||!['R','B','S','N','L','P'].includes(piece.role))return false;const n=boardSize(),d=stageConfig().promoDepth;const inZone=y=>piece.team==='angel'?y<d:y>=n-d;return inZone(fromY)||inZone(toY)}
function mustPromote(piece,toY){const n=boardSize();if(piece.role==='P'||piece.role==='L')return piece.team==='angel'?toY===0:toY===n-1;if(piece.role==='N')return piece.team==='angel'?toY<=1:toY>=n-2;return false}
function setPromoted(piece,form){piece.promoted=true;piece.promotionForm=form||'standard'}

function render(){
  boardEl.innerHTML='';
  const n=boardSize(),d=stageConfig().promoDepth;boardEl.style.setProperty('--board-size',n);boardEl.classList.toggle('compact-stage',state.stage==='compact');boardEl.setAttribute('aria-label',`${n}×${n}の水中蛙将棋盤`);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const cell=document.createElement('button');cell.className='cell';if(isBlocked(x,y)){cell.classList.add('blocked');cell.disabled=true;boardEl.appendChild(cell);continue;}if(y<d||y>=n-d)cell.classList.add('promo-zone');if(x===n-1)cell.classList.add('last-col');if(y===n-1)cell.classList.add('last-row');cell.dataset.x=x;cell.dataset.y=y;
    if(selected&&selected.x===x&&selected.y===y)cell.classList.add('selected');const l=legal.find(m=>m.x===x&&m.y===y);if(l)cell.classList.add(l.drop?'drop':l.capture?'capture':'legal');
    const p=state.board[y][x];if(p){const wrap=document.createElement('div');wrap.className=`piece ${p.team}`;wrap.innerHTML=tokenHTML(p);cell.appendChild(wrap)}
    cell.addEventListener('click',()=>onCell(x,y));boardEl.appendChild(cell);
  }
  renderHands();updateModeSummary();
  turnBanner.textContent=state.winner?`${TEAMS[state.winner].label}の勝利！`:(state.turn==='devil'?(cpuBusy?'悪魔軍 CPU 思考中…':'悪魔軍 CPU の手番'):'天使軍の手番');
  turnBanner.style.boxShadow=state.turn==='angel'?'inset 0 0 0 2px rgba(255,235,130,.45)':'inset 0 0 0 2px rgba(255,90,110,.45)';
  save();scheduleCpuIfNeeded();
}
function renderHands(){
  if(state.handsMode!=='on'){angelHandEl.innerHTML='<span class="hand-count">このステージは持ち駒なし</span>';devilHandEl.innerHTML='<span class="hand-count">このステージは持ち駒なし</span>';return}
  for(const team of ['angel','devil']){const el=team==='angel'?angelHandEl:devilHandEl;el.innerHTML='';for(const role of ['R','B','G','S','N','L','P']){const n=state.hands[team][role]||0;if(!n)continue;const b=document.createElement('button');b.className='hand-piece'+(selectedHand&&selectedHand.team===team&&selectedHand.role===role?' selected':'');b.innerHTML=`<span>${ROLE_LABEL[role]}</span><span class="hand-count">×${n}</span>`;b.disabled=team==='devil';b.addEventListener('click',()=>selectHand(team,role));el.appendChild(b)}if(!el.children.length)el.innerHTML='<span class="hand-count">持ち駒なし</span>'}
}
function clearSelection(){selected=null;selectedHand=null;legal=[]}
function selectHand(team,role){if(state.winner||cpuBusy||team!=='angel'||state.turn!=='angel'||!state.hands[team][role])return;selected=null;selectedHand={team,role};legal=dropMoves(role,team);updateInfo(mk(team,role));render()}
function onCell(x,y){
  if(state.winner||cpuBusy||state.turn!=='angel'||!battleLoading.hidden||!promoModal.hidden)return;
  const p=state.board[y][x],target=legal.find(m=>m.x===x&&m.y===y);
  if(selectedHand&&target){state.board[y][x]=mk('angel',selectedHand.role,false);state.hands.angel[selectedHand.role]--;finishTurn(`天使軍が${ROLE_LABEL[selectedHand.role]}を打ちました`);return}
  if(selected&&target){attemptMove(selected.x,selected.y,x,y);return}
  if(p&&p.team==='angel'){selected={x,y};selectedHand=null;legal=movesFor(x,y);updateInfo(p);render();return}
  clearSelection();if(p)updateInfo(p);render();
}
function attemptMove(fx,fy,tx,ty){const attacker=state.board[fy][fx],defender=state.board[ty][tx];if(defender){pendingMove={fx,fy,tx,ty,attacker:{...attacker},defender:{...defender}};launchBattle(pendingMove);return}completeBoardMove(fx,fy,tx,ty,false)}
function completeBoardMove(fx,fy,tx,ty,wasCapture){
  const p=state.board[fy][fx];if(!p)return;state.board[fy][fx]=null;state.board[ty][tx]=p;
  const after=()=>finishTurn(`${charOf(p).name} が ${ROLE_LABEL[p.role]}を進めました`);
  const forced=mustPromote(p,ty),optional=canPromote(p,fy,ty);
  if(p.team==='devil'){
    if(forced||optional){const should=forced||Math.random()<.82;if(should)setPromoted(p,Math.random()<.22?'special':'standard')}
    after();return;
  }
  if(forced){showPromotionChoice(p,after,true);return}
  if(optional){showPromotionChoice(p,after,false);return}
  after();
}
function showPromotionChoice(piece,after,forced){
  pendingMove={type:'promotionOnly',piece,after,forced};
  const specialName=piece.team==='angel'?'カワズさん':'コカビエルさん';
  promoText.textContent=forced?`${charOf(piece).name}（${ROLE_NAME[piece.role]}）はこの位置では成りが必須です。`:`${charOf(piece).name}（${ROLE_NAME[piece.role]}）の成り方を選んでください。`;
  promoteSpecial.textContent=`${specialName}で成る`;promoteNo.hidden=forced;promoModal.hidden=false;
}
function resolvePromotion(form){if(pendingMove?.type!=='promotionOnly')return;const data=pendingMove;if(form)setPromoted(data.piece,form);promoModal.hidden=true;promoteNo.hidden=false;pendingMove=null;data.after()}
promoteStandard.onclick=()=>resolvePromotion('standard');promoteSpecial.onclick=()=>resolvePromotion('special');promoteNo.onclick=()=>resolvePromotion(null);

function finishTurn(msg){notice.hidden=false;notice.textContent=msg;setTimeout(()=>{notice.hidden=true},1400);state.turn=other(state.turn);clearSelection();cpuBusy=false;render()}
function launchBattle(m){
  const attacker=m.attacker,defender=m.defender;
  loadingAttacker.textContent=charOf(attacker).name;loadingDefender.textContent=charOf(defender).name;battleLoading.hidden=false;
  sessionStorage.removeItem('mixBattleResult');sessionStorage.setItem('frogShogiPendingMove',JSON.stringify(m));
  sessionStorage.setItem('mixBattle',JSON.stringify({mode:'shogi',source:'water-frog-shogi',playerRole:attacker.team==='angel'?'attacker':'defender',attackerTeam:attacker.team,defenderTeam:defender.team,attacker:'shogi-attacker',defender:'shogi-defender',attackerType:fighterType(attacker),defenderType:fighterType(defender),attackerHp:100,defenderHp:33,battleHazard:stageConfig().battleHazard||null,returnUrl:'index.html'}));
  save();
  setTimeout(()=>{location.href='water-fighter.html?mix=1&battle=1&shogi=1'},700);
}

function showBoardBattleEffect(attackerWon,attacker,defender){
  clearTimeout(resultEffectTimer);
  const playerWon=(attackerWon&&attacker.team==='angel')||(!attackerWon&&defender.team==='angel');
  boardResultEffect.className='board-result-effect '+(playerWon?'win':'lose');
  boardResultKicker.textContent=attackerWon?'攻撃側の勝利':'防御側の勝利';
  boardResultMain.textContent=playerWon?'格闘勝利！':'格闘敗北';
  const winner=attackerWon?attacker:defender, loser=attackerWon?defender:attacker;
  boardResultSub.textContent=`${charOf(winner).name} が ${charOf(loser).name} に勝利`;
  boardResultEffect.hidden=false;
  resultEffectTimer=setTimeout(()=>{boardResultEffect.hidden=true},1500);
}

function applyBattleResult(){
  let result=null,pending=null;try{result=JSON.parse(sessionStorage.getItem('mixBattleResult')||'null');pending=JSON.parse(sessionStorage.getItem('frogShogiPendingMove')||'null')}catch(e){}
  if(!result||!pending)return;
  sessionStorage.removeItem('mixBattleResult');sessionStorage.removeItem('frogShogiPendingMove');battleLoading.hidden=true;
  const liveAttacker=state.board[pending.fy]?.[pending.fx],liveDefender=state.board[pending.ty]?.[pending.tx];if(!liveAttacker||!liveDefender)return;
  if(result.winner==='attacker'){
    showBoardBattleEffect(true,liveAttacker,liveDefender);
    const capturedRole=liveDefender.role;
    if(capturedRole==='K'){state.board[pending.ty][pending.tx]=liveAttacker;state.board[pending.fy][pending.fx]=null;state.winner=liveAttacker.team;save();showGameOver(state.winner,`${charOf(liveAttacker).name}が王を撃破！`);render();return}
    if(state.handsMode==='on')state.hands[liveAttacker.team][capturedRole]=(state.hands[liveAttacker.team][capturedRole]||0)+1;notice.hidden=false;notice.textContent=`格闘勝利！ ${charOf(liveDefender).name}を捕獲`;state.board[pending.ty][pending.tx]=null;completeBoardMove(pending.fx,pending.fy,pending.tx,pending.ty,true);
  }else{
    showBoardBattleEffect(false,liveAttacker,liveDefender);
    notice.hidden=false;notice.textContent=`守備成功！ ${charOf(liveAttacker).name}は元のマスへ戻ります`;setTimeout(()=>{notice.hidden=true},1800);state.turn=other(state.turn);clearSelection();cpuBusy=false;render();
  }
}
function showGameOver(team,text){document.getElementById('gameOverTitle').textContent=`${TEAMS[team].label} 勝利！`;document.getElementById('gameOverText').textContent=text;gameOverModal.hidden=false}

function cpuActions(){
  const actions=[];
  const n=boardSize(),cfg=difficultyConfig();
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const p=state.board[y][x];if(!p||p.team!=='devil')continue;
    for(const m of movesFor(x,y)){
      const target=state.board[m.y][m.x];let score=Math.random()*cfg.noise;
      if(target)score+=ROLE_VALUE[target.role]*cfg.captureMul + (target.role==='K'?50000:0);
      score+=(m.y-y)*6;
      if(canPromote(p,y,m.y))score+=cfg.promoBonus;
      if(p.role==='K'&&target==null)score-=20;
      actions.push({type:'move',fx:x,fy:y,tx:m.x,ty:m.y,score});
    }
  }
  for(const role of ['R','B','G','S','N','L','P']){
    if(!state.hands.devil[role])continue;
    for(const m of dropMoves(role,'devil')){
      let score=20+Math.random()*cfg.noise;score+=(m.y-(n-1)/2)*3;if(role==='R'||role==='B')score+=20;
      actions.push({type:'drop',role,tx:m.x,ty:m.y,score});
    }
  }
  return actions;
}
function scheduleCpuIfNeeded(){
  clearTimeout(cpuTimer);if(state.winner||state.turn!=='devil'||cpuBusy||!promoModal.hidden||!battleLoading.hidden)return;
  cpuBusy=true;turnBanner.textContent='悪魔軍 CPU 思考中…';
  cpuTimer=setTimeout(cpuPlay,difficultyConfig().think);
}
function cpuPlay(){
  if(state.winner||state.turn!=='devil'){cpuBusy=false;return}
  const actions=cpuActions();if(!actions.length){state.winner='angel';cpuBusy=false;showGameOver('angel','悪魔軍に指せる手がありません。');render();return}
  actions.sort((a,b)=>b.score-a.score);const pool=actions.slice(0,Math.min(difficultyConfig().pool,actions.length));const action=pool[Math.floor(Math.random()*pool.length)];
  if(action.type==='drop'){
    state.board[action.ty][action.tx]=mk('devil',action.role,false);state.hands.devil[action.role]--;finishTurn(`CPUが${ROLE_LABEL[action.role]}を打ちました`);return;
  }
  attemptMove(action.fx,action.fy,action.tx,action.ty);
}

function clearRuntime(){clearTimeout(cpuTimer);clearTimeout(resultEffectTimer);boardResultEffect.hidden=true;sessionStorage.removeItem('frogShogiPendingMove');sessionStorage.removeItem('mixBattleResult');sessionStorage.removeItem('mixBattle');cpuBusy=false;clearSelection();notice.hidden=true;battleLoading.hidden=true;promoModal.hidden=true;gameOverModal.hidden=true;updateInfo(null)}
function startNewGame(){clearRuntime();localStorage.removeItem('waterFrogShogiState');try{localStorage.setItem('kaeru_difficulty',setupChoice.difficulty)}catch(e){}state=freshState(setupChoice);startModal.hidden=true;render()}
function openSetup(){clearTimeout(cpuTimer);cpuBusy=false;startModal.hidden=false;syncSetupButtons()}
function syncSetupButtons(){document.querySelectorAll('[data-difficulty]').forEach(b=>b.classList.toggle('selected',b.dataset.difficulty===setupChoice.difficulty));document.querySelectorAll('[data-stage]').forEach(b=>b.classList.toggle('selected',b.dataset.stage===setupChoice.stage));document.querySelectorAll('[data-hands]').forEach(b=>b.classList.toggle('selected',b.dataset.hands===(setupChoice.stage==='standard'?'on':setupChoice.hands)));const locked=setupChoice.stage==='standard';document.querySelectorAll('[data-hands]').forEach(b=>b.disabled=locked);const note=document.getElementById('handsNote');if(note)note.textContent=locked?'標準盤は「あり」固定です。':'変則ステージは「なし」推奨。ありにもできます。'}
document.querySelectorAll('[data-difficulty]').forEach(b=>b.addEventListener('click',()=>{setupChoice.difficulty=b.dataset.difficulty;syncSetupButtons()}));
document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{setupChoice.stage=b.dataset.stage;if(setupChoice.stage!=='standard'&&setupChoice.hands==='auto')setupChoice.hands='off';syncSetupButtons()}));
document.querySelectorAll('[data-hands]').forEach(b=>b.addEventListener('click',()=>{if(setupChoice.stage==='standard')return;setupChoice.hands=b.dataset.hands;syncSetupButtons()}));
startGameBtn.onclick=startNewGame;
document.getElementById('resetBtn').onclick=()=>{if(confirm('対局設定に戻って最初から始めますか？'))openSetup()};
document.getElementById('gameOverReset').onclick=openSetup;

state=load();
if(state){setupChoice={difficulty:state.difficulty||'normal',stage:state.stage||'standard',hands:state.handsMode||'off'};applyBattleResult();updateInfo(null);render();}
else{state=freshState(setupChoice);updateInfo(null);render();localStorage.removeItem('waterFrogShogiState');openSetup()}
})();
