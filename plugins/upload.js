import Vue from 'vue'
import vUploader from 'v-uploader';
 
/**
 * v-uploader plugin global config
 */
const uploaderConfig = () => {
    return {
        uploadFileUrl: 'http://xxx/upload',
        deleteFileUrl: 'http://xxx/delete',
        showMessage: (vue, message) => {
            //using v-dialogs to show message
            vue.$vDialog.alert(message, null, {messageType: 'error'});
        }
    }
};
 
//install plugin with params
Vue.use(vUploader, uploaderConfig);