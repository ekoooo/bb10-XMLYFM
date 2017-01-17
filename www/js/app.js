var App = {
    ACTION_BAR_HEIGHT: 0,
    BB_SCREEN_HEIGHT: 0,
    initApp: function() {
        this.attachEvent();
        ScreenMgr.index();
    },
    attachEvent: function() {
        $(document).on('bb_ondomready', function(e, obj) {
            switch (obj.id) {
                case "index":
                    TabMgr.init();
                    break;
                default:
                    break;
            }

            if(App.ACTION_BAR_HEIGHT === 0) {
                App.ACTION_BAR_HEIGHT = bb.screen.getActionBarHeight();
                App.BB_SCREEN_HEIGHT = $('.bb-screen').height();
            }
        });

        // 主页 tab 切换事件
        TabMgr.attachEvent();
        // 榜单
        XMLYRank.attachEvent();
        // UI 事件
        XMLYUI.attachEvent();
    }
};

/**
 * 主播个人主页
 */
var AnchorIndex = {
    ANCHOR_BLBUMS_PRE_NUM: 5,
    ANCHOR_TRACKS_PRE_NUM: 5,
    /**
     * 初始化
     * @param toUid 主播 id
     */
    init: function(toUid) {
        // 初始化界面
        XMLYUI.addMask('anchor_index_panel', '');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../tpl/anchorIndex.tpl', false);
        xhr.send();

        // 显示主播信息框架
        XMLYUI.addMaskContent(xhr.responseText, '.anchor_index_panel');

        AnchorIndex.attachViewAll();

        /*
         * 加载信息
         * 1, 主播基本信息
         * 2, 主播专辑
         * 3, 主播声音
         */
        HttpRequest.anchor.getAnchorIntroData(AnchorIndex.initAnchorIntro, toUid);
        HttpRequest.anchor.getAnchorAlbumsData(AnchorIndex.initAnchorAlbums, toUid, 1);
        HttpRequest.anchor.getAnchorTracksData(AnchorIndex.initAnchorTracks, toUid, 1);
    },
    initAnchorIntro: function(data) {
        var data = JSON.parse(data);
        // mask title
        XMLYUI.setMaskTitle(data.nickname, '.anchor_index_panel');
        // 背景
        $('.anchor_index_banner').css({
            backgroundImage: 'url(' + data.mobileLargeLogo + ')'
        });
        // 主播姓名
        $('.anchor_index_nickname').text(data.nickname);
        // 主播简介
        $('.anchor_index_desc').text(data.personDescribe);
        // 关注
        $('.anchor_index_followings').text(data.followings);
        // 粉丝
        $('.anchor_index_followers').text(data.followers);
        // 签名
        $('.anchor_index_signature').text(data.personalSignature);
        // 性别
        $('.anchor_index_gender').text(data.gender === 1 ? '男' : '女');
        // 星座
        $('.anchor_index_constellation').text(data.constellation);

        // 设置主播 uid
        $('.anchor_index_album .more').data('uid', data.uid).data('type', 'album');
        $('.anchor_index_track .more').data('uid', data.uid).data('type', 'track');
    },
    attachViewAll: function() {
        $('.anchor_index_album .more, .anchor_index_track .more').on('click', function(e) {
            var target = $(e.currentTarget),
                type = target.data('type'),
                uid = target.data('uid');

            switch (type) {
                case 'album':
                    XMLYUI.addMask('anchor_all_albums', '全部专辑');
                    HttpRequest.anchor.getAnchorAlbumsData(AnchorIndex.appendAnchorAlbums, uid, 1);
                    break;
                case 'track':
                    XMLYUI.addMask('anchor_all_tracks', '全部声音');
                    HttpRequest.anchor.getAnchorTracksData(AnchorIndex.appendAnchorTracks, uid, 1);
                    break;
                default:
                    break;
            }

            $('.anchor_all_albums, .anchor_all_tracks').on('click', '.load_more_btn.can_load_more', function(e) {
                var target = $(e.target),
                    uid = target.data('uid'),
                    pageId = target.data('pageid');

                target.removeClass('can_load_more').text('正在加载中...');

                if(target.parents('.anchor_all_albums')[0]) {
                    HttpRequest.anchor.getAnchorAlbumsData(AnchorIndex.appendAnchorAlbums, uid, pageId + 1);
                }else {
                    HttpRequest.anchor.getAnchorTracksData(AnchorIndex.appendAnchorTracks, uid, pageId + 1);
                }
            });
        });
    },

    // 专辑显示全部
    appendAnchorAlbums: function(data) {
        var data = JSON.parse(data),
            list = data['list'],
            item = null,
            itemHTML = '';

        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];

            itemHTML += ['<div class="l_fixed_item" data-uid="' + item['uid'] + '" data-albumid="' + item['albumId'] + '">',
                '    <div class="l_fixed_cover">',
                '        <img src="' + item['coverLarge'] + '">',
                '    </div>',
                '    <div class="l_fixed_desc">',
                '        <h2>' + item['title'] + '</h2>',
                '        <p>' + item['intro'] + '</p>',
                '        <p>',
                '            <span>次数 </span>',
                '            <span>' + (item['playTimes'] || '') + '</span>',
                '          <span>声音数量 </span>',
                '          <span>' + item['tracks'] + '</span>',
                '        </p>',
                '    </div>',
                '</div>'].join("");
        }

        itemHTML += XMLYUI.getLoadMoreHTML(data.pageId >= data.maxPageId, {
            "data-uid": list[0].uid,
            "data-pageid": data.pageId,
            "data-maxpageid": data.maxPageId
        });

        $('.anchor_all_albums .load_more_btn').remove();

        XMLYUI.addMaskContent(itemHTML, '.anchor_all_albums');
    },

    // 声音全部显示
    appendAnchorTracks: function(data) {
        var data = JSON.parse(data);
            list = data['list'],
            item = null,
            itemHTML = '';

        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];
            itemHTML += ['<div class="l_fixed_item">',
                '    <div class="l_fixed_cover track radius">',
                '        <img src="' + item['coverLarge'] + '">',
                '    </div>',
                '    <div class="l_fixed_desc">',
                '        <h2 class="dbh2">' + item['title'] + '</h2>',
                '        <p>',
                '            <span>次数 </span>',
                '            <span>' + item['playtimes'] + '</span>',
                '            <span>时间 </span>',
                '            <span>' + BB10Util.parseTime(item['duration']) + '</span>',
                '            <span>评论 </span>',
                '            <span>' + item['comments'] + '</span>',
                '        </p>',
                '    </div>',
                '</div>'].join("");
        }

        itemHTML += XMLYUI.getLoadMoreHTML(data.pageId >= data.maxPageId, {
            "data-uid": list[0].uid,
            "data-pageid": data.pageId,
            "data-maxpageid": data.maxPageId
        });

        $('.anchor_all_tracks .load_more_btn').remove();

        XMLYUI.addMaskContent(itemHTML, '.anchor_all_tracks');
    },

    initAnchorAlbums: function(data) {
        var data = JSON.parse(data),
            list = data['list'],
            item = null,
            itemHTML = '';

        // 默认显示最多 ANCHOR_BLBUMS_PRE_NUM 个专辑
        for (var i = 0, len = (list.length > AnchorIndex.ANCHOR_BLBUMS_PRE_NUM ? AnchorIndex.ANCHOR_BLBUMS_PRE_NUM : list.length); i < len; i++) {
            item = list[i];

            itemHTML += ['<div class="l_fixed_item" data-uid="' + item['uid'] + '" data-albumid="' + item['albumId'] + '">',
                '    <div class="l_fixed_cover">',
                '        <img src="' + item['coverLarge'] + '">',
                '    </div>',
                '    <div class="l_fixed_desc">',
                '        <h2>' + item['title'] + '</h2>',
                '        <p>' + item['intro'] + '</p>',
                '        <p>',
                '            <span>次数 </span>',
                '            <span>' + (item['playTimes'] || '') + '</span>',
                '          <span>声音数量 </span>',
                '          <span>' + item['tracks'] + '</span>',
                '        </p>',
                '    </div>',
                '</div>'].join("");
        }

        $('.anchor_index_album').append(itemHTML);
        // 专辑数量
        $('.anchor_index_album_num').text(data.totalCount);
    },
    initAnchorTracks: function(data) {
        var data = JSON.parse(data);
            list = data['list'],
            item = null,
            itemHTML = '';

        for (var i = 0, len = (list.length > AnchorIndex.ANCHOR_TRACKS_PRE_NUM ? AnchorIndex.ANCHOR_TRACKS_PRE_NUM : list.length); i < len; i++) {
            item = list[i];
            itemHTML += ['<div class="l_fixed_item">',
                '    <div class="l_fixed_cover track radius">',
                '        <img src="' + item['coverLarge'] + '">',
                '    </div>',
                '    <div class="l_fixed_desc">',
                '        <h2 class="dbh2">' + item['title'] + '</h2>',
                '        <p>',
                '            <span>次数 </span>',
                '            <span>' + item['playtimes'] + '</span>',
                '            <span>时间 </span>',
                '            <span>' + BB10Util.parseTime(item['duration']) + '</span>',
                '            <span>评论 </span>',
                '            <span>' + item['comments'] + '</span>',
                '        </p>',
                '    </div>',
                '</div>'].join("");
        }

        $('.anchor_index_track').append(itemHTML);
        // 声音数量
        $('.anchor_index_track_num').text(data.totalCount);
    }
}

/**
 * 处理榜单
 */
var XMLYRank = {
    isReading: false,
    attachEvent: function() {
        $(document).on('click', '.rank_list >.l_fixed_item', function(e) {
            var target = $(e.currentTarget);

            XMLYRank.appendRankList(target.attr('data-title'), target.attr('data-contentType'), target.attr('data-rankingListId'));
        });
    },
    appendRankList: function(title, contentType, rankingListId, pageId, subCategoryId) {
        pageId = typeof pageId === 'undefined' ? 1 : pageId;
        subCategoryId = typeof subCategoryId === 'undefined' ? '' : subCategoryId;
        // 弹出遮罩
        XMLYUI.addMask('rank_list', title);
        // 获取数据
        HttpRequest.rank.rankItem.getRankItemList(XMLYRank.appendRankListCallBack, contentType, pageId, rankingListId, subCategoryId);
    },
    appendRankListCallBack: function(data) {
        var data = JSON.parse(data),
            contentType = data['contentType'];

        XMLYRank.appendRankListSubCates(data['categories']);
        switch (contentType) {
            case 'album': // 专辑
                XMLYRank.appendRankListAlbum(data);
                break;
            case 'track': // 声音
                XMLYRank.appendRankListTrack(data);
                break;
            case 'anchor': // 主播
                XMLYRank.appendRankListAnchor(data);
                break;
            default:
                break;
        }

        XMLYRank.isReading = false;
    },
    appendRankListAnchor: function(data) {
        var list = data['list'],
            item = null,
            rankListTpl = null,
            rankListItemHTML = '';

        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];

            rankListItemHTML += ['<div class="l_fixed_item">',
                '    <div class="l_fixed_cover">',
                '        <img src="' + item['largeLogo'] + '" />',
                '    </div>',
                '    <div class="l_fixed_desc anchor_evt_panel" data-uid="' + item['uid'] + '">',
                '        <h2>' + item['nickname'] + (item['isVerified'] ? '<img class="v_img" src="../img/v.png">' : '') + '</h2>',
                '        <p>' + (item['verifyTitle'] || item['personDescribe'] || '') + '</p>',
                '        <p>粉丝 ' + item['followersCounts'] + '</p>',
                '    </div>',
                '</div>'].join('');
        }

        rankListTpl = '<div data-contentType="' + data['contentType'] +
            '" data-rankingListId="' + data['rankingListId'] +
            '" data-maxPageId="' + data['maxPageId'] +
            '" data-pageId="' + data['pageId'] +
            '" data-key="' + data['key'] + '" class="l_fixed_list rank_item_list clearfix">' + rankListItemHTML + '</div>';

        XMLYUI.addMaskContent(rankListTpl, '.mask.rank_list');
    },
    appendRankListTrack: function(data) {
        var list = data['list'],
            item = null,
            rankListTpl = null,
            rankListItemHTML = '';

        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];

            rankListItemHTML += ['<div class="l_fixed_item">',
                '    <div class="l_fixed_cover radius track">',
                '        <img src="' + item['coverSmall'] + '" />',
                '    </div>',
                '    <div class="l_fixed_desc">',
                '        <h2>' + item['title'] + '</h2>',
                '        <p>演播 ' + item['nickname'] + '</p>',
                '        <p>' + (typeof (item['tags'] === 'undefined' || item['tags'] === '') ? '专辑 ' + item['albumTitle'] : '标签 ' + item['tags']) + '</p>',
                '    </div>',
                '</div>'].join('');
        }

        rankListTpl = '<div data-contentType="' + data['contentType'] +
            '" data-rankingListId="' + data['rankingListId'] +
            '" data-maxPageId="' + data['maxPageId'] +
            '" data-pageId="' + data['pageId'] +
            '" data-key="' + data['key'] + '" class="l_fixed_list rank_item_list clearfix">' + rankListItemHTML + '</div>';

        XMLYUI.addMaskContent(rankListTpl, '.mask.rank_list');
    },
    attachCatesEvent: function() {
        // 展开, 收起
        $('.subcates_switch_btn').on('click', function(e) {
            var subcates = $(e.currentTarget).parents('.subcates');

            if('hidden' === subcates.css('overflow')) {
                subcates.css('overflow', 'visible');
            }else {
                subcates.css('overflow', 'hidden');
            }
        });

        // 点击过滤
        $('.mask.rank_list .subcates li:not(.subcates_switch_btn)').on('click', function(e) {
            var target = $(e.currentTarget);

            target.siblings().removeClass('active');
            target.addClass('active');

            var rankItemList = $('.mask.rank_list .content_box .rank_item_list'),
                contentType = rankItemList.attr('data-contentType'),
                pageId = rankItemList.attr('data-pageId'),
                rankingListId = rankItemList.attr('data-rankingListId'),
                subCategoryId = target.attr('data-id');

            // 清空
            $('.mask.rank_list .content_box').empty().append('<div class="subcates_placeholder"></div>');

            HttpRequest.rank.rankItem.getRankItemList(XMLYRank.appendRankListCallBack, contentType, pageId, rankingListId, subCategoryId);
        });

        // 滚动加载
        $('.mask.rank_list .content_box_wrapper').on('scroll', function(e) {
            var target = $(e.currentTarget);

            var boxH = App.BB_SCREEN_HEIGHT,
                topH = target.scrollTop(),
                contentH = target.find('.content_box').height();

            if(!XMLYRank.isReading && boxH + topH >= contentH) {
                XMLYRank.isReading = true;

                var rankItemList = $('.mask.rank_list .content_box .rank_item_list:last-child'),
                    contentType = rankItemList.attr('data-contentType'),
                    pageId = Number(rankItemList.attr('data-pageId')) + 1,
                    maxPageId = rankItemList.attr('data-maxPageId'),
                    rankingListId = rankItemList.attr('data-rankingListId'),
                    subCategoryId = $('.mask.rank_list .subcates li.active').attr('data-id');

                subCategoryId = typeof subCategoryId === 'undefined' ? '' : subCategoryId;

                if(pageId > maxPageId || !rankItemList[0]) {
                    if(!target.find('.loaded')[0] && $('.mask.rank_list .content_box .rank_item_list').length > 0) {
                        XMLYUI.addMaskContent('<p class="loaded">已加载完成!</p>');
                    }

                    setTimeout(function() {
                        XMLYRank.isReading = false;
                    }, 2000);
                    return;
                }

                HttpRequest.rank.rankItem.getRankItemList(XMLYRank.appendRankListCallBack, contentType, pageId, rankingListId, subCategoryId);
            }
        });
    },
    appendRankListSubCates: function(categories) {
        // 判断是否已经添加过
        if($('.mask.rank_list .subcates')[0]) {
            return;
        }

        var hasCategories = categories && categories.length > 0 ? true : false;
        if(hasCategories) {
            var item = null,
                liTpl = '<li class="active" data-id=""><a href="javascript:void(0)">总榜</a></li>';

            for(var i = 0, len = categories.length; i < len; i++){
                item = categories[i];
                if(i === 3) {
                    liTpl += '<li class="subcates_switch_btn"><a href="javascript:void(0)">打开 / 收起</a></li>';
                }
                liTpl += '<li data-id="' + item['id'] + '" data-key="' + item['key'] + '"><a href="javascript:void(0)">' + item['name'] + '</a></li>';
            }

            $('.mask.rank_list .content_box').append('<div class="subcates_placeholder"></div>');
            $('.mask.rank_list .head').after('<div class="subcates">' +
                '    <ul class="clearfix">' + liTpl + '</ul>' +
                '</div>');
        }

        // 监听事件
        this.attachCatesEvent();
    },
    appendRankListAlbum: function(data) {
        var list = data['list'],
            item = null,
            rankListTpl = null,
            rankListItemHTML = '';

        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];

            rankListItemHTML += ['<div class="l_fixed_item">',
                '    <div class="l_fixed_cover">',
                '        <img src="' + item['coverMiddle'] + '" />',
                '    </div>',
                '    <div class="l_fixed_desc">',
                '        <h2>' + item['title'] + '</h2>',
                '        <p>' + item['intro'] + '</p>',
                '        <p>' + (item['isPaid'] ? '评分 ' + item['score'] : item['tracksCounts'] + ' 集') + '</p>',
                '    </div>',
                '</div>'].join('');
        }

        rankListTpl = '<div data-contentType="' + data['contentType'] +
            '" data-rankingListId="' + data['rankingListId'] +
            '" data-maxPageId="' + data['maxPageId'] +
            '" data-pageId="' + data['pageId'] +
            '" data-key="' + data['key'] + '" class="l_fixed_list rank_item_list clearfix">' + rankListItemHTML + '</div>';

        XMLYUI.addMaskContent(rankListTpl, '.mask.rank_list');
    }
}

/**
 * 界面处理
 */
var XMLYUI = {
    attachEvent: function() {
        // 弹出层关闭操作
        $(document).on('click', '.close_btn', function(e) {
            var mask = $(e.target).parents('.mask');
            mask.fadeOut(function() {
                mask.remove();
            });
        });

        // 点击主播进入主播主页
        $(document).on('click', '.anchor_evt_panel', function(e) {
            AnchorIndex.init($(e.currentTarget).data('uid'));
        });

        // 点击声音进入播放界面
    },
    addMask: function(clazz, title) {
        $(bb.screen.currentScreen).append($('<div class="mask ' + (typeof clazz === 'undefined' ? '' : clazz) + '">' +
            '    <div class="head">' +
            '        <div class="title">' + (typeof title === 'undefined' ? '' : title) + '</div>' +
            '        <button class="close_btn">X</button>' +
            '    </div>' +
            '    <div class="content_box_wrapper">' +
            '       <div class="content_box"></div>' +
            '   </div>' +
            '</div>'));

        $('.mask:last-child').fadeIn();
    },
    addMaskContent: function(content, selector) {
        $((typeof selector === 'undefined' ? '.mask' : selector) + ' .content_box').append(content);
    },
    setMaskTitle: function(title, selector) {
        $((typeof selector === 'undefined' ? '.mask' : selector) + ' .title').text(title);
    },
    getLoadMoreHTML: function(isAllDone, data) {
        var dataStr = '';
        for (v in data) {
            dataStr += v +'="' + data[v] + '" ';
        }
        return '<div ' + dataStr + ' class="load_more_btn' + (isAllDone ? ' load_all_done' : ' can_load_more') + '">' + (isAllDone ? '已加载完成' : '点击加载更多') + '</div>';
    }
}

/**
 * 处理主页 Tab 以及其内容
 */
var TabMgr = {
    // 当前开放的功能
    currentTabs: ['recommend', 'category', 'ranking', 'anchor'],
    tabsHeaderInfo: null,
    crtLen: 0,

    initPage: function(data) {
        if(data !== null) {
            TabMgr.tabsHeaderInfo = JSON.parse(data);

            var list = TabMgr.tabsHeaderInfo.tabs.list,
                len = TabMgr.tabsHeaderInfo.tabs.count,
                item = null,
                headerLis = '';
                contentLis = '';

            TabMgr.crtLen = 0;
            for (var i = 0; i < len; i++) {
                item = list[i];
                if($.inArray(item['contentType'], TabMgr.currentTabs) !== -1) {
                    TabMgr.crtLen++;

                    headerLis += '<li>' +
                        '   <a href="javascript:void(0);" data-content_type="' + item['contentType'] + '">' + item['title'] + '</a>' +
                        '</li>';

                    contentLis += '<li class="' + item['contentType'] + '">' +
                        '   <div class="loading">' +
                        '       <img src="img/loading.gif">' +
                        '   </div>' +
                        '</li>';
                }
            }

            var headerUl = $('.tab_header ul'),
                contentUl = $('.tab_content ul');

            headerUl.append(headerLis);
            contentUl.append(contentLis);

            var headerLi = headerUl.find('li'),
                contentLi = contentUl.find('li');

            contentUl.css({
                width: 100 * TabMgr.crtLen + '%'
            });
            headerLi.css({
                width: 100 / TabMgr.crtLen + '%'
            });
            contentLi.css({
                width: 100 / TabMgr.crtLen + '%',
                height: App.BB_SCREEN_HEIGHT - App.ACTION_BAR_HEIGHT - $('.tab_header').height()
            });

            headerLi.eq(0).find('a').addClass('active');

            // tab 初始化结束之后默认加载`热门`标签页内容
            TabMgr.recommendTab.init();
        }
    },

    init: function() {
        if(TabMgr.tabsHeaderInfo === null) {
            HttpRequest.tabs.getData(TabMgr.initPage);
        }
    },

    switchTab: function(contentType) {
        switch (contentType) {
            case "category": // 分类
                TabMgr.categoryTab.init();
                break;
            case "ranking": // 榜单
                TabMgr.rankTab.init();
                break;
            case "anchor": // 主播
                TabMgr.anchorTab.init();
                break;
            case "recommend": // 热门
                TabMgr.recommendTab.init();
                break;
            default:
                break;
        }
    },

    attachEvent: function() {
        $(document).on('click', '.tab_container .tab_header a', function(e) {
            var target = $(e.currentTarget);
            if(!target.hasClass('active')) {
                $('.tab_container .tab_header a').removeClass('active');
                target.addClass('active');

                $('.tab_content ul').css({
                    marginLeft: -100 * target.parent().index() + '%'
                });

                TabMgr.switchTab(target.attr('data-content_type'));
            }
        });
    },

    // 分类 tab
    categoryTab: {
        cateInfo: null,
        initPage: function(data) {
            if(data !== null) {
                TabMgr.categoryTab.cateInfo = JSON.parse(data);

                var list = TabMgr.categoryTab.cateInfo.list,
                    len = list.length,
                    category = $('.category'),
                    lis = '',
                    item = null;

                for (var i = 0; i < len; i++) {
                    item = list[i];
                    if(!item.isPaid) {
                        lis += '<div>' +
                            '   <a href="javascript:void(0);">' +
                            '       <img src="' + item.coverPath + '" >' + item.title +
                            '   </a>' +
                            '</div>';
                    }
                }

                category.empty().append($('<div class="cate_list clearfix"></div>').html(lis));
            }
        },
        init: function() {
            if(TabMgr.categoryTab.cateInfo === null) {
                HttpRequest.cate.getIndexPageData(TabMgr.categoryTab.initPage);
            }
        }
    },
    // 榜单 tab
    rankTab: {
        rankInfo: null,
        initPage: function(data) {
            if(data !== null) {
                TabMgr.rankTab.rankInfo = JSON.parse(data);

                var datas = TabMgr.rankTab.rankInfo.datas,
                    dataLen = datas.length,
                    dataItem = null,
                    list = null,
                    listItem = null,
                    firstKResults = null,
                    rankListTpl = '',
                    rankItemHTML;

                for (var i = 0; i < dataLen; i++) {
                    dataItem = datas[i];
                    list = dataItem['list'];

                    rankItemHTML = '';
                    for (var j = 0, listLen = list.length; j < listLen; j++) {
                        listItem = list[j];
                        firstKResults = listItem['firstKResults'];

                        rankItemHTML += ['<div class="l_fixed_item" data-title="' + listItem['title'] + '" data-contentType="' + listItem['contentType'] + '" data-rankingListId="' + listItem['rankingListId'] + '">',
                            '    <div class="l_fixed_cover">',
                            '        <img src="' + listItem['coverPath'] + '" />',
                            '    </div>',
                            '    <div class="l_fixed_desc">',
                            '        <h2>' + listItem['title'] + '</h2>',
                            '        <p>1. ' + firstKResults[0].title + '</p>',
                            '        <p>2. ' + firstKResults[1].title + '</p>',
                            '    </div>',
                            '</div>'].join('');
                    }

                    rankListTpl += '<div class="l_fixed_list rank_list clearfix">' +
                        '   <div class="l_fixed_title">' + dataItem['title'] + '</div>' + rankItemHTML +
                        '</div>';
                }

                $('.ranking').empty().append(rankListTpl);
            }
        },
        init: function() {
            if(TabMgr.rankTab.rankInfo === null) {
                HttpRequest.rank.getIndexPageData(TabMgr.rankTab.initPage);
            }
        }
    },
    // 主播 tab
    anchorTab: {
        anchorInfo: null,
        initPageItem: function(data, maxLen) {
            var dataLen = data.length,
                dataItem = null,
                listItem = null,
                list = null,
                anchorListHTML = '',
                displayStyle,
                itemHTML;

            for (var i = 0; i < dataLen; i++) {
                dataItem = data[i];
                displayStyle = dataItem['displayStyle'] || 1;
                list = dataItem['list'];

                itemHTML = '';

                for (var j = 0, len = list.length; j < len; j++) {
                    if(j && j === maxLen) {
                        break;
                    }

                    listItem = list[j];
                    if(displayStyle === 1) {
                        itemHTML += '<div class="three_box_item anchor_evt_panel" data-uid="' + listItem['uid'] + '">' +
                            '    <div>' +
                            '        <img src="' + listItem['largeLogo'] + '">' +
                            '        <div class="three_box_info">' + listItem['nickname'] + '</div>' +
                            '    </div>' +
                            '    <p>' + (listItem['verifyTitle'] || listItem['personDescribe'] || '') + '</p>' +
                            '</div>';
                    }else {
                        itemHTML += '<div class="singer_item anchor_evt_panel" data-uid="' + listItem['uid'] + '">' +
                            '    <div class="l_fixed_cover radius">' +
                            '        <img src="' + listItem['largeLogo'] + '">' +
                            '    </div>' +
                            '    <div class="l_fixed_desc">' +
                            '        <h2>' + listItem['nickname'] + '</h2>' +
                            '        <p class="singler_desc">' + listItem['personDescribe'] + '</p>' +
                            '        <p class="singler_followers">关注: ' + listItem['followersCounts'] + '</p>' +
                            '    </div>' +
                            '</div>';
                    }
                }

                if(displayStyle === 1) {
                    itemHTML = '<div class="three_box">' + itemHTML + '</div>';
                }else {
                    itemHTML = '<div class="singer_box">' + itemHTML + '</div>';
                }

                anchorListHTML += '<div class="anchor_list three_box_list">' +
                    '    <div class="three_box_header clearfix">' +
                    '        <h2>' + dataItem['title'] + '</h2>' +
                    '        <span>更多</span>' +
                    '    </div>' +  itemHTML +
                    '</div>';
            }

            $('.anchor').append(anchorListHTML);
        },
        initPage: function(data) {
            if(data !== null) {
                TabMgr.anchorTab.anchorInfo = JSON.parse(data);

                $('.anchor').empty();
                TabMgr.anchorTab.initPageItem(TabMgr.anchorTab.anchorInfo['famous']);
                TabMgr.anchorTab.initPageItem(TabMgr.anchorTab.anchorInfo['normal'], 3);
            }
        },
        init: function() {
            if(TabMgr.anchorTab.anchorInfo === null) {
                HttpRequest.anchor.getIndexPageData(TabMgr.anchorTab.initPage);
            }
        }
    },
    // 热门 tab
    recommendTab: {
        recommendInfo: null,
        initHotRecommendsPanel: function(hotRecommends) {
            var list = hotRecommends['list'],
                listLen = list.length,
                listItem = null,
                innerList = null,
                innerListItem = null,
                threeBoxItemHTML,
                threeBoxListHTML = '';

            for (var i = 0; i < listLen; i++) {
                listItem = list[i];
                innerList = listItem['list'];

                threeBoxItemHTML = '';
                for(var j = 0, innerListLen = innerList.length; j < innerListLen; j++) {
                    innerListItem = innerList[j];
                    threeBoxItemHTML += '<div class="three_box_item">' +
                        '    <div>' +
                        '        <img src="' + innerListItem['coverLarge'] + '">' +
                        '        <div class="three_box_info">' + innerListItem['title'] + '</div>' +
                        '    </div>' +
                        '    <p>' + innerListItem['intro'] + '</p>' +
                        '</div>';
                }
                threeBoxListHTML += '<div class="three_box_list recommend_list">' +
                    '    <div class="three_box_header clearfix">' +
                    '        <h2>' + listItem['title'] + '</h2>' +
                    '        <span>更多</span>' +
                    '    </div>' +
                    '    <div class="three_box">' + threeBoxItemHTML +
                    '    </div>' +
                    '</div>';
            }

            $('.recommend').append(threeBoxListHTML);
        },
        initPage: function(data) {
            if(data !== null) {
                TabMgr.recommendTab.recommendInfo = JSON.parse(data);

                $('.recommend').empty();
                TabMgr.recommendTab.initHotRecommendsPanel(TabMgr.recommendTab.recommendInfo['hotRecommends']);
            }
        },
        init: function() {
            if(TabMgr.recommendTab.recommendInfo === null) {
                HttpRequest.recommend.getIndexPageData(TabMgr.recommendTab.initPage);
            }
        }
    }
};

/**
 * 统一处理 bbui 页面更换
 */
var ScreenMgr = {
    index: function() {
        bb.pushScreen('app.html', 'index');
    }
};

/**
 * 处理喜马拉雅数据
 */
var HttpRequest = {
    API_CONFIG: {
        "device": "android",
        "version": "5.4.63"
    },
    getAPI: function(api, paras) {
        for (variable in paras) {
            api = api.replace('#{' + variable + '}', paras[variable]);
        }
        return api;
    },
    /**
     * GET 异步请求, 需提供回调函数
     */
    baseRequest: function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    callback(xhr.responseText);
                }else {
                    callback(null);
                }
            }
        }
    },
    /**
     * TAB
     */
    tabs: {
        API: "http://mobile.ximalaya.com/mobile/discovery/v2/tabs?device=#{device}&version=#{version}",
        getData: function(callback) {
            HttpRequest.baseRequest(HttpRequest.getAPI(this.API, HttpRequest.API_CONFIG), callback);
        }
    },
    /**
     * 分类
     */
    cate: {
        CATE_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v2/categories?channel=&picVersion=13&scale=2&device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            HttpRequest.baseRequest(HttpRequest.getAPI(this.CATE_INDEX_API, HttpRequest.API_CONFIG), callback);
        }
    },
    /**
     * 主播
     */
    anchor: {
        ANCHOR_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v1/anchor/recommend?device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            HttpRequest.baseRequest(HttpRequest.getAPI(this.ANCHOR_INDEX_API, HttpRequest.API_CONFIG), callback);
        },

        // 获取主播基本资料
        ANCHOR_INTRO_API: "http://www.ximalaya.com/mobile/v1/artist/intro?device=#{device}&toUid=#{toUid}",
        getAnchorIntroData: function(callback, uid) {
            var paras = {
                toUid: uid,
                device: HttpRequest.API_CONFIG.device
            };

            HttpRequest.baseRequest(HttpRequest.getAPI(this.ANCHOR_INTRO_API, paras), callback);
        },

        // 获取主播专辑
        ANCHOR_ALBUMS_API : "http://mobile.ximalaya.com/mobile/v1/artist/albums?toUid=#{toUid}&pageSize=15&pageId=#{pageId}",
        getAnchorAlbumsData: function(callback, uid, pageId) {
            var paras = {
                toUid: uid,
                pageId: pageId
            }

            HttpRequest.baseRequest(HttpRequest.getAPI(this.ANCHOR_ALBUMS_API, paras), callback);
        },

        // 获取主播声音
        ANCHOR_TRACKS_API : "http://mobile.ximalaya.com/mobile/v1/artist/tracks?toUid=#{toUid}&pageId=#{pageId}&device=#{device}&pageSize=15",
        getAnchorTracksData: function(callback, uid, pageId) {
            var paras = {
                toUid: uid,
                pageId: pageId,
                device: HttpRequest.API_CONFIG.device
            }

            HttpRequest.baseRequest(HttpRequest.getAPI(this.ANCHOR_TRACKS_API, paras), callback);
        }
    },
    /**
     * 榜单
     */
    rank: {
        RANK_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v2/rankingList/group?includeActivity=true&includeSpecial=true&scale=2&device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            HttpRequest.baseRequest(HttpRequest.getAPI(this.RANK_INDEX_API, HttpRequest.API_CONFIG), callback);
        },
        rankItem: {
            RANK_ITEM_LIST_API: "http://mobile.ximalaya.com/mobile/discovery/v3/rankingList/#{contentType}?pageId=#{pageId}&rankingListId=#{rankingListId}&subCategoryId=#{subCategoryId}&pageSize=20&target=main&device=#{device}&version=#{version}",
            getRankItemList: function(callback, contentType, pageId, rankingListId, subCategoryId) {
                var paras = {
                    contentType: contentType,
                    pageId: pageId,
                    rankingListId: rankingListId,
                    subCategoryId: subCategoryId
                };

                $.extend(paras, HttpRequest.API_CONFIG);

                HttpRequest.baseRequest(HttpRequest.getAPI(this.RANK_ITEM_LIST_API, paras), callback);
            }
        }
    },
    /**
     * 热门
     */
    recommend: {
        RECOMMEND_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            HttpRequest.baseRequest(HttpRequest.getAPI(this.RECOMMEND_INDEX_API, HttpRequest.API_CONFIG), callback);
        }
    }
};

var BB10Util = {
    parseTime: function(time) {
        var m = Math.floor(time / 60);
        var s = Math.floor(time % 60);

        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;

        return m + ':' + s;
    }
}