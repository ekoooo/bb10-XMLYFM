var App = {
    ACTION_BAR_HEIGHT: 0,
    BB_SCREEN_HEIGHT: 0,
    initApp: function() {
        this.attachEvent();
        _screenMgr.index();
    },
    attachEvent: function() {
        $(document).on('bb_ondomready', function(e, obj) {
            switch (obj.id) {
                case "index":
                    _tabMgr.init();
                    break;
                default:
                    break;
            }

            if(App.ACTION_BAR_HEIGHT === 0) {
                App.ACTION_BAR_HEIGHT = $('div[data-bb-type="action-bar"]').height();
                App.BB_SCREEN_HEIGHT = $('.bb-screen').height();
            }
        });

        // 主页 tab 切换事件
        _tabMgr.attachEvent();
    }
};

var _tabMgr = {
    // 当前开放的功能
    currentTabs: ['recommend', 'category', 'ranking', 'anchor'],
    tabsHeaderInfo: null,
    crtLen: 0,
    initPage: function(data) {
        if(data !== null) {
            _tabMgr.tabsHeaderInfo = JSON.parse(data);

            var list = _tabMgr.tabsHeaderInfo.tabs.list,
                len = _tabMgr.tabsHeaderInfo.tabs.count,
                item = null,
                headerLis = '';
                contentLis = '';

            _tabMgr.crtLen = 0;
            for (var i = 0; i < len; i++) {
                item = list[i];
                if($.inArray(item['contentType'], _tabMgr.currentTabs) !== -1) {
                    _tabMgr.crtLen++;

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
                width: 100 * _tabMgr.crtLen + '%'
            });
            headerLi.css({
                width: 100 / _tabMgr.crtLen + '%'
            });
            contentLi.css({
                width: 100 / _tabMgr.crtLen + '%',
                height: App.BB_SCREEN_HEIGHT - App.ACTION_BAR_HEIGHT - $('.tab_header').height()
            });

            headerLi.eq(0).find('a').addClass('active');

            // tab 初始化结束之后默认加载`热门`标签页内容
            _tabMgr.recommendTab.init();
        }
    },
    init: function() {
        if(_tabMgr.tabsHeaderInfo === null) {
            _httpRequest.tabs.getData(_tabMgr.initPage);
        }
    },
    switchTab: function(contentType) {
        switch (contentType) {
            case "category": // 分类
                _tabMgr.categoryTab.init();
                break;
            case "ranking": // 榜单
                _tabMgr.rankTab.init();
                break;
            case "anchor": // 主播
                _tabMgr.anchorTab.init();
                break;
            case "recommend": // 热门
                _tabMgr.recommendTab.init();
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

                _tabMgr.switchTab(target.attr('data-content_type'));
            }
        });
    },
    // 分类 tab
    categoryTab: {
        cateInfo: null,
        initPage: function(data) {
            if(data !== null) {
                _tabMgr.categoryTab.cateInfo = JSON.parse(data);

                var list = _tabMgr.categoryTab.cateInfo.list,
                    len = list.length,
                    category = $('.category'),
                    lis = '',
                    item = null;

                for (var i = 0; i < len; i++) {
                    item = list[i];
                    if(!item.isPaid) {
                        lis += '<div>' +
                            // '   <a href="javascript:void(0);" data-obj="' + JSON.stringify(item) + '">' +
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
            if(_tabMgr.categoryTab.cateInfo === null) {
                _httpRequest.cate.getIndexPageData(_tabMgr.categoryTab.initPage);
            }
        }
    },
    // 榜单 tab
    rankTab: {
        rankInfo: null,
        initPage: function(data) {
            if(data !== null) {
                _tabMgr.rankTab.rankInfo = JSON.parse(data);

                var datas = _tabMgr.rankTab.rankInfo.datas,
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

                        rankItemHTML += ['<div class="l_fixed_item" data-firstId="' + listItem['firstId'] + '">',
                            '    <div class="l_fixed_cover">',
                            '        <img src="' + listItem['coverPath'] + '" />',
                            '    </div>',
                            '    <div class="l_fixed_desc">',
                            '        <h2>' + listItem['title'] + '</h2>',
                            '        <p data-id="' + firstKResults[0].id + '">1. ' + firstKResults[0].title + '</p>',
                            '        <p data-id="' + firstKResults[1].id + '">2. ' + firstKResults[1].title + '</p>',
                            '    </div>',
                            '</div>'].join('');
                    }

                    rankListTpl += '<div class="l_fixed_list rank_list clearfix">' + 
                        '   <div class="l_fixed_title">' + dataItem['title'] + '</div>' + rankItemHTML
                        '</div>';
                }

                $('.ranking').empty().append(rankListTpl);
            }
        },
        init: function() {
            if(_tabMgr.rankTab.rankInfo === null) {
                _httpRequest.rank.getIndexPageData(_tabMgr.rankTab.initPage);
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
                        itemHTML += '<div class="three_box_item" data-uid="' + listItem['uid'] + '">' + 
                            '    <div>' + 
                            '        <img src="' + listItem['largeLogo'] + '">' + 
                            '        <div class="three_box_info">' + listItem['nickname'] + '</div>' + 
                            '    </div>' + 
                            '    <p>' + (listItem['verifyTitle'] || listItem['personDescribe'] || '') + '</p>' + 
                            '</div>';
                    }else {
                        itemHTML += '<div class="singer_item" data-uid="' + listItem['uid'] + '">' + 
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
                _tabMgr.anchorTab.anchorInfo = JSON.parse(data);

                $('.anchor').empty();
                _tabMgr.anchorTab.initPageItem(_tabMgr.anchorTab.anchorInfo['famous']);
                _tabMgr.anchorTab.initPageItem(_tabMgr.anchorTab.anchorInfo['normal'], 3);
            }
        },
        init: function() {
            if(_tabMgr.anchorTab.anchorInfo === null) {
                _httpRequest.anchor.getIndexPageData(_tabMgr.anchorTab.initPage);
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
                _tabMgr.recommendTab.recommendInfo = JSON.parse(data);

                $('.recommend').empty();
                _tabMgr.recommendTab.initHotRecommendsPanel(_tabMgr.recommendTab.recommendInfo['hotRecommends']);
            }
        },
        init: function() {
            if(_tabMgr.recommendTab.recommendInfo === null) {
                _httpRequest.recommend.getIndexPageData(_tabMgr.recommendTab.initPage);
            }
        }
    }
};

var _screenMgr = {
    index: function() {
        bb.pushScreen('app.html', 'index');
    }
};

var _httpRequest = {
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
            _httpRequest.baseRequest(_httpRequest.getAPI(this.API, _httpRequest.API_CONFIG), callback);
        }
    },
    /**
     * 分类
     */
    cate: {
        CATE_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v2/categories?channel=&picVersion=13&scale=2&device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            _httpRequest.baseRequest(_httpRequest.getAPI(this.CATE_INDEX_API, _httpRequest.API_CONFIG), callback);
        }
    },
    /**
     * 主播
     */
    anchor: {
        ANCHOR_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v1/anchor/recommend?device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            _httpRequest.baseRequest(_httpRequest.getAPI(this.ANCHOR_INDEX_API, _httpRequest.API_CONFIG), callback);
        }
    },
    /**
     * 榜单
     */
    rank: {
        RANK_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v2/rankingList/group?includeActivity=true&includeSpecial=true&scale=2&device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            _httpRequest.baseRequest(_httpRequest.getAPI(this.RANK_INDEX_API, _httpRequest.API_CONFIG), callback);
        }
    },
    /**
     * 热门
     */
    recommend: {
        RECOMMEND_INDEX_API: "http://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?device=#{device}&version=#{version}",
        getIndexPageData: function(callback) {
            _httpRequest.baseRequest(_httpRequest.getAPI(this.RECOMMEND_INDEX_API, _httpRequest.API_CONFIG), callback);
        }
    }
};