#!/usr/local/bin/node

var sys = require('sys');

// npm install request cheerio iconv
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv');

// check argv
if (process.argv.length <= 2) {
    sys.puts('Usage: node wikiextract.js <URL>');
    process.exit(1);
}

// scrape
request(
    {
        uri:      process.argv[2],
        encoding: null,
    },
    function (error, response, body) {
        var conv = new iconv.Iconv('EUC-JP', 'UTF-8//TRANSLIT//IGNORE');
        var $ = cheerio.load(conv.convert(body).toString());

        //var added = $("li:contains('ここでは')").text().match(/ここでは(\d+)年(\d+)月(\d+)日のアップデートにおいて/) ?
        //    RegExp.$1 + '/' + RegExp.$2 + '/' + RegExp.$3 + '+α' : '';
        var added = '2012/09/20+α';

        // 地図
        $("td").filter(function () {return $(this).text() == '書庫';}).closest('table').find('tbody > tr').each(function () {
            var place = $('<div/>').html($(this).children(0).html().replace(/<br class="spacer">/g, ',')).text();
            var name   = $(this).children(1).text();
            var desc   = $(this).children(2).text();
            var skill  = $(this).children(3).text().replace(/[ 　・]/g, ',');
            var rank   = $(this).children(4).text();
            var target = $(this).children(5).text();
            var QType  = $(this).parent().parent().parent().prev().children('a:first-child').text();
            var url   = $(this).children(1).children('a').attr('href');
            if (url) {
                request(
                    {
                        uri:      url,
                        encoding: null,
                    },
                    function (error, response, body) {
                      var $ = cheerio.load(conv.convert(body).toString());
                      var rank   = $("th:contains('難易度') + td").text().match(/(\d+)/)[1];
                      var DType  = $("th:contains('発見物') + td").text().split('／')[0].replace(/[\s\r\n]/g, '');

                      console.log([DType, target, QType, name, desc, place, skill, '-', rank, '-', '-', '-', added, '-', '-', '-'].join('\t'));
                    }
                );
            } else {
                console.log(['DType', target, QType, name, desc, place, skill, '-', rank, '-', '-', '-', added, '-', '-', '-'].join('\t'));
            }
        });

        // 遺跡ダンジョン
        $("td").filter(function () {return $(this).text() == '遺跡ダンジョン';}).closest('table').find('tbody > tr').each(function () {
            var name   = $(this).children(0).text() + ' ' + $(this).children(1).text();
            var desc   = $(this).children(0).text() + ' ' + $(this).children(1).text();
            var target = $(this).children(2).text();
            console.log(['DType', target, '遺跡', '-', desc, '-', '-', '-', '-', 0, '-', '-', added, '-', '0', '0'].join('\t'));
        });

        // 釣り
        $("td").filter(function () {return $(this).text() == '釣りR';}).closest('table').find('tbody > tr').each(function () {
            var desc   = $(this).children(0).text();
            var target = $(this).children(1).text();
            var skill  = '釣り' + $(this).children(2).text();
            var rank   = $(this).children(3).text();
            var exp    = $(this).children(4).text().match(/経験値?(?:　|\s)*(\d+)/) ? RegExp.$1 : 0;
            console.log(['海洋生物', target, '釣り', '-', desc, '-', skill, '-', rank, exp, '-', '-', added, '-', exp, exp].join('\t'));
        });

        // 天体
        $("td").filter(function () {return $(this).text() == '時間帯';}).closest('table').find('tbody > tr').each(function () {
            var desc   = $(this).children(0).text().split(/[ ,、　]/).join(',');
            var target = $(this).children(1).text();
            var rank   = $(this).children(3).text();
            console.log(['天文', target, '天体観測', '-', desc + '', '-', '-', '-', rank, '-', '-', '-', added, '-', '-', '-'].join('\t'));
        });

        // クエスト
        $("h4:contains('既存港') + div, h4:contains('追加港') + div").find("table > tbody > tr").each(function () {
            var place = $('<div/>').html($(this).children(0).html().replace(/<br class="spacer">/g, ',')).text();
            var name  = $(this).children(1).text();
            var url   = $(this).children(1).children('a').attr('href');
            var skill = $(this).children(2).text().replace(/[ 　]/g, ',');

            var processor = function (error, response, body) {
                var $ = cheerio.load(conv.convert(body).toString());

                if ($("th:contains('クエスト検索結果')").length) {
                    request(
                        {
                            uri:      'http://gvdb.mydns.jp' + $("table#quest_list tr:nth-of-type(2) a:nth-of-type(1)").attr('href'),
                            encoding: null,
                        },
                        processor
                    );
                    return;
                }

                var city = $("th:contains('都市') + td").text().replace(/\s/g, '');
                if (city.length == 0) {
                    console.error("クエスト「" + name + "」の情報が未入力のようです");
                    return;
                }

                var rank   = $("th:contains('難易度') + td").text().match(/(\d+)/) ? $("th:contains('難易度') + td").text().match(/(\d+)/)[1] : '-';
                var tgtcol = $("th:contains('発見物') + td").text().split('／');
                var DType  = target = '-';
                if (tgtcol.length == 2) {
                    DType  = tgtcol[0].replace(/^\s*(\S+)\s*$/, '$1');
                    target = tgtcol[1].replace(/^\s*(\S+)\s*$/, '$1');
                }
                console.log([DType, target, '冒険クエ', name, '-', place, skill, 0, rank, '-', '-', '-', added, '-', '-', '-'].join('\t'));
            };

            if (url) {
              request(
                  {
                      uri:      url,
                      encoding: null,
                  },
                  processor
              );
            }
        });
    }
);
