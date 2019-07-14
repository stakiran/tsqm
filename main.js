'use strict';

var PRODUCT_NAME = 'tsqm'
var VERSION      = 'v0.0.1';
var CAPTION      = PRODUCT_NAME + ' - ' + VERSION;

var ID_DEFAULT = "@stakiran2";
var TWITTER_BIRTHDAY = "2006-07-15"

var mod_datetime = DATETIME;

$(function(){
    // Initial values
    // --------------

    document.title = CAPTION;

    $("#input_id").val(ID_DEFAULT);
    $('#select_split_unit').val("weeks");
    $("#input_since").val(TWITTER_BIRTHDAY);
    $("#input_until").val(mod_datetime.todaystr());

    // Initial procs
    // -------------

    mod_datetime.init();

    // Event for input
    // ---------------

    $("input").blur(function(){
        $(this).select();
    });
    $("input").click(function(){
        $(this).select();
    });

    // Event for button

    $("#button_go").click(function(){
        var id = "";
        var since_datestr = "";
        var until_datestr = "";

        id = $("#input_id").val();
        if(!id){
            alert("Twitter id required.");
            return;
        }
        // 後のクエリ生成時に邪魔なので @ は消す.
        // ただし入力時は @ 有無に依存させない方が優しいので @ 有りでも無しでも動くようにする
        // (ためにこうして内部的に @ があったら消すようにする).
        if(id[0] == "@"){
            id = id.substring(1);
        }

        since_datestr = $("#input_since").val();
        if(mod_datetime.is_invalid_datestr(since_datestr)){
            alert("since date '" + since_datestr + "' is invalid.");
            return;
        }

        until_datestr = $("#input_until").val();
        if(mod_datetime.is_invalid_datestr(until_datestr)){
            alert("until date '" + until_datestr + "' is invalid.");
            return;
        }
        // since, until は [, ) 範囲でありわかりづらいので,
        // 内部的に [, ] 範囲に変換しておく.
        // つまり until として与えられた date に +1 day する.
        var until_datestr_adjusted = (new mod_datetime.Datetime()).from_string(until_datestr).walk_with_day(1).to_string();

        if(!mod_datetime.is_a_before_b(since_datestr, until_datestr_adjusted)){
            alert(
                "Since date must be before until date.\n" + 
                "Since: " + since_datestr + "\n" + 
                "Until: " + until_datestr + "\n"
            );
            return;
        }

        var split_mode_by_momentjs_add_arg = $('#select_split_unit').val();
        var spans = [];
        var current_dtobj = (new mod_datetime.Datetime()).from_string(since_datestr)
        var is_last_element = false;
        while(true){
            var start_datestr = current_dtobj.to_string();

            current_dtobj.walk(1, split_mode_by_momentjs_add_arg);
            var end_datestr_candidate = current_dtobj.to_string();
            var end_datestr = end_datestr_candidate;
            if(mod_datetime.is_a_before_b(until_datestr_adjusted, end_datestr_candidate)){
                end_datestr = until_datestr_adjusted;
                is_last_element = true;
            }

            var span = [start_datestr, end_datestr];
            spans.push(span);

            if(is_last_element){
                break;
            }
        }

        var TEXT_TEMPLATE = "from:@{{id}} {{since}} - {{until}}";
        var QUERY_TEMPLATE = "https://twitter.com/search?f=tweets&q=from%3A%40{{id}}%20since%3A{{since}}%20until%3A{{until}}"
        var LINE_TEMPLATE = '<li><a href="{{query}}">{{text}}</li>';
        var apendee_place_by_ul = $("#area_output_parent");
        apendee_place_by_ul.children().remove();
        for(var i=0; i<spans.length; i++){
            var span = spans[i];
            var start_datestr = span[0];
            var end_datestr = span[1];

            var query = QUERY_TEMPLATE;
            query = query.replace("{{id}}", id);
            query = query.replace("{{since}}", start_datestr);
            query = query.replace("{{until}}", end_datestr);

            var text = TEXT_TEMPLATE;
            text = text.replace("{{id}}", id);
            text = text.replace("{{since}}", start_datestr);
            text = text.replace("{{until}}", end_datestr);

            var line = LINE_TEMPLATE;
            line = line.replace("{{query}}", query);
            line = line.replace("{{text}}", text);

            apendee_place_by_ul.append(line);
        }
    });

});

