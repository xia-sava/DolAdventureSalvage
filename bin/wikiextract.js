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
            var place  = $(this).children(0).html().split('<br class="spacer">').join(',');
            var name   = $(this).children(1).text();
            var desc   = $(this).children(2).text();
            var skill  = $(this).children(3).text().replace(/[ 　]/g, ',');
            var target = $(this).children(5).text();
            var QType  = $(this).parent().parent().parent().prev().children('a:first-child').text();
            console.log(['DType', target, QType, name, desc, place, skill, '-', '-', '0', '-', '-', added, '-', '0', '0'].join('\t'));
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
            console.log(['地理', target, '釣り', '-', desc + ' (種別:天文) (スキル:天文学)', '-', '-', '-', rank, '-', '-', '-', added, '-', '-', '-'].join('\t'));
        });

        // クエスト
        $("h4:contains('既存港') + div, h4:contains('追加港') + div").find("table > tbody > tr").each(function () {
            var place = $(this).children(0).html().split('<br class="spacer">').join(',');
            var name  = $(this).children(1).text();
            var url   = $(this).children(1).children('a').attr('href');
            var skill = $(this).children(2).text().replace(/[ 　]/g, ',');

            request(
                {
                    uri:      url,
                    encoding: null,
                },
                function (error, response, body) {
                    var $ = cheerio.load(conv.convert(body).toString());
                    var link = $("a:contains('"+name+"')");
                    if (link) {
                        var url = 'http://www.umiol.com' + link.attr('href');
                        request(
                            {
                                uri:      url,
                                encoding: null,
                            },
                            function (error, response, body) {
                                var $ = cheerio.load(conv.convert(body).toString());
                                var rank   = $("th:contains('難易度') + td").text();
                                var reward = $("th:contains('前金／報酬') + td").text().split('／')[1];
                                var dscstr = $("th:contains('発見・獲得物') + td").text();

                                var DType  = dscstr.match(/(?:^|\s*)(.+?)(?:｢|「).+?(?:｣|」)/) ? RegExp.$1 : '-';
                                var target = dscstr.match(/(?:^|\s*).+?(?:｢|「)(.+?)(?:｣|」)/) ? RegExp.$1 : '-';
                                var exp    = dscstr.match(/経験値?(?:　|\s)*(\d+)/) ? RegExp.$1 : '-';
                                var point  = dscstr.match(/カードランク\s*(\d+)/) ? RegExp.$1 : 0;
                                var item   = '-';

                                console.log([DType, target, '冒険クエ', name, '-', place, skill, reward, rank, exp, item, '-', added, point, exp, exp].join('\t'));
                            }
                        );
                    }
                }
            );
        });
    }
);
