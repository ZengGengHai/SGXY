import config from '../config/config'


let getMerchants = (ctx, cb) => {
  let school_type = ctx.data.choose_id
  let tableId = config.TABLE_ID[school_type].MERCHANTS,
    Merchants = new wx.BaaS.TableObject(tableId)
  console.log(ctx.data.tabs.value, '分类')
  console.log(ctx, "ctx")
  let query1 = new wx.BaaS.Query()
  query1.in('category', [ctx.data.tabs.value]) // 识别分类
  // console.log(ctx.data)
  let query2 = new wx.BaaS.Query()
  query2.compare('priority', '>=', 1)
  let andQuery = wx.BaaS.Query.and(query1, query2)
  // 以 priority 字段升序
  Merchants.orderBy('priority')

  Merchants.setQuery(andQuery)
    .find(
    )
    .then(res => {
      cb(res);
      // console.log(res,'aaaa') 
    })
    .catch(err => console.dir(err))

}

let getMerchantDetail = (ctx, cb) => {
  let school_type = ctx.data.choose_id
  let tableId = config.TABLE_ID[school_type].MERCHANTS,
    recordId = ctx.data.merchantID,
    Merchants = new wx.BaaS.TableObject(tableId)

  Merchants.get(recordId)
    .then(res => {
      cb(res)
      // console.log(res,'aa');
    }
    )
    .catch(err => console.dir(err))
}
let getSearch = (ctx, cb) => {                           //模糊查询搜索            
  let school_type = ctx.data.choose_id
  let tableId = config.TABLE_ID[school_type].MERCHANTS,
    Merchants = new wx.BaaS.TableObject(tableId)
  console.log(ctx.data.text, '搜索')
  console.log(ctx, "ctx")
  let query1 = new wx.BaaS.Query()

  query1.contains('title', ctx.data.text)
  // console.log(ctx.data)
  let query2 = new wx.BaaS.Query()
  query2.compare('priority', '>=', 1)
  let andQuery = wx.BaaS.Query.and(query1, query2)
  // 以 priority 字段升序
  Merchants.orderBy('priority')

  Merchants.setQuery(andQuery)
    .find(
    )
    .then(res => {
      cb(res);

    })
    .catch(err => console.dir(err))

}

module.exports = {
  getMerchants,
  getMerchantDetail,
  getSearch,
}