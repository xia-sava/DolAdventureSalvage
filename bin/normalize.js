#!/usr/local/bin/node

var _ = require('underscore');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var cst = {
  "type" : [
    "-", "史跡", "宗教建築", "歴史遺物", "宗教遺物", "美術品", "財宝", "化石",
    "植物", "虫類", "鳥類", "小型生物", "中型生物", "大型生物", "海洋生物",
    "港・集落", "地理", "天文",
  ],
  "skill" : [
    "補給", "操帆", "測量", "釣り", "酒宴", "駆除", "救助", "探索", "視認", "観察",
    "開錠", "採集", "調達", "行軍", "生存", "考古学", "宗教学", "財宝鑑定", "美術",
    "地理学", "生態調査", "生物学", "口説き", "機雷発見", "バイオリン演奏", "投てき術",
    "言語学", "サルベージ", "曳航", "罠", "航行技術",

    "天文学", "会計", "社交", "身体言語", "運用", "警戒", "逃走", "調理", "保管",
    "縫製", "鋳造", "工芸", "錬金術", "食料品取引", "調味料取引", "酒類取引",
    "嗜好品取引", "香料取引", "香辛料取引", "繊維取引", "織物取引", "染料取引",
    "雑貨取引", "医薬品取引", "鉱石取引", "工業品取引", "貴金属取引", "武具取引",
    "火器取引", "工芸品取引", "美術品取引", "宝石取引", "家畜取引", "商品知識", "管理技術",

    "操舵", "漕船", "回避", "接舷", "剣術", "応用剣術", "突撃", "銃撃", "戦術", "防御",
    "狙撃術", "収奪", "砲術", "水平射撃", "弾道学", "貫通", "速射", "修理", "造船", "統率",
    "機雷敷設", "応急処置", "疾病学", "外科医術", "消火", "見張り", "援軍要請",
    "海軍護衛要請", "兵器技術",

    "ケルト語", "英語", "オランダ語", "ドイツ語", "ノルド語", "スラブ諸語", "トルコ語",
    "ポルトガル語", "スペイン語", "フランス語", "イタリア語", "ラテン語", "ギリシャ語",
    "アラビア語", "ヘブライ語", "古代エジプト語", "ペルシャ語", "インド諸語", "スワヒリ語",
    "西アフリカ諸語", "マヤ諸語", "マラユ・タガログ語", "タイ・ビルマ語",
    "モン・クメール諸語", "ナワトル語", "オセアニア諸語", "ケチュア語", "北米諸語",
    "日本語", "中国語", "朝鮮語", "極北諸語",
  ],
  "nr_skill" : [
    "駆除", "観察", "バイオリン演奏",
    "逃走", "接舷", "疾病学", "援軍要請", "海軍護衛要請",

    "ケルト語", "英語", "オランダ語", "ドイツ語", "ノルド語", "スラブ諸語", "トルコ語",
    "ポルトガル語", "スペイン語", "フランス語", "イタリア語", "ラテン語", "ギリシャ語",
    "アラビア語", "ヘブライ語", "古代エジプト語", "ペルシャ語", "インド諸語", "スワヒリ語",
    "西アフリカ諸語", "マヤ諸語", "マラユ・タガログ語", "タイ・ビルマ語",
    "モン・クメール諸語", "ナワトル語", "オセアニア諸語", "ケチュア語", "北米諸語",
    "日本語", "中国語", "朝鮮語", "極北諸語",
  ],
  "place" : [
    "アテネ", "アデン", "アムステルダム", "アレクサンドリア", "イスタンブール",
    "ヴェネツィア", "カリカット", "ケープ", "ザンジバル", "サンジョルジュ", "サンティアゴ",
    "サントドミンゴ", "ジャカルタ", "ジェノヴァ", "ストックホルム", "セビリア", "チュニス",
    "ナポリ", "ポルトベロ", "マニラ", "マルセイユ", "リオデジャネイロ", "リスボン", "リマ",
    "ロンドン", "南米開拓地", "東南アジア開拓地", "堺", "安平", "漢陽", "杭州",
    "北米商界開拓街",
    "サンクトペテルブルク", "サンフランシスコ",
  ],
  "replacement": {
    "dtype": {
      "天文" : "地理",
    },
    "qtype": {
      "天体観測" : "釣り",
    },
    "skill": {
      "極北諸語" : "ノルド語",
      "天文学"   : "地理学",
      "北米諸語" : "マヤ諸語",
    },
    "place": {
      "サンクトペテルブルク" : "ストックホルム",
      "サンフランシスコ"     : "北米商界開拓街",
    },
  },
  "correction": {
    "type": {
      "遺跡"               : "史跡",
      "宗教遺跡"           : "宗教建築",
    },
    "skill": {
      "探検"               : "探索",
      "生態"               : "生態調査",
      "考古"               : "考古学",
      "宗教"               : "宗教学",
      "財宝"               : "財宝鑑定",
      "地理"               : "地理学",
      "生物"               : "生物学",
      "天文"               : "天文学",
      "西アフリカ語"       : "西アフリカ諸語",
      "マヤ語"             : "マヤ諸語",
      "モン・クメール語"   : "モン・クメール諸語",
      "オセアニア語"       : "オセアニア諸語",
      "北米語"             : "北米諸語",
      "極北語"             : "極北諸語",
    },
    "place": {
      "サンクトペテルブルグ" : "サンクトペテルブルク",
      "サンクトペテルグルク" : "サンクトペテルブルク",
      "中南米開拓地"         : "南米開拓地",
      "新大陸開拓地"         : "南米開拓地",
      "テルナーテ"           : "東南アジア開拓地",
      "アンボイナ"           : "東南アジア開拓地",
    },
  },
};
var csvformat = {
  DType:   0,
  target:  1,
  QType:   2,
  name:    3,
  desc:    4,
  place:   5,
  skill:   6,
  reward:  7,
  rank:    8,
  exp:     9,
  item:   10,
  jobcd:  11,
  added:  12,
  point:  13,
  exp2:   14,
  exp3:   15,
};

// 全角半角変換
var zen2han = function (v) {
  return v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

// よくある間違いは修正，エラーならマーキング
var correct = function (type, value) {
  if (_.indexOf(cst[type], value) < 0) {
    if (_.has(cst.correction[type], value)) {
      value = cst.correction[type][value];
    } else {
      value = "**" + value;
    }
  }
  return value;
};

var fragment = "";
process.stdin.on('data', function (chunk) {
  if (chunk == "") {
    return;
  }
  var linenum = 0;
  var lines = chunk.split("\n");
  lines[0] = fragment + lines[0];
  fragment = lines.pop();
  lines.forEach(function (line) {
    ++linenum;
    try {
      if (line.match(/^$|^format   ver|^database ver|^#|^\S*\t____DELETED_DATA____/)) {
        console.log(line);
        return;
      }

      var record = line.split("\t");
      var notes = {};

      // 発見物タイプ
      var dtype = record[csvformat.DType];
      record[csvformat.DType] = correct('type', dtype);
      if (_.has(cst.replacement.dtype, dtype)) {
        record[0] = cst.replacement.dtype[dtype];
        notes['発見物'] = [dtype];
      }

      // クエストタイプ
      var qtype = record[csvformat.QType];
      if (_.has(cst.replacement.qtype, qtype)) {
        record[csvformat.QType] = cst.replacement.qtype[qtype];
        notes['種別'] = [qtype];
      }

      // ランク
      record[csvformat.rank] = zen2han(record[csvformat.rank]);
      if (record[csvformat.rank] == '') {
        record[csvformat.rank] = "0";
      }
      if (! record[csvformat.rank].match(/^[0-9]+$/)) {
        record[csvformat.rank] = "**" + record[csvformat.rank];
      }

      // 陸地再調査報酬地図
      if (record[csvformat.desc].match(/(<調査報酬:(.+)>)/)) {
        notes['調査報酬'] = [RegExp.$2];
        record[csvformat.desc] = record[csvformat.desc].replace(RegExp.$1, '');
        record[csvformat.place] = 'ロンドン';
      }

      // スキル
      var skills = [];
      record[csvformat.skill] = zen2han(record[csvformat.skill]);
      if (record[csvformat.skill].match(/^([^,\s　、]+\d+)*[^,\s　、]+\d*$/)) {
        record[csvformat.skill] = record[csvformat.skill].replace(/(\d+)/g, "$1,").replace(/,$/, "");
      }
      _.each(record[csvformat.skill].split(/[,\s　、]/), function (v, k) {
        if (! v.match(/^(\D+)(\d*)$/)) {
          skills.push("**" + v);
          return;
        }
        var s = v.match(/^(\D+)(\d*)$/)[1];
        var r = v.match(/^(\D+)(\d*)$/)[2];
        if (s.match(/^(-|なし)$/)) {
          skills.push("-");
          return;
        }
        // よくある間違いは修正，エラーならマーキング
        s = correct('skill', s);
        // スキルランク有無
        if (_.indexOf(cst.nr_skill, s) >= 0 && r.length > 0) {
          r = '';
        } else if (_.indexOf(cst.nr_skill, s) < 0 && r.length == 0) {
          if (record[csvformat.QType] == "冒険クエ") {
            r = "**";
          } else {
            r = (record[csvformat.rank] > 0) ? record[csvformat.rank] : '';
          }
        }
        // 新スキル名置換
        if (_.has(cst.replacement.skill, s)) {
          if (!_.has(notes, 'スキル')) {
            notes['スキル'] = [];
          }
          notes['スキル'].push(s);
          s = cst.replacement.skill[s];
        }
        skills.push(s + r);
      });
      record[csvformat.skill] = skills.join(',');

      // 場所
      var places = [];
      _.each(record[csvformat.place].split(/[,\s　、]/), function (v) {
        if (v.match(/^-$/)) {
          places.push("-");
          return;
        }
        // よくある間違いは修正，エラーならマーキング
        v = correct('place', v);
        // 新街名置換
        if (_.has(cst.replacement.place, v)) {
          if (!_.has(notes, '場所')) {
            notes['場所'] = [];
          }
          notes['場所'].push(v);
          v = cst.replacement.place[v];
        }
        places.push(v);
      });
      record[csvformat.place] = places.join(',');

      // 置換情報メモを追加
      var note = _.map(notes, function (values, key) {
        return "(" + key + ":" + values.join(",") + ")";
      }).join(" ");
      if (note) {
        if (record[csvformat.desc] == '-') {
          record[csvformat.desc] = '';
        }
        record[csvformat.desc] += " " + note;
      }

      console.log(record.join("\t"));
    } catch (e) {
      console.error("Line: " + linenum + ":" + e);
      throw e;
    }
  });
});

process.stdin.on('end', function () {
});

