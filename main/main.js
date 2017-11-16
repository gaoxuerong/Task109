let datbase = require('./datbase.js');
//统计条形码个数并且转换成数组对象形式，
function cartItem(inputs){
    let cartItems=[],
        obj=[];
    for(let i of inputs){
        if(i.indexOf('-')===-1){
            if(!cartItems[i]){
                cartItems[i]={};
                cartItems[i].barcode=i;
                cartItems[i].count=1;
            }else{

                cartItems[i].count++;
            }
        }else{
            let splits = i.split('-');
            if (!cartItems[i]) {
                cartItems[i]={};
                cartItems[i].barcode = splits[0];
                cartItems[i].count = splits[1];
            }
        }
    }
    for(let i in cartItems){
        obj.push(cartItems[i])

    }
    return obj;
}
//得到打折商品的名称，和单位
function getGifts(cartItem){
    let gifts = [],gift = [];
    let allItems = datbase.loadAllItems();
    let cartItems = cartItem;
    for(let key of cartItems){
        for(let  i of allItems){
            if(key.count>2){
                if(key.barcode===i.barcode){
                    if(!gifts[key.barcode]){
                        gifts[key.barcode] = {};
                        gifts[key.barcode].name = i.name;
                        gifts[key.barcode].unit = i.unit;
                    }
                }
            }
        }
    }
    for(let key in gifts){
        gift.push(gifts[key]);
    }
    return gift;
}
//商品清单
function getReceiptItems(cartItems){
    let getReceiptItems = [],
        getReceiptItem = [];
    let allItems = datbase.loadAllItems(),
        cartItem = cartItems;
    for(let item of cartItem) {
        for (let i of allItems) {
            if (item.barcode == i.barcode) {
                if (!getReceiptItems[item.barcode]) {
                    getReceiptItems[item.barcode] = {};
                    getReceiptItems[item.barcode].barcode = i.barcode;
                    getReceiptItems[item.barcode].name = i.name;
                    getReceiptItems[item.barcode].unit = i.unit;
                    getReceiptItems[item.barcode].price = i.price;
                    getReceiptItems[item.barcode].count = item.count;
                    if (getReceiptItems[item.barcode].count >2) {
                        getReceiptItems[item.barcode].subTotal =i.price * (item.count-1);
                    }else{
                        getReceiptItems[item.barcode].subTotal = i.price * item.count;
                    }

                }
            }
        }
    }
    for(let key in getReceiptItems){
        getReceiptItem.push(getReceiptItems[key]);
    }
    return getReceiptItem;
}
//统计总价钱和优惠的价钱
function getSummary(ReceiptItems){
    let summary = new Map();
    let receipt = ReceiptItems;
    receipt.forEach(function (item) {
        if(item.count >2){
            (!summary.has('total'))? summary.set('total',item.subTotal) : summary.set('total',summary.get('total')+item.subTotal);
            (!summary.has('saved'))? summary.set('saved',item.price) : summary.set('saved',summary.get('saved')+item.price);
        }else{
            (!summary.has('total'))? summary.set('total',item.subTotal) : summary.set('total',summary.get('total')+item.subTotal);
        }
    })
    return summary;
}
//打印总清单
function printInventory(ReceiptItems,gift,Summary){
    let receiptItem =ReceiptItems;
    let gifts =gift;
    let summarys = Summary;
    let result ='***<没钱赚商店>购物清单***\n';
    receiptItem.forEach(function (receiptItems){
        result+= '名称：'+receiptItems.name+'，数量：'+receiptItems.count+receiptItems.unit+'，单价：'+
            (receiptItems.price).toFixed(2)+ '(元)，小计：'+(receiptItems.subTotal).toFixed(2)+'(元)\n';
    })
    result += '----------------------\n'+'挥泪赠送商品：\n';
    gifts.forEach(function (gift){
        result += '名称：' + gift.name + '，数量：' + 1 + gift.unit + '\n';
    })
    result += '----------------------\n';
    result += '总计：'+(summarys.get('total')).toFixed(2)+
        '(元)\n' + '节省：'+(summarys.get('saved')).toFixed(2)+
        '(元)\n' + '**********************';
    console.log(result);
    return result;
}
module.exports = function main(inputs){
    let cartItems = cartItem(inputs);
    let gift = getGifts(cartItems);
    let ReceiptItems = getReceiptItems(cartItems);
    let Summary = getSummary(ReceiptItems);
    let result = printInventory(ReceiptItems,gift,Summary);
    return result;
}

