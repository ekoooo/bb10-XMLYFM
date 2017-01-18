cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.blackberry.ui.dialog/www/client.js",
        "id": "com.blackberry.ui.dialog.client",
        "clobbers": [
            "blackberry.ui.dialog"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.toast/www/client.js",
        "id": "com.blackberry.ui.toast.client",
        "clobbers": [
            "blackberry.ui.toast"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.blackberry.ui.dialog": "1.0.0",
    "com.blackberry.ui.toast": "1.0.0"
}
// BOTTOM OF METADATA
});