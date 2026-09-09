(()=>{
'use strict';
const ROLE_LABEL={K:'王',R:'飛',B:'角',G:'金',S:'銀',N:'桂',L:'香',P:'歩'};
const ROLE_NAME={K:'王将',R:'飛車',B:'角行',G:'金将',S:'銀将',N:'桂馬',L:'香車',P:'歩兵'};
const PROMO_LABEL={R:'龍',B:'馬',S:'全',N:'圭',L:'杏',P:'と'};
const TEAMS={
  angel:{label:'天使軍',promotionPawn:'kawazu',roles:{K:'seraphiel',R:'jihal',B:'yellow',G:'orange',S:'green',N:'blue',L:'remiel',P:'mobAngel'}},
  devil:{label:'悪魔軍',promotionPawn:'kokabiel',roles:{K:'satanael',R:'flauros',B:'beelzebub',G:'samael',S:'black',N:'purple',L:'sariel',P:'mobDevil'}}
};
const CHAR={
 seraphiel:{name:'セラフィエルさん',body:'#f5f1df',eye:'#fff9d5',iris:'#ffd85c',skills:['セラフィックアッパー','セラフィックレイ','セラフィックキック']},
 jihal:{name:'ジィハルさん',body:'#244f78',eye:'#f1d64e',iris:'#17364f',skills:['雷','ライトニングダッシュ','ボルトショット']},
 yellow:{name:'ラファエルさん',body:'#e3cf42',eye:'#f2df66',iris:'#26351c',skills:['水圧カッター','ヒーリングバブル','高速バブル移動']},
 orange:{name:'ウリエルさん',body:'#ef8c36',eye:'#f6a24e',iris:'#26321d',skills:['ホワイトカウンター','ガーディアンタックル','ホワイトリーチ']},
 green:{name:'ミカエルさん',body:'#35d851',eye:'#69e86e',iris:'#173126',skills:['バーニングアッパー','バーニングキック','バーニングサイクロン']},
 blue:{name:'ガブリエルさん',body:'#35bde6',eye:'#63d9f5',iris:'#15362f',skills:['アクアトルネード','アクアストリーム','アクアボルテックス']},
 remiel:{name:'レミエルさん',body:'#87b7c9',eye:'#bfe6ee',iris:'#5d8fa8',skills:['ミラージュ','アクアパリィ','フロストショット']},
 kawazu:{name:'カワズさん',body:'#1ad248',eye:'#2fd451',iris:'#191919',skills:['成り歩専用ファイター','スピンキックカッター','水中格闘の技を使用']},
 satanael:{name:'サタナエルさん',body:'#690b1b',eye:'#16090c',iris:'#ff352e',skills:['ディザスターフレア','ダークレイ','インフェルノウェーブ']},
 flauros:{name:'フラウロスさん',body:'#e20b22',eye:'#ff3326',iris:'#f4c542',skills:['ヘルフレイム','フレイムクロー','レオパードラッシュ']},
 beelzebub:{name:'ベルゼブブさん',body:'#17121d',eye:'#35ff00',iris:'#b7e234',skills:['ヴェノム・ウォーター','アビスショック','ベノムショット']},
 samael:{name:'サマエルさん',body:'#2b193d',eye:'#7760be',iris:'#d9f7ff',skills:['ポイズンゲート','ヴェノムタン','毒系必殺技']},
 black:{name:'ルシファーさん',body:'#3b3e47',eye:'#50545f',iris:'#101010',skills:['ヘルクラッシュ','アビスチャージ','アイスショット']},
 purple:{name:'リリスさん',body:'#f24ca5',eye:'#ff66b8',iris:'#111',skills:['舌ラッシュ','バブルショット','バックスピンキック']},
 sariel:{name:'サリエルさん',body:'#5d6488',eye:'#d8ddf5',iris:'#991126',skills:['ルナ・スラッシュ','イーブルアイ','ブラッドムーン']},
 kokabiel:{name:'コカビエルさん',body:'#20263f',eye:'#63dbe7',iris:'#202738',skills:['成り歩専用ファイター','グラビティボール','メテオレイン']},
 mobAngel:{name:'天使軍モブさん',body:'#70d7c9',eye:'#a5efe6',iris:'#17443d',skills:['歩兵の基本攻撃','接近戦','成るとカワズさん']},
 mobDevil:{name:'悪魔軍モブさん',body:'#7b4966',eye:'#b47a99',iris:'#23151e',skills:['歩兵の基本攻撃','接近戦','成るとコカビエルさん']}
};
const boardEl=document.getElementById('board'), turnBanner=document.getElementById('turnBanner');
const angelHandEl=document.getElementById('angelHand'),devilHandEl=document.getElementById('devilHand');
const notice=document.getElementById('battleNotice');
const info={portrait:document.getElementById('piecePortrait'),name:document.getElementById('pieceName'),role:document.getElementById('pieceRole'),skills:document.getElementById('skillList')};
const promoModal=document.getElementById('promotionModal'),promoText=document.getElementById('promotionText');
const gameOverModal=document.getElementById('gameOverModal');
let state,selected=null,legal=[],selectedHand=null,pendingMove=null;
function other(t){return t==='angel'?'devil':'angel'}
function mk(team,role,promoted=false){return{team,role,promoted}}
function initialBoard(){
 const b=Array.from({length:9},()=>Array(9).fill(null));
 const back=['L','N','S','G','K','G','S','N','L'];
 back.forEach((r,x)=>b[0][x]=mk('devil',r)); b[1][1]=mk('devil','R'); b[1][7]=mk('devil','B'); for(let x=0;x<9;x++)b[2][x]=mk('devil','P');
 back.forEach((r,x)=>b[8][x]=mk('angel',r)); b[7][7]=mk('angel','R'); b[7][1]=mk('angel','B'); for(let x=0;x<9;x++)b[6][x]=mk('angel','P');
 return b;
}
function freshState(){return{board:initialBoard(),turn:'angel',hands:{angel:{R:0,B:0,G:0,S:0,N:0,L:0,P:0},devil:{R:0,B:0,G:0,S:0,N:0,L:0,P:0}},winner:null,lastMessage:'天使軍の手番'}}
function save(){localStorage.setItem('waterFrogShogiState',JSON.stringify(state))}
function load(){try{const s=JSON.parse(localStorage.getItem('waterFrogShogiState')||'null');return s&&s.board?s:freshState()}catch(e){return freshState()}}
function fighterType(piece){if(piece.role==='P'&&piece.promoted)return TEAMS[piece.team].promotionPawn;return TEAMS[piece.team].roles[piece.role]}
function charOf(piece){return CHAR[fighterType(piece)]||CHAR.mobAngel}
function tokenHTML(piece,small=false){const c=charOf(piece),label=piece.promoted?(PROMO_LABEL[piece.role]||ROLE_LABEL[piece.role]):ROLE_LABEL[piece.role];return `<div class="frog-token${small?' preview':''}" style="--body:${c.body};--eye:${c.eye};--iris:${c.iris}"><span class="role-kanji">${label}</span>${piece.promoted?'<span class="promoted-badge">成</span>':''}</div>`}
function updateInfo(piece){if(!piece){info.name.textContent='駒を選択';info.role.textContent='動けるマスと技表をここに表示します';info.skills.innerHTML='';info.portrait.removeAttribute('style');return}const c=charOf(piece);info.portrait.style.setProperty('--body',c.body);info.portrait.style.setProperty('--eye',c.eye);info.portrait.style.setProperty('--iris',c.iris);info.name.textContent=c.name;const label=piece.promoted?(PROMO_LABEL[piece.role]||ROLE_LABEL[piece.role]):ROLE_LABEL[piece.role];info.role.textContent=`${TEAMS[piece.team].label} / ${label}（${ROLE_NAME[piece.role]}${piece.promoted?'・成':''}）`;info.skills.innerHTML=c.skills.map(s=>`<div class="skill">${s}</div>`).join('')}
function inBounds(x,y){return x>=0&&x<9&&y>=0&&y<9}
function pathMoves(x,y,dirs,piece){const out=[];for(const [dx,dy] of dirs){let nx=x+dx,ny=y+dy;while(inBounds(nx,ny)){const q=state.board[ny][nx];if(!q)out.push({x:nx,y:ny});else{if(q.team!==piece.team)out.push({x:nx,y:ny,capture:true});break}nx+=dx;ny+=dy}}return out}
function stepMoves(x,y,dirs,piece){const out=[];for(const [dx0,dy0] of dirs){const dir=piece.team==='angel'?-1:1;const dx=dx0,dy=dy0*dir,nx=x+dx,ny=y+dy;if(!inBounds(nx,ny))continue;const q=state.board[ny][nx];if(!q||q.team!==piece.team)out.push({x:nx,y:ny,capture:!!q})}return out}
function movesFor(x,y){const p=state.board[y][x];if(!p)return[];const gold=[[0,1],[-1,1],[1,1],[-1,0],[1,0],[0,-1]];if(p.promoted&&['P','L','N','S'].includes(p.role))return stepMoves(x,y,gold,p);if(p.role==='K')return stepMoves(x,y,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]],p);if(p.role==='G')return stepMoves(x,y,gold,p);if(p.role==='S')return stepMoves(x,y,[[-1,1],[0,1],[1,1],[-1,-1],[1,-1]],p);if(p.role==='N')return stepMoves(x,y,[[-1,2],[1,2]],p);if(p.role==='P')return stepMoves(x,y,[[0,1]],p);if(p.role==='L'){const dy=p.team==='angel'?-1:1;return pathMoves(x,y,[[0,dy]],p)}if(p.role==='R'){let o=pathMoves(x,y,[[1,0],[-1,0],[0,1],[0,-1]],p);if(p.promoted)o=o.concat(stepMoves(x,y,[[1,1],[-1,1],[1,-1],[-1,-1]],p));return o}if(p.role==='B'){let o=pathMoves(x,y,[[1,1],[-1,1],[1,-1],[-1,-1]],p);if(p.promoted)o=o.concat(stepMoves(x,y,[[1,0],[-1,0],[0,1],[0,-1]],p));return o}return[]}
function dropMoves(role,team){const out=[];for(let y=0;y<9;y++)for(let x=0;x<9;x++){if(state.board[y][x])continue;if((role==='P'||role==='L')&&((team==='angel'&&y===0)||(team==='devil'&&y===8)))continue;if(role==='N'&&((team==='angel'&&y<=1)||(team==='devil'&&y>=7)))continue;if(role==='P'){let same=false;for(let yy=0;yy<9;yy++){const p=state.board[yy][x];if(p&&p.team===team&&p.role==='P'&&!p.promoted){same=true;break}}if(same)continue}out.push({x,y,drop:true})}return out}
function canPromote(piece,fromY,toY){if(piece.promoted||!['R','B','S','N','L','P'].includes(piece.role))return false;const inZone=y=>piece.team==='angel'?y<=2:y>=6;return inZone(fromY)||inZone(toY)}
function mustPromote(piece,toY){if(piece.role==='P'||piece.role==='L')return piece.team==='angel'?toY===0:toY===8;if(piece.role==='N')return piece.team==='angel'?toY<=1:toY>=7;return false}
function render(){boardEl.innerHTML='';for(let y=0;y<9;y++)for(let x=0;x<9;x++){const cell=document.createElement('button');cell.className='cell';if(y<=2||y>=6)cell.classList.add('promo-zone');cell.dataset.x=x;cell.dataset.y=y;if(selected&&selected.x===x&&selected.y===y)cell.classList.add('selected');const l=legal.find(m=>m.x===x&&m.y===y);if(l)cell.classList.add(l.drop?'drop':l.capture?'capture':'legal');const p=state.board[y][x];if(p){const wrap=document.createElement('div');wrap.className=`piece ${p.team}`;wrap.innerHTML=tokenHTML(p);cell.appendChild(wrap)}cell.addEventListener('click',()=>onCell(x,y));boardEl.appendChild(cell)}renderHands();turnBanner.textContent=state.winner?`${TEAMS[state.winner].label}の勝利！`:`${TEAMS[state.turn].label}の手番`;turnBanner.style.boxShadow=state.turn==='angel'?'inset 0 0 0 2px rgba(255,235,130,.45)':'inset 0 0 0 2px rgba(255,90,110,.45)';save()}
function renderHands(){for(const team of ['angel','devil']){const el=team==='angel'?angelHandEl:devilHandEl;el.innerHTML='';for(const role of ['R','B','G','S','N','L','P']){const n=state.hands[team][role]||0;if(!n)continue;const b=document.createElement('button');b.className='hand-piece'+(selectedHand&&selectedHand.team===team&&selectedHand.role===role?' selected':'');b.innerHTML=`<span>${ROLE_LABEL[role]}</span><span class="hand-count">×${n}</span>`;b.addEventListener('click',()=>selectHand(team,role));el.appendChild(b)}if(!el.children.length)el.innerHTML='<span class="hand-count">持ち駒なし</span>'}}
function clearSelection(){selected=null;selectedHand=null;legal=[]}
function selectHand(team,role){if(state.winner||team!==state.turn||!state.hands[team][role])return;selected=null;selectedHand={team,role};legal=dropMoves(role,team);updateInfo(mk(team,role));render()}
function onCell(x,y){if(state.winner)return;const p=state.board[y][x];const target=legal.find(m=>m.x===x&&m.y===y);if(selectedHand&&target){state.board[y][x]=mk(state.turn,selectedHand.role,false);state.hands[state.turn][selectedHand.role]--;finishTurn(`${TEAMS[state.turn].label}が${ROLE_LABEL[selectedHand.role]}を打ちました`);return}if(selected&&target){attemptMove(selected.x,selected.y,x,y);return}if(p&&p.team===state.turn){selected={x,y};selectedHand=null;legal=movesFor(x,y);updateInfo(p);render();return}clearSelection();if(p)updateInfo(p);render()}
function attemptMove(fx,fy,tx,ty){const attacker=state.board[fy][fx],defender=state.board[ty][tx];if(defender){pendingMove={fx,fy,tx,ty,attacker:{...attacker},defender:{...defender}};launchBattle(pendingMove);return}completeBoardMove(fx,fy,tx,ty,false)}
function completeBoardMove(fx,fy,tx,ty,wasCapture){const p=state.board[fy][fx];state.board[fy][fx]=null;state.board[ty][tx]=p;const after=()=>finishTurn(`${charOf(p).name} が ${ROLE_LABEL[p.role]}を進めました`);if(mustPromote(p,ty)){p.promoted=true;after();return}if(canPromote(p,fy,ty)){pendingMove={type:'promotionOnly',piece:p,after};promoText.textContent=`${charOf(p).name}（${ROLE_NAME[p.role]}）を成らせますか？`;promoModal.hidden=false;return}after()}
function finishTurn(msg){notice.hidden=false;notice.textContent=msg;setTimeout(()=>{notice.hidden=true},1500);state.turn=other(state.turn);clearSelection();render()}
function launchBattle(m){const attacker=m.attacker,defender=m.defender;sessionStorage.removeItem('mixBattleResult');sessionStorage.setItem('frogShogiPendingMove',JSON.stringify(m));sessionStorage.setItem('mixBattle',JSON.stringify({mode:'shogi',source:'water-frog-shogi',playerRole:'attacker',attacker:'shogi-attacker',defender:'shogi-defender',attackerType:fighterType(attacker),defenderType:fighterType(defender),attackerHp:100,defenderHp:33,returnUrl:'index.html'}));save();location.href='water-fighter.html?mix=1&battle=1&shogi=1'}
function applyBattleResult(){let result=null,pending=null;try{result=JSON.parse(sessionStorage.getItem('mixBattleResult')||'null');pending=JSON.parse(sessionStorage.getItem('frogShogiPendingMove')||'null')}catch(e){}if(!result||!pending)return;sessionStorage.removeItem('mixBattleResult');sessionStorage.removeItem('frogShogiPendingMove');const liveAttacker=state.board[pending.fy]?.[pending.fx],liveDefender=state.board[pending.ty]?.[pending.tx];if(!liveAttacker||!liveDefender)return;if(result.winner==='attacker'){const capturedRole=liveDefender.role;if(capturedRole==='K'){state.board[pending.ty][pending.tx]=liveAttacker;state.board[pending.fy][pending.fx]=null;state.winner=liveAttacker.team;save();showGameOver(state.winner,`${charOf(liveAttacker).name}が王を撃破！`);render();return}state.hands[liveAttacker.team][capturedRole]=(state.hands[liveAttacker.team][capturedRole]||0)+1;notice.hidden=false;notice.textContent=`格闘勝利！ ${charOf(liveDefender).name}を捕獲`;state.board[pending.ty][pending.tx]=null;completeBoardMove(pending.fx,pending.fy,pending.tx,pending.ty,true)}else{notice.hidden=false;notice.textContent=`守備成功！ ${charOf(liveAttacker).name}は元のマスへ戻ります`;setTimeout(()=>{notice.hidden=true},2000);state.turn=other(state.turn);clearSelection();render()}}
function showGameOver(team,text){document.getElementById('gameOverTitle').textContent=`${TEAMS[team].label} 勝利！`;document.getElementById('gameOverText').textContent=text;gameOverModal.hidden=false}
document.getElementById('promoteYes').onclick=()=>{if(pendingMove?.type==='promotionOnly'){pendingMove.piece.promoted=true;promoModal.hidden=true;const fn=pendingMove.after;pendingMove=null;fn()}};
document.getElementById('promoteNo').onclick=()=>{if(pendingMove?.type==='promotionOnly'){promoModal.hidden=true;const fn=pendingMove.after;pendingMove=null;fn()}};
function resetAll(){localStorage.removeItem('waterFrogShogiState');sessionStorage.removeItem('frogShogiPendingMove');sessionStorage.removeItem('mixBattleResult');state=freshState();clearSelection();notice.hidden=true;gameOverModal.hidden=true;updateInfo(null);render()}
document.getElementById('resetBtn').onclick=()=>{if(confirm('盤面を最初からやり直しますか？'))resetAll()};document.getElementById('gameOverReset').onclick=resetAll;
state=load();applyBattleResult();updateInfo(null);render();
})();
