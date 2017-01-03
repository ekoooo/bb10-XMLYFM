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
                    headerLis += '<li><a href="javascript:void(0);" data-content_type="' + item['contentType'] + '">' + item['title'] + '</a></li>';
                    contentLis += '<li class="' + item['contentType'] + '">&nbsp;</li>';
                }
            }

            $('.tab_content').css({
                height: App.BB_SCREEN_HEIGHT - App.ACTION_BAR_HEIGHT - $('.tab_header').height()
            });

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
                width: 100 / _tabMgr.crtLen + '%'
            });

            headerLi.eq(0).find('a').addClass('active');
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
        tabInfo: null,
        initPage: function(data) {
            if(data !== null) {
                _tabMgr.categoryTab.tabInfo = JSON.parse(data);

                var list = _tabMgr.categoryTab.tabInfo.list,
                    len = list.length,
                    category = $('.category'),
                    lis = '',
                    item = null;

                for (var i = 0; i < len; i++) {
                    item = list[i];
                    if(!item.isPaid) {
                        lis += '<div>' + 
                            '   <a href="javascript:void(0);" data-obj="' + JSON.stringify(item) + '">' + 
                            '       <img src="' + item.coverPath + '" >' + item.title +
                            '   </a>' + 
                            '</div>';
                    }
                }

                category.empty().append($('<div class="cate_list clearfix"></div>').html(lis));
            }
        },
        init: function() {
            if(_tabMgr.categoryTab.tabInfo === null) {
                _httpRequest.cate.getIndexPageData(_tabMgr.categoryTab.initPage);
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
     * 主页 tab header
     */
    tabs: {
        API: "http://mobile.ximalaya.com/mobile/discovery/v2/tabs?device=#{device}&version=#{version}",
        getData: function(callback) {
            _httpRequest.baseRequest(_httpRequest.getAPI(this.API, _httpRequest.API_CONFIG), callback);
        }
    }
};