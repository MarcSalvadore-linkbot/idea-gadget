// const zh = require("./zh")
import zh from './zh'
import en from './en'

let i18n = en
try {
    var res = tt.getSystemInfoSync();
    if (res.language && res.language.indexOf('zh') != -1) {
        i18n = zh;
    }
    console.log(res)
} catch (error) {
    console.log(error);
}

export default i18n;
