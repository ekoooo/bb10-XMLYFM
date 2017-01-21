## TABS
http://mobile.ximalaya.com/mobile/discovery/v2/tabs?device=android&version=5.4.63

## 主播 TAB
http://mobile.ximalaya.com/mobile/discovery/v1/anchor/recommend?device=android&version=5.4.63

## 主播分类(在更多主播使用)
http://mobile.ximalaya.com/mobile/discovery/v1/anchor/categoryWithFamous?device=android&version=5.4.63

## 更多主播列表
http://mobile.ximalaya.com/mobile/discovery/v1/anchor/#{famous|normal}?category_id=2&device=android&page=2&per_page=20

## 分类 TAB
http://mobile.ximalaya.com/mobile/discovery/v2/categories?channel=&device=android&picVersion=13&scale=2&version=5.4.63

## 榜单
http://mobile.ximalaya.com/mobile/discovery/v2/rankingList/group?device=android&includeActivity=true&includeSpecial=true&scale=2&version=5.4.63

#### 榜单列表点击进入
```javascript
/*
示例:
1. http://mobile.ximalaya.com/mobile/discovery/v3/rankingList/track?device=android&pageId=1&pageSize=20&rankingListId=57&target=main&version=5.4.63

2. http://mobile.ximalaya.com/mobile/discovery/v3/rankingList/track?device=android&pageId=1&pageSize=20&rankingListId=57&target=main&version=5.4.63&subCategoryId=12
*/

参数说明:
track: 榜单列表数据 contentType 参数值 (根据这个字值显示不同样式列表, 目前知道有)
    contentType=track; // 声音
    contentType=album; // 专辑
    contentType=anchor; // 主播

rankingListId: 榜单列表数据 rankingListId 参数值
subCategoryId: 榜单列表数据 categories.id 参数值
```

#### 声音基本信息:
http://mobile.ximalaya.com/v1/track/baseInfo?device=android&trackId=28644975

#### 声音基本信息:
http://mobile.ximalaya.com/v1/track/ca/playpage/28644975?device=android&trackId=28644975

#### 专辑声音信息:
http://mobile.ximalaya.com/mobile/v1/album/track?albumId=4756811&pageId=3&pageSize=20&device=android&isAsc=true

#### 专辑信息:
http://mobile.ximalaya.com/mobile/v1/album?albumId=3581543&device=android
http://mobile.ximalaya.com/mobile/v1/album/rich?albumId=5861321

#### 声音评论:
http://mobile.ximalaya.com/mobile/track/comment?pageId=1&pageSize=20&trackId=28509037

#### 主播基本信息:
http://www.ximalaya.com/mobile/v1/artist/intro?device=android&toUid=1266964

#### 主播专辑:
http://mobile.ximalaya.com/mobile/v1/artist/albums?toUid=1266964&pageSize=15&pageId=1

#### 主播全部声音:
http://mobile.ximalaya.com/mobile/v1/artist/tracks?device=android&pageId=1&pageSize=15&&toUid=1266964