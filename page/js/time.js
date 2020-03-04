// 将时间从格式化转化到时间戳
function convertTimeToTag(time) {
    let data = new Data(time);
    return data.getTime();
}