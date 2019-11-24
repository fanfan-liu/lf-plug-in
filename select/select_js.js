function diy_select() {
  this.init.apply(this, arguments)
};
diy_select.prototype = {
  init: function(opt) {
    this.setOpts(opt);
    this.timmer=new Date().getTime();
    this.likeData=[];//用来模糊查询存放的数据
    this.multipleData=[];//用来存放多选的数据
    this.target=document.getElementById(this.opt.TTContainer);
    if(this.target==null){
      console.error("Uncaught TypeError:'"+this.opt.TTContainer+"' is not find,or it's not a id DOM");
      return false;
    }
    this.showSelect();
  },
  addClass: function(o, s) {
    o.className = o.className ? o.className + ' ' + s : s;
  },
  removeClass: function(o, st) {
    var reg = new RegExp('\\b' + st + '\\b');
    o.className = o.className ? o.className.replace(reg, '') : '';
  },
  cleanClass:function(s){
    var len=this.l.children.length;
    for(var i=0;i<len;i++){
      var obj=this.l.children[i];
      this.removeClass(obj,'focus');
    }
  },
  addEvent: function(o, t, fn) {
    return o.addEventListener ? o.addEventListener(t, fn, false) : o.attachEvent('on' + t, fn);
  },
  showSelect: function() {
    var This = this;
    var iNow = 0;
    var conDom=document.getElementById(this.opt.TTContainer);
    var parentDom=conDom.parentNode;
    var div_select_dom=document.createElement('div');
    div_select_dom.className="div_select "+this.opt.skin+" div_select_"+this.timmer;
    parentDom.insertBefore(div_select_dom,conDom);
    var select_text_dom=document.createElement('div');
    select_text_dom.className='select_text'+" select_text_"+this.timmer;
    div_select_dom.append(select_text_dom);
    select_text_dom.append(conDom);
    conDom.setAttribute('type','hidden');
    var div_select_txt_dom=document.createElement('div');
    div_select_txt_dom.className="div_select_txt"+" div_select_txt_"+this.timmer;
    select_text_dom.append(div_select_txt_dom);
    if(this.opt.isLike){
      var likeInput=document.createElement('input');
      likeInput.className='allowLike';
      likeInput.setAttribute('type','input')
      div_select_txt_dom.append(likeInput);
      likeInput.onkeyup=function(e){
        This.l.style.display='block';
        This.inputChange(likeInput.value);
      }
    }
    var select_option_dom=document.createElement('div');
    select_option_dom.className="select_option"+" select_option_"+this.timmer;
    div_select_dom.append(select_option_dom);
    var ul_select_list_dom=document.createElement('ul');
    ul_select_list_dom.style.display="none";
    if(this.opt.multiple){
      var ul_select_multiple_class='multiple';
    }else{
      var ul_select_multiple_class='';
    }
    ul_select_list_dom.className='div_select_list '+ul_select_multiple_class+" div_select_list_"+this.timmer;
    select_option_dom.append(ul_select_list_dom);
    this.b=this.target.nextSibling;
    this.l=this.target.parentNode.nextSibling.children[0];
    var dataLen=this.opt.data.length;
    for(var i=0;i<dataLen;i++){
      var obj=this.opt.data[i];
      var value=obj[this.opt.key_value];
      var name=obj[this.opt.key_name];
      if(value==undefined){
        console.error("Uncaught TypeError:'data.value' is not find");
      }
      if(name==undefined){
        console.error("Uncaught TypeError:'data.name' is not find");
      }
      var li_dom=document.createElement('li');
      if(value===this.opt.defaultValue){
        this.target.value=value;
        this.b.innerHTML=name;
        li_dom.className='focus';
      }
      li_dom.innerHTML=name;
      li_dom.setAttribute('title',name);
      li_dom.setAttribute('data-value',value);
      This.l.append(li_dom);
    }
    this.addEvent(document, 'click', function(e) {
      if(e.path[0].parentNode.className.indexOf('div_select_list')==-1){
        This.l.style.display='none';
        This.removeClass(This.b,'showUl')
      }
    })
    this.target.onclick=this.b.onclick=function(ev){
      var e = window.event || ev;
      if(This.opt.data.length>0){
        This.item = This.l.getElementsByTagName('li');
        This.addClick(This.item);
      }
      This.l.style.display = This.l.style.display == 'block' ? 'none' : 'block';
      e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
      var offTop=This.target.parentNode.getBoundingClientRect().top;
      var clientHeight=document.documentElement.clientHeight;//可视区域大小
      var ulHeight=This.l.childNodes[0].offsetHeight;
      if(This.l.style.display == 'block'){
        This.addClass(This.b,'showUl');
        if(clientHeight/offTop<2){
          This.l.style.bottom=ulHeight+'px';
        }else{
          This.l.style.top=ulHeight+'px';
        }
      }else{
        This.removeClass(This.b,'showUl');
      }
    }
  },
  destruction:function(){
    var conDom=document.getElementById(this.opt.TTContainer);
    conDom.setAttribute('type','text');
    var parentDom=conDom.parentNode.parentNode;
    var grandParnentDom=parentDom.parentNode;
    grandParnentDom.insertBefore(conDom,parentDom);
    parentDom.remove();
  },
  inputChange:function(v){
    var len=this.opt.data.length;
    this.likeData=[];
    if(v!=''&&v!=null){
      var i=0;
      for(i;i<len;i++){
        var obj=this.opt.data[i];
        var name=obj[this.opt.key_name];
        if(name.indexOf(v)>-1){
          this.likeData.push(obj);
        }
      }
      this.updataList(this.likeData);
    }else{
      this.updataList(this.opt.data);
    }
  },
  addClick: function(o) {
    var _this=this;
    for(var i=0;i<o.length;i++){
      var obj=o[i];
      obj.onclick = function() {
        var value=this.getAttribute('data-value');
        var name=this.innerHTML;
        // 执行change事件
        if(value!=_this.target.value){
          _this.opt.selectChange(value);
        }
        if(this.className=='focus'){
          _this.removeClass(this,'focus');
          _this.removeValue(_this.multipleData,value);
        }else{
          _this.multipleData.push(value)
          _this.addClass(this,'focus');
        }
        if(_this.opt.multiple){
          _this.showMultipleSelect(_this.multipleData);
          _this.l.style.display='block';
        }else{
          _this.target.value=value;
          if(_this.opt.isLike){
            _this.b.children[0].value=name;
          }else{
            _this.b.innerHTML=name;
          }
          _this.cleanClass('focus');
          _this.addClass(this,'focus');
          _this.l.style.display='none';
        }
      }
    }
  },
  removeValue:function(a,v){
    var index=a.indexOf(v);
    if(index>-1){
      a.splice(index,1);
    }
  },
  showMultipleSelect:function(a){
    var aLen=a.length;
    var key_name_arr=[];
    for(var i=0;i<aLen;i++){
      var keyName=this.getData(a[i]);
      key_name_arr.push(keyName);
    }
    this.target.value=a.toString();
    if(this.opt.isLike){
      this.b.children[0].value=key_name_arr.toString();
    }else{
      this.b.innerHTML=key_name_arr.toString();
    }
  },
  getData(k){
    var result='';
    var len=this.opt.data.length
    for(var i=0;i<len;i++){
      var obj=this.opt.data[i];
      var value=obj[this.opt.key_value];
      var name=obj[this.opt.key_name];
      if(k==value){
        result=name;
        break;
      }
    }
    return result;
  },
  /**
   * 获取DOM节点
   * @param  {[type]} s class类名
   * @param  {[type]} p [description]
   * @param  {[type]} t [description]
   * @return {[type]}   [description]
   */
  getByClass: function(s, p, t) {
    var reg = new RegExp('\\b' + s + '\\b');
    var aResult = [];
    var aElement = (p || document).getElementsByTagName(t || '*');
    for (var i = 0; i < aElement.length; i++) {
      if (reg.test(aElement[i].className)) {
        aResult.push(aElement[i])
      }
    }
    return aResult;
  },
  setOpts: function(opt) {
    var defaults= {
      TTContainer: '',
      TTDiy_select_txt: 'diy_select_txt',
      TTDiy_select_btn: 'diy_select_btn',
      TTDiv_select_list: 'diy_select_list',
      multiple:false,//多选，默认false
      data:[],//数据
      key_value:'value',//数据中每个对象的key
      key_name:'name',//数据中每个对象的name
      skin:'',//皮肤
      defaultValue:'',//默认值
      isLike:false,//是否启用模糊搜索
      selectChange:function(event){}
    }
    this.opt = $.extend(defaults, opt);
  },
  /**
   * 更新列表
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  updataValue:function(d){
    this.opt.data=d;
    this.updataList(d);
  },
  updataList:function(d){
    this.l.innerHTML='';
    for(var i in d){
      var obj=d[i];
      var value=obj[this.opt.key_value];
      var name=obj[this.opt.key_name];
      var li_dom=document.createElement('li');
      li_dom.innerHTML=name;
      li_dom.setAttribute('title',name);
      li_dom.setAttribute('data-value',value);
      this.l.append(li_dom)
    }
    this.item = this.l.getElementsByTagName('li');
    this.addClick(this.item);
  },
  /**
   * 设置值
   * @param  {[type]} val [description]
   * @return {[type]}     [description]
   */
  setValue:function(val){
    this.cleanClass('focus');
    var showValue=[];
    var showName=[];
    if(this.opt.multiple){//多选
      var valArr=val.split(',');
      this.multipleData=valArr;
      for(var i=0;i<valArr.length;i++){
        var keyName=this.feedback(valArr[i]);
        showValue.push(keyName[0]);
        showName.push(keyName[1]);
      }
    }else{//单选
      var keyName=this.feedback(val);
      showValue.push(keyName[0]);
      showName.push(keyName[1]);
    }
    if(this.opt.isLike){
      this.b.children[0].value=showName.toString();
    }else{
      this.b.innerHTML=showName.toString();
    }
    this.target.value=showValue.toString();
  },
  /**
   * 获取值
   * @return {[type]} [description]
   */
  getValue:function(){
    return this.target.value;
  },
  /**
   * 在列表中回显
   * @param  {[type]} v [description]
   * @return {[type]}   [description]
   */
  feedback:function(v){
    var keyValue=[];
    var len=this.opt.data.length;
    if(len>0){
      for(var i=0;i<len;i++){
        var obj=this.opt.data[i];
        var objValue=obj[this.opt.key_value];
        var objName=obj[this.opt.key_name];
        if(objValue==v){
          keyValue.push(objValue)
          keyValue.push(objName);
          this.addClass(this.l.children[i],'focus');
          break;
        }
      }
      return keyValue;
    }else{
      return [v,v]
    }
  }
}
// var TTDiy_select = new diy_select({
//   TTContainer: 'selectForInput',
//   skin:'hah',
//   isLike:true,
//   multiple:true,
//   data:[
//     {value:1,name:'1天'},
//     {value:2,name:'2天'},
//     {value:3,name:'3天'},
//     {value:7,name:'7天'},
//     {value:30,name:'30天'},
//   ]
// });
// var riskState = new diy_select({
//   TTContainer: 'riskState',
//   skin:'hah',
//   defaultValue:0,
//   data:[
//     {value:1,name:'未开工'},
//     {value:0,name:'正在施工'},
//     {value:2,name:'已完成'}
//   ]
// });
// riskState.setValue(2)
// TTDiy_select.updataValue([
//   {value:1,name:'冯志勋'},
//   {value:2,name:'赵硕'},
//   {value:3,name:'赵通'},
//   {value:4,name:'刘怡欣'},
//   {value:5,name:'刘凡'},
//   {value:6,name:'胡晓龙'},
//   {value:7,name:'王刘豪'},
// ]);
// TTDiy_select.setValue('2,4,5,1')
