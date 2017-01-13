## TABS
```javascript
/*
示例: 
1. http://mobile.ximalaya.com/mobile/discovery/v2/tabs?device=android&version=5.4.63
*/
```

## 主播 TAB
```javascript
/*
示例: 
1. http://mobile.ximalaya.com/mobile/discovery/v1/anchor/recommend?device=android&version=5.4.63
*/
```

## 分类 TAB
```javascript
/*
示例: 
1. http://mobile.ximalaya.com/mobile/discovery/v2/categories?channel=&device=android&picVersion=13&scale=2&version=5.4.63
*/
```

## 榜单
```javascript
/*
示例: 
1. http://mobile.ximalaya.com/mobile/discovery/v2/rankingList/group?device=android&includeActivity=true&includeSpecial=true&scale=2&version=5.4.63
*/
```

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

#### 专辑信息: 
http://mobile.ximalaya.com/mobile/v1/album/track?albumId=4756811&pageId=3&pageSize=20&device=android&isAsc=true

#### 声音评论: 
http://mobile.ximalaya.com/mobile/track/comment?pageId=1&pageSize=20&trackId=28509037
