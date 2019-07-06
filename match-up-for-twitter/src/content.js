if($(".TweetBoxExtras").length > 0){
  var COLNUM = 6;//カードの列数
  var ROWNUM = 2;//カードの行数
  var dispflg = false;//神経衰弱画面表示フラグ
  var tableElem;//カードを並べるtable要素
  var btnElem;//神経衰弱開始のbutton要素
  var speed = 150;//カードをめくる速度
  var returnSec = 1000;  //めくったカードが元に戻る秒数
  var index;  //クリックしたカード位置のインデックス
  var index1; //1枚目に引いたカード位置のインデックス
  var first = true;  //クリックしたカードが1枚目かどうかの判定用
  var card1;  //1枚目に引いたカードの番号
  var card2;  //2枚目に引いたカードの番号
  var pair = 0;  //正解したカードのペア数

  var sec = 0;//タイマーの秒
  var min = 0;//タイマーの分
  var hour = 0;//タイマーの時間
  var timer = null;//ゲーム時間計測処理用
  var mistakeCnt = 0;//お手つきカウンタ

  var cardNameList = [//カードの絵柄に使うアイコン名リスト
    'attachFile',
    'balloon',
    'audioBadge',
    'bird',
    'cameraPlus',
    'cards',
    'cart',
    'circleActiveHeart',
    'clock',
    'cog',
    'crescent',
    'delete',
    'follow',
    'editPencil',
    'promotedTrend',
    'protected',
    'smileRating5',
    'soundOn',
    'top',
    'translator',
    'truck',
    'laptop'
  ];;
  function countup(){
    sec += 1;
    if (sec > 59) {
      sec = 0;
      min += 1;
    }

    if (min > 59) {
      min = 0;
      hour += 1;
    }

    // 0埋め
    let sec_number = ('0' + sec).slice(-2);
    let min_number = ('0' + min).slice(-2);
    let hour_number = ('0' + hour).slice(-2);

    $(".TweetBoxExtras").find(".game-timer").text(hour_number + ':' +  min_number + ':' + sec_number);
  }
  if(COLNUM % 2 == 1 && ROWNUM % 2 == 1){//カードの総数が奇数にならない為の調整
    COLNUM++;
  }
  var CARDTOTAL = COLNUM*ROWNUM;//カードの総枚数
  var CARDKINDS = CARDTOTAL/2;//カードの種類の総数
  var cards = Array(CARDTOTAL);
  for(let i = 0; i < cards.length;i++){
    cards[i] = Math.floor(i/2);
  }
  cards.shuffle = function(){//カード配列のシャッフル
    for(let i = this.length - 1; i > 0; i--){
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = this[i];
      this[i] = this[r];
      this[r] = tmp;
    }
  }
  cards.shuffle();
  //神経衰弱ボタンの追加
  btnElem = $(".TweetBoxExtras .TweetBoxExtras-item:last").clone();
  btnElem.find('.Icon--geo').removeClass('Icon--geo').addClass('Icon--grid');
  btnElem.find('.text').html('神経衰弱で遊ぶ');
  btnElem.find('button')
    .removeClass('js-geo-search-trigger geo-picker-btn')
    .attr('data-original-title','神経衰弱で遊ぶ')
    .click( function(){
      if(dispflg){
        tableElem.hide();
        gameUI.hide();
        dispflg = false;
      }
      else{
        if(timer == null){
          timer = setInterval(countup,1000);
        }
        tableElem.show();
        gameUI.show();
        dispflg = true;
      }
    });
  btnElem.appendTo(".TweetBoxExtras");

  //カードを並べる部分
  tableElem = $("<table>").appendTo(".TweetBoxExtras");
  tableElem
  .css({"border-collapse":"separate",
        "border-spacing":"5px"})
  .addClass("match-up-game");
  for(let i = 0; i < ROWNUM; i++){
    let row = $("<tr>").appendTo(tableElem);
    row.addClass("cards-row-" + i);
    for(let j = 0; j < COLNUM; j++){
      let idx = i*COLNUM+j;
      let cardElem = $("<td>")
      .css({
            'width':'52px',
            'height':'62px'})
      .addClass("card card-"+idx)
      .appendTo(row);
//      cardElem = $($('<span>')).appendTo(cardElem);
      cardElem = $($('<button>'))
      .attr('type','button')
      .css({//'background-color':'rgba(255,64,64,0.8)',
            'border':'2px solid #888',
            'border-radius':'3px',
            'background-color':'#f8f8f8',
            'position':'relative',
            'padding':'0px',
            'height':'68px'})//,
      .appendTo(cardElem)
      .off("click").on("click", function(){
        if(!(getCardElem(idx).hasClass("lock")) && !(getCardElem(idx).hasClass("off"))){//ロック中 || ペア発見済みは無効に
          console.log("index = "+idx);
          index = idx;  //選択したカードの順番をindexに保存
          cardlock();  //選択したカードのクリックを無効にする関数
          cardClose(index,omoteOpen);  //カードを閉じ、表面を開く関数
          if(first == true){  //選択したカードが1枚目であれば
            index1 = index;  //カードの順番をindex1に保存
            card1= cards[index];  //並び順を基に表面の番号を配列から取り出しcard1に保存
            first = false;  //1枚目かどうかの判定を無効に
       
          } else {  //選択したカードが2枚目であれば
            alllock();
            card2 = cards[index];  //並び順を基に表面の番号を配列から取り出しcard2に保存
            comparison();  //card1とcard2を比べて正否の判定をする関数
            first = true;
          }
        }
      });
      cardElem.addClass('icon-btn');
      cardElem = $($('<span>'))
      .css({
        'padding-top':'6px',
        'width':'48px',
        'height':'36px',
        'background-color':'rgba(255,64,64,0.8)',
        'color':'white'
      })
      .addClass('Icon Icon--grid')
      .appendTo(cardElem);
    }
  }
  let gameUI = $("<div>")
  .appendTo(".TweetBoxExtras")
  .addClass("gameUI")
  .css({
    'text-align':'center',
    'width':'347px'
  });
  $("<span>") //タイマー表示
  .appendTo(gameUI)
  .addClass("game-timer Icon Icon--clock")
  .text("00:00:00")
  .css({
    'color':'rgba(255,64,64,0.8)',
    'font-weight':'bold',
    'margin':'10px 30px',
    'line-height':'20px',
    'display':'inline-block'
  });
  $("<span>") //お手付き表示
  .appendTo(gameUI)
  .addClass("mistakes Icon Icon--close")
  .text("0")
  .css({
    'color':'rgba(255,64,64,0.8)',
    'font-weight':'bold',
    'margin':'10px 30px',
    'line-height':'20px',
    'display':'inline-block'
  });
  $("<button>") //リトライボタン
  .attr('type','button')
  .appendTo(gameUI)
  .addClass("retrybtn EdgeButton EdgeButton--primary")
  .text("リトライ")
  .css({
//    'color':'rgba(255,64,64,0.8)',
//    'font-weight':'bold',
    'margin':'10px 30px',
    'vertical-align':'8px',
    'line-height':'20px'
  })
  .off("click").on("click", function(){
    $(".match-up-game").find(".card").each(function(i,elmName){
      let elem = $(elmName).find("button");
      elem.removeClass("off");
      if(!(elem.hasClass("Icon--grid"))){//めくったカードを裏返す処理
        cardClose(i,uraOpen);
      }
    });
    alllock();
    setTimeout(function(){//カードの裏返しが終わってからシャッフル
      cards.shuffle();
      unlock();
    },returnSec+speed);      
    sec = -1;
    min = 0;
    hour = 0;
    mistakeCnt = 0;
    pair = 0;
    updateMistakes();
    if(timer != null){
      clearInterval(timer);
    }
    countup();
    timer = setInterval(countup,1000);
    unlock();
});
  
  gameUI.hide();
  tableElem.hide();//ボタンを押すまでは非表示

/**********************************
  アニメーション関数
***********************************/
  function getCardElem(i){//
    console.log("getCardElem("+i+")");
    return $(".match-up-game").find(".card-"+i).find("button");
  }
  //カードを閉じる
  function cardClose(i,callback){
    let elem = getCardElem(i);
    elem.stop().animate({ "left": "26"}, speed);
//    elem.children("span").animate({ left: "26"}, speed);
//    elem.find("Icon--grid").removeClass().addClass("Icon").stop().animate({ width: "0"}, speed,
    console.log("elem.find('.Icon--grid:'):"+elem.find(".Icon--grid").prop('outerHTML'));
    elem.find(".Icon").stop().animate({ width: "0"}, speed,
    function(){
      callback(i);
    });
  }
  //表面を開く
  function omoteOpen(){
    console.log("omoteOpen: index = "+index);
    let elem = getCardElem(index);
    elem.find(".Icon").removeClass("Icon--grid").addClass("Icon--"+cardNameList[cards[index]]);
    elem.find(".Icon")
    .css({
      'background-color':'#f8f8f8',
      'color':'rgba(255,64,64,0.8)'
    })
    .stop().animate({ width: "48px"}, speed);
    elem.stop().animate({ "left": "0"}, speed);
  }
  //裏面を開く
  function uraOpen(j){
    let elem = getCardElem(j);
    elem.find(".Icon").removeClass("Icon--"+cardNameList[cards[j]]).addClass("Icon--grid");
    elem.find(".Icon")
    .css({
      'background-color':'rgba(255,64,64,0.8)',
      'color':'white'
    })
    .stop().animate({ width: "48px"}, speed);
    elem.stop().animate({ left: "0"}, speed);
  }
   
  //クリックできないようにカードをロック
  function cardlock(){
    console.log("cardlock:index = ("+index+")");
    getCardElem(index).addClass("lock");
  }
  //全てのカードをロック
  function alllock(){
    return $(".match-up-game").find("button").addClass("lock");
  }
  //全てのカードをアンロック
  function unlock(){
    return $(".match-up-game").find("button").removeClass("lock");
  }
  function updateMistakes(){
    $(".TweetBoxExtras").find(".mistakes").text(mistakeCnt+"");
  }
  //選んだ2枚のカードの正否
  function comparison() {
    console.log("card1:"+card1+", card2: "+card2);
    if(card1==card2){  //2枚が同じカードであれば
      getCardElem(index).addClass("off");  //2枚目のカードのクリック判定を無効に
      getCardElem(index1).addClass("off");  //1枚目のカードのクリック判定を無効に
      pair++;  //ペア数を1増やす
      if(pair == CARDKINDS){  //ペアが全て見つかったら
        setTimeout(function(){  //最後のカードがめくられた後にクリアー表示
          clearInterval(timer);
          if(mistakeCnt == 0){
            alert("ノーミスとか怖っ！エスパーか！");            
          }
          else if(mistakeCnt < CARDKINDS/2){
            alert("やりますねぇ！");
          }
          else{
            alert("お手つき多すぎ！\nたかが神経衰弱、そう思ってないですか？\nそれやったら明日も俺が勝ちますよ。\nほな、リツイートいただきます。")            
          }
        }, returnSec);
      }
    } else {  //2枚が違うカードであれば
      mistakeCnt++;
      updateMistakes();
      setTimeout(function(){  //returnSecミリ秒後（カードをめくる動作が終わった後）に
          cardClose(index,uraOpen);  //2枚目のカードを裏面に戻す
          cardClose(index1,uraOpen);  //1枚目のカードを裏面に戻す
      }, returnSec);
    }
    first = true;  //1枚目かどうかの判定を有効に
    card2 = 0;  //2枚目のカードの並び順をリセット
    setTimeout(function(){
      unlock();  //全てのカードの.lockを削除
    }, returnSec+speed*2);
  }
}
