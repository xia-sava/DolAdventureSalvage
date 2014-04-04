# DolAdventureSalvage #

cookie@zephyros 氏が作成した，大航海時代 Online の発見物管理ツールです．


### (とりあえず) ###

DolAdventureSalvage ( http://www.geocities.jp/cookiezephyros/download.html ) の更新が停止して久しいので，
ゲーム内発見物の管理ができずプレイするモチベーションに支障を来たしているので，
とりあえずデータの追加だけでもして最新の状況を反映したいと思うます．


### 改善できないところ ###

以下の項目は，ソースコードを改変して再コンパイルしないと，新規追加対応できないっぽいです．

* 冒険請負港の追加
* クエスト追加日時の追加
* QuestType の追加（「レリック」とかそういうの）

### データファイル変更だけでできそうなこと ###

* 新規発見物の追加
* 新規獲得アイテム情報の追加
* 新規連クエ情報の追加

### 原理的には出来るけど情報が必要なもの ###

* 地図や遺跡発見物の獲得経験値等（だって Wiki に載ってないんだもん）

### 実用的かつデータも持ちたい ###

#### データ更新日 ####
データ更新日（「2012/09/20+α」みたいの）自体の追加は本体の再コンパイルが必要．
なので新規追加は全て 2012/09/20+α，つまり 2nd Age Chapter 1 のデータとしておく．

けど情報がどこにもないのも癪なのでひとまずデータファイルにコメントで日付を入れておく．

#### 発見物タイプ ####
発見物タイプ（「天文」とか）の追加も本体の再コンパイルが必要．
とりあえず以下のように設定しておき，説明欄に「(種別: ○○)」みたく記述しておく．
 * 天文 → 地理

#### クエストタイプ ####
クエストタイプ（「冒険クエ」とか）の追加も本体の再コンパイルが必要．
とりあえず以下のように設定しておき，説明欄に「(種別: ○○)」みたく記述しておく．
 * 天文 → 釣り

#### 請負場所 ####
請負場所（「サンクトペテルブルク」とか）の追加も本体の再コンパイルが必要．
とりあえず以下のように設定しておき，説明欄に「(場所: ○○)」みたく記述しておく．
 * サンクトペテルブルク → ストックホルム
 * トレジャーハント → ロンドン

#### 必要スキル ####
スキル名（「極北諸語」とか）の追加も本体の再コンパイルが必要．
とりあえず以下のように設定しておき，説明欄に「(スキル: ○○)」みたく記述しておく．
 * 極北諸語 → ノルド語
 * 天文学 → 地理学

#### レリック ####
レリックはシステム的には発見物としてカウントされていないけど，
やっぱ発見物的に管理したい……が DolAS ソースがないと追加は難しいので，
ひとまず「転職票」欄に追加する．
「レリック」で検索するとヒットするので，レリッククエ（発見物なし）の完・未完で管理できるのではないか．


