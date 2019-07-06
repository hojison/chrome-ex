if($(".TweetBoxExtras").length > 0){
  var COLNUM = 6;
  var ROWNUM = 3;
  var time = 0;
  var dispflg = false;
  var tableElem;
  var btnElem;
  var speed = 150;//カードをめくる速度
  var returnSec = 1000;  //めくったカードが元に戻る秒数
  //var cat = [];  //各カードの番号を格納する配列
  var index;  //クリックしたカード位置のインデックス
  var index1; //1枚目に引いたカード位置のインデックス
  var first = true;  //クリックしたカードが1枚目かどうかの判定用
  var card1;  //1枚目に引いたカードの番号
  var card2;  //2枚目に引いたカードの番号
  var pair = 0;  //正解したカードのペア数
  var cardNameList = [
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
//  console.log(cards);
  //神経衰弱ボタンの追加
  btnElem = $(".TweetBoxExtras .TweetBoxExtras-item:last").clone();
  btnElem.find('.Icon--geo').removeClass('Icon--geo').addClass('Icon--grid');
  btnElem.find('.text').html('神経衰弱で遊ぶYO！');
  btnElem.find('button')
    .removeClass('js-geo-search-trigger geo-picker-btn')
    .attr('data-original-title','神経衰弱で遊ぶZE☆')
    .click( function(){
      if(dispflg){
        tableElem.hide();
        dispflg = false;
      }
      else{
        tableElem.show();
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
  //        console.log();
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
            /*
            setTimeout(function(){
              cardClose(index,uraOpen);
              cardClose(index1,uraOpen);
            },returnSec);
            setTimeout(function(){
              unlock();
            },returnSec+speed*2);
            */
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
//      .addClass('Icon')
//.addClass('Icon Icon--grid')
      .appendTo(cardElem);
    }
  }
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
    console.log("cardClose: 133");
//    elem.find("Icon--grid").removeClass().addClass("Icon").stop().animate({ width: "0"}, speed,
    console.log("elem.find('.Icon--grid:'):"+elem.find(".Icon--grid").prop('outerHTML'));
    elem.find(".Icon").stop().animate({ width: "0"}, speed,
    function(){
      console.log("cardClose: 136");
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
  //選んだ2枚のカードの正否
  function comparison() {
    if(card1==card2){  //2枚が同じカードであれば
      getCardElem(index).addClass("off");  //2枚目のカードのクリック判定を無効に
      getCardElem(index1).addClass("off");  //1枚目のカードのクリック判定を無効に
      pair++;  //ペア数を1増やす
      if(pair == CARDKINDS){  //ペアが全て見つかったら
        setTimeout(function(){  //最後のカードがめくられた後にクリアー表示
          alert("お手つき多すぎ！\nたかが神経衰弱、そう思ってないですか？\nそれやったら明日も俺が勝ちますよ。\nほな、リツイートいただきます。")
        }, returnSec);
      }
    } else {  //2枚が違うカードであれば
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
