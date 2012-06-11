/**
 * By Shen Ke, 2012/4/19
 */

//Ext.require([
    //'Ext.navigation.View',
    //'Ext.ActionSheet',
    //'Ext.Button',
    //'Ext.Toolbar',
    //'Ext.XTemplate',
    //'Ext.Panel',
    //'Ext.SegmentedButton',
    //'Ext.util.JSONP',
    //'Ext.data.Store',
    //'Ext.Container',
    //'Ext.List',
    //'Ext.Img',
    //'Ext.carousel.Carousel',
    //'Ext.Component',
    //'Ext.DateExtras',
//]);

Ext.regModel('null', {
    fields: ['content','value']
});

Ext.create('Ext.data.Store', {
    id: 'aboutpage',
    model: 'null',
    autoLoad: true,
    getGroupString : function(record) {
        return record.get('value');
    },
    data: [
        {content: '<p class="item-style4"><font face="微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;谈纸间，心无间。——某知名互联网应用开发者。</font></p>' +
            '<p class="item-style4"><font face="微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一个为了把交流拉得最近最直接而诞生的应用。人人网很好地培养和聚集了当下走在流行前端的年轻人。' +
            '利用这样一个有强大涵盖力的用户群，应用的作用会挥发得更快更好。</font></p>' +
            '<p class="item-style4"><font face="微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一个以交流和学习为主题的社交平台。资料贴、问答堂、投票区、即时聊天，丰富的功能不仅满足了人们的学习、充电需求，也在纷繁芜杂的娱乐性应用中刮起一阵清新向上的学术风。</font></p>',
            value: '关于谈纸'},
        {content: '<p class="item-style4"><font face="微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们团队是一个五人组（按姓氏笔画排名）：' + '<br />' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邓宏琛，男，广东梅州人士；' + '<br />' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;刘家旗，男，北京人士；' + '<br />' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;沈<font color="white">一</font>科，男，江苏常州人士；' + '<br />' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;谢华梁，男，河北秦皇岛人士；' + '<br />' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;黄<font color="white">一</font>骁，男，山东泰安人士。</font></p>',
            value: '我们团队'},
        {content: '<p align="center" class="item-style4"><font face="微软雅黑"><strong>谈纸1.0</strong></font></p>' + '<br />'
            + '<p align="center" class="item-style4"><font face="微软雅黑">“谈纸”制作团队版权所有。</font></p>' +
            '<p align="center" class="item-style2"><font face="微软雅黑">Copyright ©2012 “谈纸”Team All Rights Reserved.</font></p>', value: '郑重声明'}
    ]
});

Ext.application({
    name:"NekoTrace",
    launch:function(){
        /**
         * 一些常量
         */
        var thumiao_disabled = true;

        var thumiao_listvoteitem= '<p class="vote-item-style1"><font face="微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;{title}</font></p>';

        var thumiao_listaskreply='<div class="newsitem" style="margin:-5px -5px -5px 24px"><table width="80%" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style2" align="center"><img src="{userimage}" width="40" height="40" /></div></td>    <td class="item-style4" width="260" height="24"><font face="微软雅黑"><strong>{name}</strong>：{words}</font></td>    <td width="66" rowspan="2"><div class="item-userimage-style2" align="center"><img style="display:none;" class="image" src="{painting}" width="40" height="40" /></div></td></tr>  <tr>    <td class="item-style2-foroneitem"><font face="微软雅黑">{time}</font> </td>    </tr> </table></div>';

        var thumiao_singleask='<div class="newsitem" align="center"><table width="80%" border="0">  <tr>    <td class="item-style4" width="318" height="34"><font face="微软雅黑">{content}</font></td>  </tr>    <tr>    <td><div align="left"><img style="display:none;" class="attachimg" width="150" height="150" src="{imageurl}" /></div></td>  </tr>  <tr>    <td class="item-style2-foroneitem"><font face="微软雅黑">{time} </font></td>  </tr>  </table></div>';

        var thumiao_listask='<div class="newsitem"><table width="260" border="0">  <tr>    <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{title}</strong>({name})</font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">描述：{content}</font> </td>  </tr> <tr> <td class="item-style2"><font face="微软雅黑">最近：{time}&nbsp;&nbsp;&nbsp;&nbsp;</font></td>  </tr><tr> <td class="item-style2"><font face="微软雅黑">标签：<div style="word-break:break-all;width:300px;margin:0 auto;" id="ask_t{id}">{tags}</div></font></td>  </tr></table></div>';

        var thumiao_listmsg='<div class="message-div" style="text-align:{mineornot}"><strong>{words}</strong></div><div class="item-message-style2" style="text-align:{mineornot}">{time}</div>';

        var thumiao_listreply= '<div class="newsitem" style="margin:-5px -5px -5px 24px"><table width="80%" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style2" align="center">{userimage}</div></td>    <td class="item-style4" width="318" height="24"><font face="微软雅黑"><strong>{name}</strong>：{words}</font></td>  </tr>  <tr>    <td class="item-style2-foroneitem"><font face="微软雅黑">{time}</font> </td>  </tr> </table></div>';

        var thumiao_listimp='<div style="text-align:center;">{content}</div>';

        var thumiao_listuser='<div class="newsitem"><table width="300" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img src="{userimage}" width="50" height="50" /></div></td>      <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{name}</strong></font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">最近登录在：{time}</font> </td>  </tr></table></div>';

        var thumiao_listlocation='<div class="newsitem"><table width="260" border="0">  <tr>    <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{name}</strong></font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">位置：{x}&nbsp;&nbsp;&nbsp;&nbsp;{y}</font> </td>  </tr></table></div>';

        var thumiao_singlenews = '<div class="newsitem" align="center"><table width="80%" border="0">  <tr>    <td class="item-style4" width="260" height="34"><font face="微软雅黑">{words}</font></td>  </tr>    <tr>    <td><div align="left"><img class="attachimg" width="150" style="display:{newsimageshow}" src="{newsimage}" /></div></td>  </tr>  <tr>    <td class="item-style2-foroneitem"><font face="微软雅黑">{time} {location} </font></td>  </tr>  </table></div>';

        var thumiao_listnotice= '<div class="newsitem"><table width="260" border="0">  <tr>    <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{title}</strong></font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">{time}&nbsp;&nbsp;&nbsp;&nbsp;</font> </td>  </tr></table></div>';

        var thumiao_listnews = '<div class="newsitem"><table width="260" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img src="{headurl}" width="50" height="50" /></div></td>    <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{name}</strong>：{words}</font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">{time}&nbsp;&nbsp;&nbsp;&nbsp;{locationname}</font> </td>  </tr>  <tr>    <td>&nbsp;</td>    <td><div align="center" class="item-newsimage-style1"><img class="attachimg" width="150" style="display:{newsimageshow}" src="{newsimage}" /></div></td>  </tr>  <tr>    <td>&nbsp;</td>    <td class="item-style3" align=right><font face="微软雅黑">评论({cnum})</font></td>  </tr></table></div>';

        var thumiao_listcat='<div class="newsitem"><table width="260" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img src="{userimage}" width="50" height="50" /></div></td>    <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{name}</strong></font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">{location}&nbsp;&nbsp;&nbsp;&nbsp;描述：{words}</font> </td>  </tr></table></div>';

        var thumiao_undercon = {xtype:'panel',html:'<div style="height:250px"></div><div style="text-align:center"><h1>施工中。。。</h1></div>'};

        var thumiao_about = '<div style="height:250px"></div><div style="text-align:center"><h1>由ThuNekoTrace小组制作</h1></div>';

        var thumiao_singleuserinfo = '<div class="preinfo-panel"><table width="260" border="0"><tr><td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img id="thumiao_userinfo_img" class="image" width="50" height="50" /></div></td></tr><tr><td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong><span id="thumiao_userinfo_name"></span></strong></font></td></tr></table></div>';

        var thumiao_singleouserinfo = '<div class="preinfo-panel"><table width="260" border="0"><tr><td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img id="thumiao_ouserinfo_img" class="image" width="50" height="50" /></div></td></tr><tr><td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong><span id="thumiao_ouserinfo_name"></span></strong></font></td></tr></table></div>';

        var thumiao_singlecatinfo = '<div class="preinfo-panel"><table width="260" border="0"><tr><td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img id="thumiao_catinfo_img" class="image" width="50" height="50" /></div></td></tr><tr><td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong><span id="thumiao_catinfo_name"></span></strong></font></td></tr></table></div>';

        var thumiao_listnotice =  '<div class="newsitem"><table width="260" border="0">  <tr>    <td class="item-style1" width="260" height="34"><font face="微软雅黑"><strong>{title}</strong></font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">{time}&nbsp;&nbsp;&nbsp;&nbsp;</font> </td>  </tr></table></div>';

        var thumiao_singlenotice = '<div class="article-style1"><p class="article-title"><font face="微软雅黑"><span id="thumiao_notice_title"></span></font></p><p class="article-time"><font face="微软雅黑"><span id="thumiao_notice_time"></span></font></p><p class="article-detail"><font face="微软雅黑"><span id="thumiao_notice_content"></span></font></p></div>';

        var thumiao_listvote = '<div class="newsitem"><table width="260" border="0">  <tr>    <td class="item-style1" width="318" height="34"><font face="微软雅黑"><strong>{title}</strong></font></td>  </tr>  <tr>    <td class="item-style2"><font face="微软雅黑">{time}&nbsp;&nbsp;&nbsp;&nbsp;{votes}人次参与</font> </td>  </tr></table></div>';

        //var thumiao_listvote = '';


        /**
         * 选择地点的按钮V
         */
        var chooseLocationBtn = Ext.create('Ext.Button',
            {
                //xtype: 'button',
                ui: 'drastic',
                text: '选择地点*',
                margin: 20,
                height: 10,
                width: 200,
                delegate: 'button',
                handler: function (button){
                    chooseaddress.showBy(button);
                    thumiao.PhoneSencha.setLocation();
                }
            });

        /**
         * 选择身份的按钮V
         */
        var chooseDignityBtn = Ext.create('Ext.Button',
            {
                //xtype: 'button',
                ui: 'drastic',
                text: '选择身份*',
                height: 10,
                width: 200,
                delegate: 'button',
                handler: function (button) {
                    choosecat.showBy(button);
                    thumiao.PhoneSencha.buttonCatListNews();
                }
            });

        /**
         * 添加新鲜事（必须选择口吻）V
         */
        var addnews = Ext.create('Ext.Panel',
            {
                scrollable: false,
                items: [
                    {
                        id:'thu_newNews_title',
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '发布新鲜事'
                    },
                    {
                        height:50,
                    },
                    {
                        xtype: 'fieldset',
                        instructions: '请填写内容',
                        margin: 20,
                        defaults: {
                            required  : true,
                            labelAlign: 'left',
                            labelWidth: '30%'
                        },
                        items: [
                            {
                                id:'thu_newNewsContent',
                                xtype: 'textareafield',
                                name: 'content',
                                label: '内容',
                                required: true,
                            },
                            // {
                            // 	xtype: 'textfield',
                            // 	name: 'filename',
                            // 	id:'thu_newsImage',
                            // 	inputType : 'file',
                            // 	label: '图片',
                            // 	placeHolder: '请输入图片URL',
                            // 	autoCapitalize : true,
                            // 	required: false,
                            // 	useClearIcon: true

                            // }
                        ]
                    },
                    {
                        layout: {
                            type : 'vbox',
                            align: 'middle'
                        },
                        items:[
                            // {
                            // 	xtype: 'spacer'
                            // },

                            // chooseDignityBtn,

                            {
                                xtype: 'spacer'
                            },

                            chooseLocationBtn,

                            {
                                xtype: 'spacer'
                            },
                            // {
                            // 	id:'thu_newImage',
                            // 	xtype: 'button',
                            // 	ui: 'drastic',
                            // 	text: '上传图片',
                            // 	height: 10,  
                            // 	width: 200,
                            // 	handler: function() 
                            // 	{           
                            // 		thumiao.PhoneSencha.newImage();           
                            // 	}
                            // },
                            // {
                            // 	xtype: 'spacer'
                            // }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [
                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '取消',
                                handler: function() {
                                    addnews.hide();
                                }
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'confirm',
                                text: '发布',
                                handler: function() {
                                    addnews.hide();
                                    thumiao.PhoneSencha.newNews();
                                }
                            }
                        ]
                    }
                ]
            });


        /**
         * 添加猫V
         */
        var addcat = Ext.create('Ext.Panel',
            {
                scrollable: false,
                items: [
                    {
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '添加猫',
                    },
                    {

                        //style: 'background-color: #eeeeee',
                        xtype: 'fieldset',
                        title: '基本资料',
                        instructions: '请如实填写您要新建的猫档案',
                        margin: 20,
                        defaults: {
                            required  : true,
                            labelAlign: 'left',
                            labelWidth: '30%'
                        },
                        items: [
                            {
                                id:'thu_catnewname',
                                xtype: 'textfield',
                                name: 'content',
                                label: '名字',
                                required: true
                            },
                            {
                                id:'thu_catnewsex',
                                xtype: 'selectfield',
                                name: 'sex',
                                label: '性别',
                                required: true,
                                valueField : 'value',
                                displayField : 'value',
                                store : Ext.create('Ext.data.Store', {
                                    id: 'sexofcat',
                                    model: 'null',
                                    getGroupString : function(record) {
                                        return record.get('value')[0];
                                    },
                                    data: [
                                        {
                                            value: '公',
                                        },
                                        {
                                            value: '母',
                                        },
                                        {
                                            value: '待测',
                                        }
                                    ]
                                }),
                            },
                            {
                                id:'thu_catnewintro',
                                xtype: 'textareafield',
                                name: 'content',
                                label: '简介',
                                required: true
                            },
                            {
                                xtype: 'textfield',
                                name: 'filename',
                                id:'thu_catImage',
                                inputType : 'file',
                                label: '图片',
                                placeHolder: '请输入图片URL',
                                autoCapitalize : true,
                                required: true,
                                useClearIcon: true
                            }
                        ]
                    },
                    {
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'spacer'
                            },
                            {
                                id:'thu_catNewImage',
                                xtype: 'button',
                                ui: 'drastic',
                                text: '上传头像*',
                                height: 10,
                                width: 125,
                                handler: function()
                                {
                                    thumiao.PhoneSencha.cNewImage();
                                }
                            },
                            {
                                xtype: 'spacer'
                            },
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [
                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '取消',
                                handler: function() {
                                    addcat.hide();
                                }
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'action',
                                text: '添加',
                                handler: function() {
                                    thumiao.PhoneSencha.newCat();
                                    addcat.hide();
                                }
                            }
                        ]
                    }
                ]
            });

        /**
         * 查看猫历史数据V
         */
        var seecatinfo = Ext.create('Ext.Panel',
            {
                items: [
                    {
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '查看历史数据'
                    },

                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [

                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '返回',
                                handler: function() {
                                    seecatinfo.hide();
                                }
                            },
                        ]
                    }
                ]
            });

        /**
         * 选择地点V
         */
        var chooseaddress = Ext.create('Ext.Panel',
            {
                items: [
                    {
                        id:'thu_locationSelect',
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '选择地点',
                    },
                    {
                        id:'thu_map1',
                        xtype: 'panel'
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [

                            //不能不选地点
                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '返回',
                                handler: function() {
                                    chooseaddress.hide();
                                    thumiao.PhoneSencha.justView = false;
                                    if(thumiao.PhoneSencha.inLLadd)
                                        thumiao.PhoneSencha.buttonLocationList();
                                }
                            },

                            { xtype: 'spacer' },

                            //输入框
                            {
                                id:'thu_newLocationName',
                                xtype      : 'textfield',
                                placeHolder: '输入新地点名',
                                width	   : 200
                            },

                            { xtype: 'spacer' },

                            {
                                id:'thu_newLocationOK',
                                xtype: 'button',
                                ui: 'drastic',
                                text: '添加',
                                handler: function() {
                                    thumiao.PhoneSencha.nnNewL();
                                }
                            },

                        ]
                    }
                ]
            });

        /**
         * 选择身份--具体某一只猫V
         */
        var choosecat = Ext.create('Ext.Panel',
            {
                layout: 'card',
                items: [
                    {
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '选择身份'
                    },
                    {
                        layout: 'card',
                        items:
                            [

                                //上方栏
                                {
                                    xtype: 'toolbar',
                                    docked: 'top',

                                    height: '40',

                                    layout: {
                                        pack: 'center',
                                        align: 'center',
                                    },

                                    scrollable: {
                                        direction: 'horizontal',
                                        indicators: false
                                    },

                                    //fullscreen: true,
                                    ui: 'plain',
                                    defaults: {
                                        iconMask: true,
                                        ui      : 'plain',
                                    },
                                    //ui: 'light',

                                    items: [
                                        //自定义添加
                                        {
                                            iconCls: 'add',
                                            delegate: 'button',
                                            handler: function (button) {
                                                addcat.showBy(button);
                                                thumiao.PhoneSencha.catImageInit();
                                            }
                                        },

                                        {xtype: 'spacer'},

                                        //查找
                                        {
                                            iconCls: 'search',
                                            delegate: 'button',
                                            handler: function (button) {
                                                searchSheet.showBy(button);
                                            }
                                        },
                                    ]
                                },

                                {
                                    id:'thu_catListNews',
                                    xtype: 'list',
                                    allowDeselect: false,
                                    disclosure: false,
                                    //store: 'CatListStore', //getRange(0, 9),
                                    itemTpl: thumiao_listcat,
                                },

                            ]
                    },


                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [

                            // { xtype: 'spacer' },

                            // //输入框
                            // {
                            // 	id:'thu_catListNewsName',
                            // 	xtype      : 'textfield',
                            // 	placeHolder: '猫名',
                            // 	width	   : 200
                            // },

                            { xtype: 'spacer' },

                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '确定',
                                handler: function() {
                                    thumiao.PhoneSencha.selectCatNews();
                                    choosecat.hide();

                                }
                            },

                        ]
                    }
                ]
            });

        /**
         * 添加新问题V
         */
        var addtopic = Ext.create('Ext.Panel',
            {
                scrollable: false,
                items: [
                    {
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '发布新问题'
                    },
                    {
                        xtype: 'fieldset',
                        title: '基本信息',
                        instructions: '请填写问题内容',
                        margin: 20,
                        defaults: {
                            required  : true,
                            labelAlign: 'left',
                            labelWidth: '30%'
                        },
                        items: [
                            {
                                id:'thu_newAskTopic',
                                xtype: 'textfield',
                                name: 'content',
                                label: '题目',
                                required: true
                            },
                            {
                                id:'thu_newAskContent',
                                xtype: 'textareafield',
                                name: 'content',
                                label: '描述',
                                required: true
                            },
                            {
                                xtype: 'textfield',
                                name: 'filename',
                                id:'userfile',
                                inputType : 'file',
                                label: '图片',
                                placeHolder: '请输入图片URL',
                                autoCapitalize : true,
                                required: false,
                                useClearIcon: true,
                                hidden:true,
                            }
                        ]
                    },
                    {
                        layout: {
                            type : 'vbox',
                            align: 'middle'
                        },
                        items:[
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '选择标签',
                                height: 10,
                                width: 200,
                                handler: function(btn)
                                {
                                    thumiao.PhoneSenchaWS.isFocusTags = false;
                                    choosetags.showBy(btn);
                                    thumiao.PhoneSenchaWS.setTags();
                                },
                            },
                            {
                                xtype: 'spacer'
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [
                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '取消',
                                handler: function() {
                                    //thumiao.PhoneSencha.allClear();           
                                    addtopic.hide();
                                }
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'confirm',
                                text: '发布',
                                handler: function() {
                                    if(thumiao.PhoneSenchaWS.newAsk())
                                        addtopic.hide();
                                }
                            }
                        ]
                    }
                ]
            });

        /**
         * 搜索遮罩层V
         */
        var searchSheet = Ext.create('Ext.ActionSheet',
            {
                //showAnimation: 'fadeIn',

                margin: '200 0 0 0',
                //bottom: 50%,
                floating: true,
                height: 350,
                ///width: 400,
                items: [
                    //输入框
                    {
                        xtype      : 'textfield',
                        //maxLength: 10,
                        style: 'background:white',
                        margin	   : 10,
                        placeHolder: '输入搜索条件',
                        //width	   : 300
                    },
                    {
                        xtype: 'button',
                        text: '取消',
                        margin	   : 10,
                        //itemId: 'pop',
                        handler: function() {

                            //view.pop();

                            //hide the sheet
                            searchSheet.hide();
                        }
                    },
                    {
                        text: '确定',
                        ui: 'decline',
                        margin	   : 10,
                        handler: function() {
                            //hide the sheet
                            searchSheet.hide();
                        }
                    }
                ]
            });

        /**
         * 评论遮罩层V
         */
        var commentSheet = Ext.create('Ext.ActionSheet',
            {
                margin: '280 0 0 0',
                //bottom: 50%,
                floating: true,
                height: 300,
                ///width: 400,
                items: [
                    //输入框
                    {
                        id:'thu_comment',
                        xtype      : 'textfield',
                        //maxLength: 10,
                        style: 'background:white',
                        margin	   : 10,
                        placeHolder: '输入评论',
                        height	   : 100
                    },
                    {
                        xtype: 'button',
                        text: '取消',
                        margin	   : 10,
                        //itemId: 'pop',
                        handler: function() {

                            //view.pop();

                            //hide the sheet
                            Ext.getCmp('thu_comment').setValue('');
                            commentSheet.hide();
                        }
                    },
                    {
                        text: '确定',
                        ui: 'decline',
                        margin	   : 10,
                        handler: function() {
                            //hide the sheet\
                            thumiao.PhoneSencha.reply();
                            Ext.getCmp('thu_comment').setValue('');
                            commentSheet.hide();
                        }
                    }
                ]
            });

        /**
         * 弹出遮罩层，用于添加投票选项V
         */
        var newVoteItemSheet = Ext.create('Ext.ActionSheet',
            {
                margin: '280 0 0 0',
                //bottom: 50%,
                floating: true,
                height: 600,
                ///width: 400,
                items: [
                    //输入框
                    {
                        xtype      : 'textfield',
                        //maxLength: 10,
                        style: 'background:white',
                        margin	   : 10,
                        placeHolder: '输入选项内容',
                        height	   : 100
                    },
                    {
                        xtype: 'button',
                        text: '取消',
                        margin	   : 10,
                        //itemId: 'pop',
                        handler: function() {

                            //view.pop();

                            //hide the sheet
                            newVoteItemSheet.hide();
                        }
                    },
                    {
                        text: '确定',
                        ui: 'decline',
                        margin	   : 10,
                        handler: function() {
                            //hide the sheet
                            newVoteItemSheet.hide();
                        }
                    }
                ]
            });

        /**
         * 选择画笔V
         */
        var drawtools = Ext.create('Ext.Panel',
            {
                scrollable: false,
                items: [
                    {
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '画笔选择'
                    },
                    {
                        xtype: 'fieldset',
                        title: '颜色',
                        margin: 20,
                        defaults: {
                            required  : true,
                            labelAlign: 'left',
                            labelWidth: '30%'
                        },
                        items: [
                            {
                                id:'thu_drawtcolors',
                                xtype: 'panel',
                                height:200,
                                //width:300,
                            },
                            {
                                id:'thu_drawtcolor',
                                xtype: 'textfield',
                                name: 'content',
                                label: '颜色',
                                required: true
                            },
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: '粗细',
                        margin: 20,
                        defaults: {
                            required  : true,
                            labelAlign: 'left',
                            labelWidth: '30%'
                        },
                        items: [
                            {
                                id:'thu_drawtwidths',
                                xtype: 'panel',
                                height:50,
                                //width:300,
                            },
                            {
                                id:'thu_drawtwidth',
                                xtype: 'textfield',
                                name: 'content',
                                label: '粗细',
                                required: true
                            },
                        ]
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'confirm',
                                text: '确定',
                                handler: function() {
                                    thumiao.canvas.width = Ext.getCmp('thu_drawtwidth').getValue();
                                    thumiao.canvas.color = Ext.getCmp('thu_drawtcolor').getValue();
                                    drawtools.hide();
                                }
                            }
                        ]
                    }
                ]
            });

        /**
         * 添加猫印象V
         */

        var addImpressionSheet = Ext.create('Ext.ActionSheet', {
            margin: '200 0 0 0',
            //bottom: 50%,
            floating: true,
            height: 350,
            ///width: 400,
            items: [
                //输入框
                {
                    id:'thu_catimptext',
                    xtype      : 'textfield',
                    //maxLength: 10,
                    style: 'background:white',
                    margin	   : 10,
                    placeHolder: '输入对它的印象',
                    height	   : 100
                },
                {
                    xtype: 'button',
                    text: '取消',
                    margin	   : 10,
                    //itemId: 'pop',
                    handler: function() {
                        Ext.getCmp('thu_catimptext').setValue('');
                        //hide the sheet
                        addImpressionSheet.hide();
                    }
                },
                {
                    text: '确定',
                    ui: 'decline',
                    margin	   : 10,
                    handler: function() {
                        thumiao.PhoneSencha.catImp();
                        //hide the sheet
                        addImpressionSheet.hide();
                    }
                }
            ]
        });

        /**
         * 添加人V
         */

        var addUserFocusSheet = Ext.create('Ext.ActionSheet', {
            margin: '200 0 0 0',
            //bottom: 50%,
            floating: true,
            height: 350,
            ///width: 400,
            items: [
                //输入框
                {
                    id:'thu_addfocustext',
                    xtype      : 'textfield',
                    //maxLength: 10,
                    style: 'background:white',
                    margin	   : 10,
                    placeHolder: '用户人人ID',
                    height	   : 50
                },
                {
                    xtype: 'button',
                    text: '取消',
                    margin	   : 10,
                    //itemId: 'pop',
                    handler: function() {
                        Ext.getCmp('thu_addfocustext').setValue('');
                        //hide the sheet
                        addUserFocusSheet.hide();
                    }
                },
                {
                    text: '确定',
                    ui: 'decline',
                    margin	   : 10,
                    handler: function() {
                        thumiao.PhoneSenchaWS.rridfocus();
                        //hide the sheet
                        addUserFocusSheet.hide();
                    }
                }
            ]
        });

        /**
         * 选择标签V
         */
        var choosetags = Ext.create('Ext.Panel',
            {
                items: [
                    {
                        id:'thu_tagSelect',
                        docked: 'top',
                        xtype : 'toolbar',
                        title : '选择标签',
                    },
                    {
                        html:'<div><div style="word-break:break-all;width:300px;margin:0 auto;" id="thu_tags"></div></div>',
                        xtype: 'panel',
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'dark',
                        items: [

                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '返回',
                                handler: function() {
                                    choosetags.hide();
                                }
                            },

                            { xtype: 'spacer' },

                            //输入框
                            {
                                id:'thu_newTagName',
                                xtype      : 'textfield',
                                placeHolder: '输入新标签名',
                                width	   : 150,
                            },

                            { xtype: 'spacer' },

                            {
                                xtype: 'button',
                                ui: 'drastic',
                                text: '添加',
                                handler: function() {
                                    thumiao.PhoneSenchaWS.nnNewTag();
                                }
                            },

                        ]
                    }
                ]
            });

        /**
         * 冒泡面板；
         * 位置不知道怎么调，理论上改bottom、left这些即可，用style的margin也很诡异。
         */
        var bubblePanel =  Ext.create('Ext.Panel',
            {
                fullscreen: true,
                html: '',
                style: 'margin: 400px 0px 0px 0px;',
                left: 1,
                bottom: 55,
                //docked: left,
                //height: 50,
                style: 'background-color: black; color: white;',
                padding: 10,
                margin: 5,
            });
        bubblePanel.hide();

        /**
         * 文件名遮罩层V
         */
        var filenameSheet = Ext.create('Ext.ActionSheet',
            {
                //showAnimation: 'fadeIn',

                margin: '200 0 0 0',
                //bottom: 50%,
                floating: true,
                height: 350,
                ///width: 400,
                items: [
                    //输入框
                    {
                        id:'thu_canvas_name',
                        xtype      : 'textareafield',
                        //maxLength: 10,
                        style: 'background:white',
                        margin	   : 10,
                        placeHolder: '文件名（将保存至/Root/Thu_Miao/下，重名会自动重命名）',
                    },
                    {
                        xtype: 'button',
                        text: '取消',
                        margin	   : 10,
                        //itemId: 'pop',
                        handler: function() {
                            filenameSheet.hide();
                        }
                    },
                    {
                        text: '确定',
                        ui: 'decline',
                        margin	   : 10,
                        handler: function() {
                            //hide the sheet
                            var oCanvas = document.getElementById("thu_canvas");
                            try{
                                var name = Ext.getCmp('thu_canvas_name').getValue();
                                if(name == "") return;
                                //name += ".bmp";
                                Canvas2Image.saveAsBMP(oCanvas);
                                var nameString = window.mc.write(g_strData, name);
                                nameString = "已保存至："+nameString;
                                thumiao.PhoneSenchaWS.bubble(nameString);
                                filenameSheet.hide();
                            }
                            catch(e){
                                alert(e);
                            }
                        }
                    }
                ]
            });


        /**
         * 添加新投票
         */

        var addvote = Ext.create('Ext.Panel', {
            title: '新投票',
            layout: 'fit',
            cls: 'demo-list',
            displayField: 'title',
            scrollable: true,

            items: [
                {
                    docked: 'top',
                    xtype : 'toolbar',
                    title : '投票'
                },
                //下方栏
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'dark',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'drastic',
                            text: '取消',
                            handler: function() {
                                addvote.hide();
                            }
                        },
                        {
                            xtype: 'spacer'
                        },
                        {
                            iconCls: 'add',
                            iconMask: true,
                            ui: 'action',
                            delegate: 'button',
                            handler: function(button) {
                                newVoteItemSheet.showBy(button);
                                Ext.getCmp('thu_vote_add').setValue('');
                            }
                        },
                        {
                            xtype: 'spacer'
                        },
                        {
                            xtype: 'button',
                            ui: 'action',
                            text: '发布',
                            handler: function() {
                                thumiao.PhoneSencha.voteCommit();
                            }
                        }
                    ]
                },

                {
                    id:'thu_vote_title',
                    xtype: 'container',
                    fullscreen: true,

                    layout: 'fit',
                    style: 'background-color: #eeeeee',
                    items:
                        [

                            {
                                docked: 'top',

                                scrollable: false,

                                xtype: 'fieldset',
                                title: '投票内容',
                                instructions: '请填写以上内容并点击底部“+”添加选项',
                                margin: 20,
                                defaults: {
                                    required  : true,
                                    labelAlign: 'left',
                                    labelWidth: '20%'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'votename',
                                        id:'votetitle',
                                        inputType : 'file',
                                        label: '题目',
                                        required: true,
                                        useClearIcon: true

                                    },
                                    {
                                        xtype: 'textareafield',
                                        name: 'content',
                                        label: '描述',
                                        required: false
                                    }
                                ]
                            },


                            //下面显示选项列表
                            {
                                id:'thu_vote_choice_list',
                                docked: 'top',
                                xtype: 'list',
                                mode: 'SINGLE',
                                allowDeselect: true,
                                disclosure: true,
                                disableSelection: true,
                                scrollable: false,
                                //padding: 5,
                                onItemDisclosure: {
                                    handler: function(record, btn, index) {
                                        thumiao.PhoneSencha.choiceToDel = record.data.id;
                                        deleteItemSheet.show();
                                    }
                                },
                                itemTpl: '<p class="vote-item-style1"><font face="微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;{value}</font></p>',
                            },

                        ]
                }
            ]

        });

        var deleteItemSheet = Ext.create('Ext.ActionSheet', {
            margin: '280 0 0 0',
            //bottom: 50%,
            floating: true,
            height: 200,
            ///width: 400,
            items: [
                {
                    xtype: 'button',
                    text: '保留',
                    margin	   : 10,
                    //itemId: 'pop',
                    handler: function() {

                        deleteItemSheet.hide();
                    }
                },
                {
                    text: '删除',
                    ui: 'decline',
                    margin	   : 10,
                    handler: function() {
                        if(thumiao.PhoneSencha.deleteChoice())
                            deleteItemSheet.hide();
                    }
                }
            ]
        });

        var newVoteItemSheet = Ext.create('Ext.ActionSheet', {
            margin: '280 0 0 0',
            //bottom: 50%,
            floating: true,
            height: 600,
            ///width: 400,
            items: [
                //输入框
                {
                    id:'thu_vote_add',
                    xtype      : 'textfield',
                    //maxLength: 10,
                    style: 'background:white',
                    margin	   : 10,
                    placeHolder: '输入选项内容',
                    height	   : 100,
                },
                {
                    xtype: 'button',
                    text: '取消',
                    margin	   : 10,
                    //itemId: 'pop',
                    handler: function() {
                        newVoteItemSheet.hide();
                    }
                },
                {
                    text: '确定',
                    ui: 'decline',
                    margin	   : 10,
                    handler: function() {
                        if(thumiao.PhoneSencha.addChoice())
                            newVoteItemSheet.hide();
                    }
                }
            ]
        });

        var voteItemSheet = Ext.create('Ext.ActionSheet', {
            margin: '280 0 0 0',
            //bottom: 50%,
            floating: true,
            height: 200,
            ///width: 400,
            items: [
                {
                    xtype: 'button',
                    text: '投票',
                    margin	   : 10,
                    //itemId: 'pop',
                    handler: function() {
                        thumiao.PhoneSencha.voteChoiceF();
                        voteItemSheet.hide();
                        view.pop();
                    }
                },
                {
                    text: '取消',
                    ui: 'decline',
                    margin	   : 10,
                    handler: function() {
                        voteItemSheet.hide();
                    }
                }
            ]
        });

        Ext.create('Ext.data.Store', {
            id: 'VoteListStore',
            model: 'null',
            //sorters: 'time',
            sorters: [
                {
                    // 时间逆序
                    sorterFn: function(record1, record2) {
                        var time1 = record1.data.time,
                            time2 = record2.data.time;

                        return time1 > time2 ? 1 : (time1 == time2 ? 0 : -1);
                    },
                    direction: 'DESC'
                }
            ],
            getGroupString : function(record) {
                return record.get('time')[0];
            },
            data: [
                {
                    id: 0,
                    time: '2012-4-25 12:12',
                    title: '哪只猫最可爱',
                    launcher: '王尼玛',
                    detail: '选出清华园最口耐的喵',
                    joined: '1',
                    singleornot: '1',
                    joinedornot: '0'
                },
                {
                    id: 1,
                    time: '2012-4-25 12:11',
                    title: '给猫喂什么好',
                    launcher: '邓尼玛',
                    detail: '猫最喜欢吃什么？最好吃什么？',
                    joined: '0',
                    singleornot: '1',
                    joinedornot: '1'
                },
            ]
        });


        /**
         * 整个界面的支架：切换模板
         */
        var view = Ext.create('Ext.NavigationView',
            {

                fullscreen: true,
                items: [

                /**
                 * 0-主页
                 */

                    {
                        xtype: 'tabpanel',

                        ui: 'dark',

                        title: '首页',
                        tabBar: {
                            docked: 'bottom',
                            layout: {
                                pack: 'center'
                            }
                        },
                        fullscreen: true,
                        //ui: 'light',
                        defaults: {
                            scrollable: true
                        },

                        items: [

                            //1-导航
                            {

                                ui: 'light',

                                xtype: 'panel',
                                title: '导航',

                                iconCls: 'home',

                                layout: {
                                    type : 'vbox',
                                    align: 'middle'
                                },

                                //导航页面
                                items: [
                                    {
                                        layout: 'hbox',
                                        items:
                                            [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'time',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '新鲜事',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        //we already have other items in this navigation view, so we can simply use an index if we want
                                                        view.push(1);
                                                        thumiao.PhoneSencha.all1();
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'bookmarks',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '知识站',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        //we already have other items in this navigation view, so we can simply use an index if we want
                                                        thumiao.PhoneSencha.buttonCatList('thu_catList');
                                                        view.push(2);
                                                    }
                                                },
                                            ]
                                    },
                                    {
                                        layout: 'hbox',
                                        items:
                                            [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'user',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '个人志',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        view.push(3);
                                                        thumiao.PhoneSencha.userInfo();
                                                        thumiao.PhoneSenchaWS.focusListName = 'thu_focusList2';
                                                        thumiao.PhoneSenchaWS.getFocusList();
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'locate',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '位置',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        //we already have other items in this navigation view, so we can simply use an index if we want
                                                        thumiao.PhoneSencha.buttonLocationList();
                                                        view.push(4);
                                                    }
                                                },
                                            ]
                                    },
                                    {
                                        layout: 'hbox',
                                        items:
                                            [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'star',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '留言板',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        //we already have other items in this navigation view, so we can simply use an index if we want
                                                        view.push(5);

                                                        thumiao.PhoneSenchaWS.focusListName = 'thu_focusList';
                                                        thumiao.PhoneSenchaWS.getFocusList();
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'time',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '问答堂',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        //we already have other items in this navigation view, so we can simply use an index if we want
                                                        view.push(14);
                                                        thumiao.PhoneSenchaWS.askList();
                                                    }
                                                },
                                            ]
                                    },
                                    {
                                        layout: 'hbox',
                                        items:
                                            [
                                                {
                                                    //hidden:true,
                                                    //disabled:thumiao_disabled,
                                                    xtype: 'button',
                                                    iconCls: 'compose',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '投票',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        //we already have other items in this navigation view, so we can simply use an index if we want
                                                        view.push(7);
                                                        thumiao.PhoneSencha.voteList();
                                                    }
                                                },
                                                {
                                                    //hidden:true,
                                                    //disabled:thumiao_disabled,
                                                    xtype: 'button',
                                                    iconCls: 'team',
                                                    //delegate: 'button',
                                                    iconMask: true,
                                                    iconAlign: 'top',
                                                    text: '群消息',
                                                    //badgeText: '123',
                                                    border: 4,
                                                    width: 100,
                                                    margin: 20,

                                                    handler: function() {
                                                        thumiao.PhoneSencha.noticeAll();
                                                        view.push(6);
                                                    }
                                                },

                                            ]
                                    }
                                ],


                                cls: 'blog',
                                displayField: 'title',


                            },

                            //2-关于
                            {

                                ui: 'light',

                                title: '关于',
                                iconCls: 'info',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,
                                items: [
                                    {
                                        xtype: 'list',
                                        mode: 'SINGLE',
                                        allowDeselect: true,
                                        disclosure: false,
                                        grouped: true,
                                        //indexBar: true,
                                        store: 'aboutpage',
                                        itemTpl:'{content}',
                                    }
                                ]

                            },

                        ]
                    },


                /**
                 * 1-新鲜事
                 */
                    {
                        ui: 'light',

                        title: '新鲜事',
                        layout: 'card',
                        items:
                            [

                                //全部新鲜事
                                {
                                    ui: 'light',

                                    xtype: 'panel',
                                    title: '全部',
                                    iconCls: 'maps',
                                    scrollable: false,
                                    layout: 'fit',
                                    cls: 'demo-list',

                                    //disableSelection: true,

                                    items: [

                                        //上方栏
                                        {
                                            xtype: 'toolbar',
                                            docked: 'top',

                                            height: '40',

                                            layout: {
                                                pack: 'center',
                                                align: 'center'
                                            },

                                            scrollable: {
                                                direction: 'horizontal',
                                                indicators: false
                                            },

                                            //fullscreen: true,
                                            ui: 'plain',
                                            defaults: {
                                                iconMask: true,
                                                ui      : 'plain',

                                            },
                                            //ui: 'light',
                                            items: [

                                                //撰写
                                                {
                                                    //ui: 'back',
                                                    iconCls: 'compose',
                                                    delegate: 'button',
                                                    handler: function (button) {
                                                        chooseDignityBtn.setDisabled(false);
                                                        chooseLocationBtn.setDisabled(false);
                                                        addnews.showBy(button);
                                                        Ext.getCmp('thu_newNews_title').setTitle('发布新鲜事');
                                                        chooseLocationBtn.show();
                                                        thumiao.PhoneSencha.newFstate = 0;
                                                        //all news
                                                        thumiao.PhoneSencha.newImageInit(true,true);
                                                    }

                                                },

                                                { xtype: 'spacer' },

                                                //刷新
                                                {
                                                    //ui: 'default',
                                                    //text: '刷新',
                                                    iconCls: 'refresh',
                                                    //width: 44,
                                                    //height: 20
                                                    delegate: 'button',
                                                    handler: function (button) {
                                                        thumiao.PhoneSencha.all0();
                                                    }
                                                },

                                            ]
                                        },

                                        {

                                            //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                            //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                            id:'thu_newsList',
                                            xtype: 'list',
                                            mode: 'SINGLE',
                                            disableSelection: true,
                                            allowDeselect: true,
                                            disclosure: true,
                                            onItemDisclosure: function(record, btn, index) {
                                                if(record.data.newstype == 5){
                                                    //thumiao.PhoneSenchaWS.bubble("请到问答堂参与问题的讨论~");
                                                    view.push(15);
                                                    thumiao.PhoneSenchaWS.setAskCur(record);
                                                    return;
                                                }
                                                if(record.data.newstype == 3){
                                                    view.push(13);
                                                    thumiao.PhoneSencha.voteSingle(record);
                                                    return;
                                                }
                                                if(record.data.newstype == 2){
                                                    thumiao.PhoneSencha.noticeOne(record);
                                                    view.push(17);
                                                    return;
                                                }
                                                view.push(9);
                                                thumiao.PhoneSencha.oneNews(record);
                                                //Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                            },
                                            itemTpl: thumiao_listnews
                                        }]


                                },

                            ]
                    },

                /**
                 * 2-猫志
                 */
                    {


                        title: '知识站',
                        layout: 'card',
                        items:
                            [

                                //上方栏
                                {
                                    xtype: 'toolbar',
                                    docked: 'top',

                                    height: '40',

                                    layout: {
                                        pack: 'center',
                                        align: 'center'
                                    },

                                    scrollable: {
                                        direction: 'horizontal',
                                        indicators: false
                                    },

                                    //fullscreen: true,
                                    ui: 'plain',
                                    defaults: {
                                        iconMask: true,
                                        ui      : 'plain',
                                    },
                                    //ui: 'light',

                                    items: [
                                        //自定义添加
                                        // {
                                        // 	iconCls: 'add',
                                        // 	delegate: 'button',
                                        // 	handler: function (button) {
                                        // 		addcat.showBy(button);
                                        // 		thumiao.PhoneSencha.catImageInit();
                                        // 	}
                                        // },

                                        {xtype: 'spacer'},

                                        {
                                            xtype: 'segmentedbutton',
                                            items: [
                                                {
                                                    text: '列表',
                                                    pressed: true,
                                                    handler: function(btn){
                                                        thumiao.PhoneSencha.buttonCatList('thu_catList');
                                                    }
                                                },
                                                {
                                                    text: '关注',
                                                    handler: function(btn){
                                                        thumiao.PhoneSencha.buttonCatFocusList(thumiao.userID,'thu_catList');
                                                    }
                                                }
                                            ]
                                        },
                                        {xtype: 'spacer'},

                                        //查找
                                        // {
                                        // 	iconCls: 'search',
                                        // 	delegate: 'button',
                                        // 	disabled:true,
                                        // 	handler: function (button) {
                                        // 		searchSheet.showBy(button);
                                        // 	}
                                        // },
                                    ]
                                },

                                {
                                    id:'thu_catList',
                                    xtype: 'list',
                                    allowDeselect: true,
                                    onItemDisclosure: function(record, btn, index) {
                                        thumiao.PhoneSencha.canChange = false;
                                        thumiao.PhoneSencha.viewCat(record.data['id']);
                                        thumiao.PhoneSencha.catNews(record);
                                        thumiao.PhoneSencha.CICatData();
                                        //thumiao.PhoneSencha.focusCat();
                                        view.push(8);
                                    },
                                    //store: 'CatListStore', //getRange(0, 9),
                                    itemTpl: thumiao_listcat,
                                }

                            ]
                    },

                /**
                 * 3-个人志
                 */
                    {
                        ui: 'light',

                        title: '个人志',
                        layout: 'card',
                        //padding: 10,
                        items:
                            [
                                {
                                    xtype: 'tabpanel',
                                    tabBar: {
                                        docked: 'bottom',
                                        layout: {
                                            pack: 'center'
                                        }
                                    },
                                    fullscreen: true,
                                    //ui: 'light',
                                    defaults: {
                                        scrollable: true
                                    },

                                    items: [

                                        //
                                        //1-个人档案
                                        //

                                        {
                                            id:'thu_userInfo',
                                            xtype: 'formpanel',
                                            title: '档案',
                                            iconCls: 'bookmarks',
                                            cls: 'card1',
                                            displayField: 'title',
                                            standardSubmit: false,

                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    width:'80%',
                                                    html: thumiao_singleuserinfo,
                                                },

                                                {
                                                    xtype: 'fieldset',
                                                    title: '基本资料',
                                                    margin: 20,
                                                    defaults: {
                                                        required  : true,
                                                        labelAlign: 'left',
                                                        labelWidth: '40%'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            label: '人人ID',
                                                            disabled:true,
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: '注册时间',
                                                            disabled:true,
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: '最近登录',
                                                            disabled:true,
                                                        },
                                                        {
                                                            id: 'thumiao_userinfo_intro',
                                                            xtype: 'textareafield',
                                                            label: '个人介绍',
                                                            clearIcon: false,
                                                        },
                                                    ]
                                                },


                                                {
                                                    xtype: 'toolbar',
                                                    docked: 'top',
                                                    height: '40',

                                                    layout: {
                                                        pack: 'center',
                                                        align: 'center'
                                                    },

                                                    scrollable: {
                                                        direction: 'horizontal',
                                                        indicators: false
                                                    },

                                                    //fullscreen: true,
                                                    ui: 'plain',
                                                    defaults: {
                                                        iconMask: true,
                                                        ui      : 'plain',

                                                    },
                                                    items: [

                                                        {xtype: 'spacer'},

                                                        {
                                                            text: '更新',
                                                            ui: 'default',
                                                            handler: function() {
                                                                thumiao.PhoneSencha.userSet();
                                                            }

                                                        }
                                                    ],

                                                }
                                            ],


                                        },


                                        //2-关注
                                        {
                                            xtype: 'panel',
                                            title: '关注',
                                            html: '<h1>关注</h1><p>--关注</p>',
                                            iconCls: 'star',
                                            layout: 'fit',
                                            cls: 'demo-list',
                                            displayField: 'title',
                                            scrollable: false,

                                            items: [
                                                //上方栏
                                                {
                                                    xtype: 'toolbar',
                                                    docked: 'top',

                                                    height: '40',

                                                    layout: {
                                                        pack: 'center',
                                                        align: 'center'
                                                    },

                                                    scrollable: {
                                                        direction: 'horizontal',
                                                        indicators: false
                                                    },

                                                    //fullscreen: true,
                                                    ui: 'plain',
                                                    defaults: {
                                                        iconMask: true,
                                                        ui      : 'plain',

                                                    },
                                                    //ui: 'light',
                                                    items: [


                                                        //添加
                                                        {
                                                            //ui: 'back',
                                                            //text: '添加',
                                                            iconCls: 'add',
                                                            //html: '<p><a href="Index.html"></a><p>',
                                                            width: 40,
                                                            delegate: 'button',
                                                            handler: function (button) {
                                                                thumiao.PhoneSenchaWS.focusListName = 'thu_focusList2';
                                                                addUserFocusSheet.showBy(button);
                                                            }
                                                            //height: 20
                                                        },

                                                        { xtype: 'spacer' },

                                                        //删除
                                                        // {
                                                        // 	//ui: 'default',
                                                        // 	//text: '删除',
                                                        // 	iconCls: 'trash',
                                                        // 	//width: 44,
                                                        // 	//height: 20
                                                        // },

                                                    ]
                                                },

                                                {
                                                    id:'thu_focusList2',
                                                    //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                                    //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                                    xtype: 'list',
                                                    allowDeselect: true,
                                                    onItemDisclosure: function(record, btn, index) {
                                                        view.push(16);
                                                        thumiao.PhoneSencha.curNewsUserID = record.data.id;
                                                        thumiao.PhoneSencha.canChangeU = false;
                                                        thumiao.PhoneSencha.oneNewsUser();
                                                        //Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                                    },
                                                    //store: 'CatListStore', //getRange(0, 9),
                                                    itemTpl: thumiao_listuser,
                                                }

                                            ]

                                        },

                                        //3-设置
                                        {
                                            title: '设置',
                                            xtype: 'formpanel',
                                            iconCls: 'settings',
                                            cls: 'card1',
                                            displayField: 'title',

                                            standardSubmit: false,

                                            //width: '80%',

                                            items: [

                                                {
                                                    id:'thu_toggles',
                                                    xtype: 'fieldset',
                                                    title: '是否提醒',
                                                    margin: 20,
                                                    defaults: {
                                                        required  : true,
                                                        labelAlign: 'left',
                                                        labelWidth: '70%'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'togglefield',
                                                            name : 'ifbubble_rscrpl',
                                                            label: '用户上下线',
                                                            values:1,
                                                        },
                                                        {
                                                            xtype: 'togglefield',
                                                            name : 'ifbubble_sign',
                                                            label: '用户签到',
                                                            values:1,
                                                        },
                                                        {
                                                            xtype: 'togglefield',
                                                            name : 'ifbubble_chat',
                                                            label: '聊天回复',
                                                            values:1,
                                                        },
                                                        {
                                                            xtype: 'togglefield',
                                                            name : 'ifbubble_newsrpl',
                                                            label: '新提问',
                                                            values:1,
                                                        },
                                                        {
                                                            xtype: 'togglefield',
                                                            name : 'ifbubble_topicrpl',
                                                            label: '问答堂点评',
                                                            values:0,
                                                        },
                                                    ]
                                                },

                                            ],

                                        },

                                    ]
                                },
                            ]
                    },

                /**
                 * 4-位置
                 */
                    {
                        title: '位置',
                        layout: 'card',
                        //padding: 10,
                        items: [
                            {
                                xtype: 'panel',
                                title: '位置',
                                //fullscreen: true,
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [

                                    //上方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',
                                        },
                                        //ui: 'light',

                                        items: [
                                            //自定义添加
                                            {
                                                iconCls: 'add',
                                                delegate: 'button',
                                                handler: function (button) {
                                                    Ext.getCmp('thu_locationSegBut1').setPressedButtons([0]);
                                                    chooseaddress.showBy(button);
                                                    thumiao.PhoneSencha.addLocation();
                                                }
                                            },

                                            {xtype: 'spacer'},

                                            {
                                                id:'thu_locationSegBut1',
                                                xtype: 'segmentedbutton',
                                                items: [
                                                    {
                                                        text: '列表',
                                                        pressed: true,
                                                    },
                                                    {
                                                        text: '地图',
                                                        handler:function(btn){
                                                            Ext.getCmp('thu_locationSegBut1').setPressedButtons([0]);
                                                            chooseaddress.showBy(btn);
                                                            thumiao.PhoneSencha.addLocation();
                                                        }
                                                    }
                                                ]
                                            },
                                            {xtype: 'spacer'},

                                            //冒泡
                                            {
                                                iconCls: 'search',
                                                delegate: 'button',
                                                handler: function (button) {
                                                    chooseaddress.showBy(button);
                                                    thumiao.PhoneSenchaWS.showUsersLocation();
                                                }
                                            },
                                        ]
                                    },

                                    {
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        id:'thu_locationList',
                                        xtype: 'list',
                                        allowDeselect: true,
                                        onItemDisclosure: function(record, btn, index) {
                                            view.push(11);
                                            thumiao.PhoneSencha.locationNews(record);
                                            //Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                        },
                                        //store: 'LocationListStore', //getRange(0, 9),
                                        itemTpl: thumiao_listlocation,
                                    }

                                ]

                            },

                        ]
                    },

                /**
                 * 5-留言板
                 */
                    {
                        title: '留言板',
                        layout: 'card',
                        //padding: 10,
                        items: [


                            {
                                xtype: 'panel',
                                //title: '留言板',
                                //html: '<h1>留言</h1><p>--留言</p>',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [
                                    //上方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',

                                        },
                                        //ui: 'light',
                                        items: [

                                            //添加
                                            {
                                                //ui: 'back',
                                                //text: '添加',
                                                iconCls: 'add',
                                                //html: '<p><a href="Index.html"></a><p>',
                                                width: 40,
                                                delegate: 'button',
                                                handler: function (button) {
                                                    thumiao.PhoneSenchaWS.focusListName = 'thu_focusList';
                                                    addUserFocusSheet.showBy(button);
                                                }
                                                //height: 20
                                            },

                                            { xtype: 'spacer' },

                                            //删除
                                            {
                                                //ui: 'default',
                                                //text: '删除',
                                                iconCls: 'trash',
                                                //width: 44,
                                                //height: 20
                                            },

                                        ]
                                    },

                                    {
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        id:'thu_focusList',
                                        xtype: 'list',
                                        allowDeselect: false,
                                        onItemDisclosure: function(record, btn, index) {
                                            view.push(12);
                                            thumiao.PhoneSenchaWS.setCurFocus(record);
                                            thumiao.PhoneSenchaWS.moreMsg();
                                        },
                                        //store: 'UsermessageListStore', //getRange(0, 9),
                                        itemTpl: thumiao_listuser,
                                    }

                                ]

                            },

                        ]
                    },

                /**
                 * 6-群消息
                 */
                    {
                        title: '公告栏',
                        layout: 'card',
                        //padding: 10,
                        items:
                            [

                                {

                                    xtype: 'panel',
                                    iconCls: 'info',
                                    scrollable: false,
                                    layout: 'fit',
                                    cls: 'demo-list',
                                    items:
                                        [
                                            {
                                                id:'thu_notice',
                                                //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                                //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                                xtype: 'list',
                                                allowDeselect: true,
                                                onItemDisclosure: function(record, btn, index) {
                                                    thumiao.PhoneSencha.noticeOne(record);
                                                    view.push(17);

                                                },
                                                itemTpl:thumiao_listnotice,
                                            }
                                        ]

                                },
                            ]
                    },

                /**
                 * 7-投票
                 */
                    {
                        title: '投票',
                        layout: 'card',
                        items:[
                            {
                                xtype: 'panel',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [
                                    //上方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',

                                        },
                                        //ui: 'light',
                                        items: [

                                            //发起
                                            {
                                                //ui: 'back',
                                                iconCls: 'compose',
                                                //html: '<p><a href="Index.html"></a><p>',
                                                width: 40,
                                                handler: function (button) {
                                                    addvote.showBy(button);
                                                    thumiao.PhoneSencha.voteReset();
                                                }
                                            },

                                            // { xtype: 'spacer' },

                                            // //显示方式
                                            // {
                                            // 	xtype: 'segmentedbutton',
                                            // 	items: [
                                            // 		{ text: '全部', pressed: true },
                                            // 		{ text: '我的' }
                                            // 	]
                                            // },

                                            // { xtype: 'spacer' },

                                            // //查找
                                            // {
                                            // 	iconCls: 'search',
                                            // 	delegate: 'button',
                                            // 	handler: function (button) {
                                            // 		searchSheet.showBy(button);
                                            // 	}
                                            // },

                                        ]
                                    },

                                    {
                                        id:'thu_vote_list',
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        xtype: 'list',
                                        allowDeselect: true,
                                        onItemDisclosure: function(record, btn, index) {
                                            view.push(13);
                                            thumiao.PhoneSencha.voteSingle(record);
                                        },
                                        itemTpl: thumiao_listvote,
                                    },

                                ]

                            },
                        ],
                    },


                /**
                 * 8-猫志-具体一只猫
                 */
                    {
                        title: '相关知识库',
                        layout: 'card',
                        items: [
                                    //3-新鲜事

                            {
                                xtype: 'panel',
                                title: '新鲜事',
                                layout: 'fit',
                                iconCls: 'star',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [
                                    //上方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',

                                        },
                                        //ui: 'light',
                                        items: [

                                            //撰写
                                            {
                                                //ui: 'back',
                                                iconCls: 'compose',

                                                handler: function (button) {
                                                    chooseDignityBtn.setDisabled(true);
                                                    chooseLocationBtn.setDisabled(false);
                                                    addnews.showBy(button);
                                                    Ext.getCmp('thu_newNews_title').setTitle('发布资料');
                                                    chooseLocationBtn.hide();
                                                    thumiao.PhoneSencha.newFstate = 1;
                                                    //cat
                                                    thumiao.PhoneSencha.newImageInit(true,false);
                                                    thumiao.location.locationSelect = 1;//-return
                                                }
                                            },

                                            { xtype: 'spacer' },

                                            //显示方式
                                            {
                                                disabled:thumiao_disabled,
                                                xtype: 'segmentedbutton',
                                                items: [
                                                    { text: '列表', pressed: true  },
                                                    { text: '地图',disabled:thumiao_disabled }
                                                ],
                                                hidden:true,
                                            },

                                            { xtype: 'spacer' },


                                            //刷新
                                            {
                                                //ui: 'default',
                                                //text: '刷新',
                                                iconCls: 'refresh',
                                                //width: 44,
                                                //height: 20
                                                handler: function() {
                                                    thumiao.PhoneSencha.catNews(null);
                                                }
                                            },

                                        ]
                                    },

                                    //新鲜事列表
                                    {
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        id:'thu_catNewsList',
                                        xtype: 'list',

                                        //inline: false,
                                        //selectedCls: null,

                                        mode: 'SINGLE',
                                        disableSelection: true,
                                        allowDeselect: true,
                                        disclosure: true,
                                        //grouped: true,
                                        //indexBar: true,

                                        onItemDisclosure: function(record, btn, index) {
                                            view.push(9);
                                            thumiao.PhoneSencha.oneNews(record);
                                            Ext.getCmp('thu_oneNewsInfo').hide();
                                            //Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                        },
                                        itemTpl: thumiao_listnews,
                                    }

                                ]

                            },

                        ]
                    },



                /**
                 * 9-独立的新鲜事页面
                 */
                    {
                        //xtype: 'tab',
                        title: '查看新鲜事',
                        layout: 'card',
                        //padding: 10,
                        style: 'background: #eeeeee url(../../static/phonesencha/comments-bg.png) repeat-y center;',
                        items:
                            [

                                //上方栏
                                {
                                    xtype: 'toolbar',
                                    docked: 'top',

                                    style: 'background-color: #dddddd',

                                    height: '62',

                                    layout: {
                                        pack: 'left',
                                        align: 'left'
                                    },

                                    scrollable: {
                                        direction: 'horizontal',
                                        indicators: false
                                    },

                                    //fullscreen: true,
                                    ui: 'plain',
                                    defaults: {
                                        iconMask: true,
                                        ui      : 'plain',
                                    },
                                    //ui: 'light',


                                    items: [

                                        {
                                            id:'thu_oneNewsUser',
                                            xtype: 'panel',
                                            //html: curUserTplForOneNewsToolbar,
                                        },
                                        //查找
                                        {
                                            id:'thu_oneNewsInfo',
                                            //ui: 'back',
                                            //text: '查找',
                                            iconCls: 'more',
                                            handler: function(record, btn, index) {
                                                view.push(16);
                                                thumiao.PhoneSencha.canChangeU = false;
                                                thumiao.PhoneSencha.oneNewsUser();
                                            }
                                        },
                                    ]
                                },

                                {
                                    docked: 'left',
                                    layout: {
                                        type: 'vbox',
                                        align: 'middle'
                                    },
                                    width: '100%',


                                    items:
                                        [
                                            //接下来显示新鲜事内容
                                            {
                                                id:'thu_oneNews',
                                                docked: 'top',
                                                xtype: 'list',
                                                mode: 'SINGLE',
                                                allowDeselect: true,
                                                disclosure: true,
                                                width:360,
                                                style: 'background: #eeeeee url(../../static/phonesencha/middleinfo-bg1.png) repeat-x center; padding: 0 0 2 0;',

                                                scrollable: false,
                                                //padding: 5,

                                                onItemDisclosure: {
                                                    scope: 'test',
                                                    handler: function(record, btn, index) {
                                                        //view.push(9);
                                                        thumiao.PhoneSencha.curReplyID = -1;
                                                        commentSheet.show();
                                                    }
                                                },
                                                itemTpl: thumiao_singlenews,
                                            },
                                            //下面显示新鲜事的评论列表
                                            {
                                                scrollable: true,
                                                layout: 'vbox',
                                                cls: 'demo-list',
                                                flex: 2,

                                                style: 'background-color: black;',
                                                width:320,
                                                items:[
                                                    {
                                                        id:'thu_oneNewsReplys',
                                                        docked: 'left',
                                                        xtype: 'list',
                                                        mode: 'SINGLE',
                                                        allowDeselect: true,
                                                        disclosure: true,
                                                        disableSelection: true,

                                                        scrollable: true,
                                                        //height: 300,
                                                        width: 320,
                                                        //padding: 5,
                                                        onItemDisclosure: {
                                                            scope: 'test',
                                                            handler: function(record, btn, index) {
                                                                //view.push(9);
                                                                commentSheet.show();
                                                                thumiao.PhoneSencha.setReplyID(record);
                                                            },
                                                        },
                                                        itemTpl:thumiao_listreply,
                                                    },
                                                ]
                                            }

                                        ]
                                }
                            ]
                    },


                /**
                 * 10-独立的（其他用户）个人页面【重要】【待改】【个人资料+关注的猫+所有微博】
                 */
                    {
                        title: '某人',
                    },


                /**
                 * 11-位置的单独页面，即该位置的新鲜事列表，以列表或时间轴方式显示
                 */
                    {
                        title: '发生的事',
                        layout: 'card',
                        //padding: 10,
                        items: [


                            {
                                xtype: 'panel',
                                title: '位置',
                                //fullscreen: true,
                                id: 'location-content',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [

                                    //上方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',
                                        },
                                        //ui: 'light',

                                        items: [
                                            //自定义添加
                                            {
                                                iconCls: 'compose',
                                                handler: function(btn){
                                                    chooseDignityBtn.setDisabled(false);
                                                    chooseLocationBtn.setDisabled(true);
                                                    addnews.showBy(btn);
                                                    Ext.getCmp('thu_newNews_title').setTitle('发布新鲜事');
                                                    chooseLocationBtn.show();
                                                    thumiao.PhoneSencha.newFstate = 2;
                                                    //location
                                                    thumiao.PhoneSencha.newImageInit(false,true);
                                                }
                                            },

                                            {xtype: 'spacer'},

                                            //冒泡
                                            {
                                                iconCls: 'locate',
                                                delegate: 'button',
                                                handler: function (button) {
                                                    thumiao.PhoneSenchaWS.locButton();
                                                }
                                            },
                                        ]
                                    },

                                    {
                                        id:'thu_locationNewsList',
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        xtype: 'list',
                                        allowDeselect: true,
                                        onItemDisclosure: function(record, btn, index) {
                                            view.push(9);
                                            thumiao.PhoneSencha.oneNews(record);
                                            //Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                        },
                                        //store: 'NewsListStore', //getRange(0, 9),
                                        itemTpl: thumiao_listnews
                                    }

                                ]

                            },

                        ]
                    },


                /**
                 * 12-与某个人留言的单独页面
                 */
                    {
                        title: '聊天中',
                        layout: 'card',
                        //padding: 10,
                        items: [


                            {
                                xtype: 'panel',
                                //fullscreen: true,
                                id: 'location-content',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [

                                    //下方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'bottom',

                                        height: '70',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        //ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',
                                        },
                                        //ui: 'light',

                                        items: [
                                            //输入框
                                            {
                                                id:'thu_msgText',
                                                xtype      : 'textfield',
                                                //maxLength: 10,
                                                style: 'background:white',
                                                //margin	   : 10,
                                                placeHolder: '输入要说的话',
                                                //width	   : 300
                                            },
                                            {
                                                xtype: 'button',
                                                text: '发送',
                                                ui: 'action',
                                                //margin	   : 10,
                                                //itemId: 'pop',
                                                handler: function() {

                                                    //view.pop();
                                                    //hide the sheet
                                                    thumiao.PhoneSenchaWS.send();
                                                }
                                            },
                                        ]
                                    },

                                    {
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        id:'thu_focusMsgList',
                                        xtype: 'list',
                                        allowDeselect: true,

                                        itemCls: 'message-item',

                                        //store: 'MessageListStore', //getRange(0, 9),
                                        itemTpl: thumiao_listmsg
                                    }

                                ]

                            },

                        ]
                    },


                /**
                 * 13-投票的单独页面
                 */
                    {
                        title: '查看投票',
                        layout: 'card',
                        //padding: 10,
                        items: [

                            {
                                xtype: 'formpanel',
                                iconCls: 'compose',
                                cls: 'card1',

                                items: [
                                    {
                                        id:'thu_vote_details',
                                        xtype: 'toolbar',
                                        docked: 'top',
                                        height: '100',
                                        ui: 'plain',
                                        scrollable: true,
                                    },
                                    {
                                        id:'thu_vote_votes',
                                        xtype: 'list',
                                        height:1000,
                                        docked:'top',
                                        margin:'0 auto',
                                        onItemDisclosure:function(record, btn, index) {
                                            thumiao.PhoneSencha.voteChoiceID = record.data.id;
                                            voteItemSheet.show();
                                        },
                                        itemTpl:'●{content}({count}票)',
                                    },

                                ],

                            },

                        ]
                    },


                /**
                 * 14-聊天室列表的页面
                 */
                    {
                        title: '问答堂',
                        layout: 'card',
                        id: 'chatroom',
                        items: [
                            {
                                xtype: 'panel',
                                title: '问答堂',
                                //fullscreen: true,
                                id: 'topic-content',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [

                                    //上方栏
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',
                                        },
                                        //ui: 'light',

                                        items: [
                                            //自定义添加
                                            {
                                                iconCls: 'compose',
                                                delegate: 'button',
                                                handler: function (button) {
                                                    addtopic.showBy(button);
                                                    thumiao.tag.reset();
                                                    thumiao.PhoneSenchaWS.newAsk();
                                                }
                                            },

                                            {xtype: 'spacer'},

                                            //显示方式
                                            {
                                                xtype: 'segmentedbutton',
                                                items: [
                                                    {
                                                        text: '全部',
                                                        pressed: true,
                                                        handler: function(btn) {
                                                            thumiao.PhoneSenchaWS.sortType = 0;
                                                            thumiao.PhoneSenchaWS.sort();
                                                        }
                                                    },
                                                    {
                                                        text: '我的',
                                                        handler: function(btn) {
                                                            thumiao.PhoneSenchaWS.sortType = 1;
                                                            thumiao.PhoneSenchaWS.sort();
                                                        }
                                                    },
                                                    {
                                                        text: '关注',
                                                        handler: function(btn) {
                                                            thumiao.PhoneSenchaWS.sortType = 2;
                                                            thumiao.PhoneSenchaWS.focusSort();
                                                        }
                                                    }
                                                ]
                                            },

                                            {xtype: 'spacer'},

                                            //添加关注标签
                                            {
                                                iconCls: 'add',
                                                delegate: 'button',
                                                handler: function (button) {
                                                    thumiao.PhoneSenchaWS.isFocusTags = true;
                                                    choosetags.showBy(button);
                                                    thumiao.PhoneSenchaWS.setTags();
                                                }
                                            },
                                        ]
                                    },

                                    {
                                        //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                        //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                        id:'thu_askList',
                                        xtype: 'list',
                                        allowDeselect: true,
                                        onItemDisclosure: function(record, btn, index) {
                                            view.push(15);
                                            thumiao.PhoneSenchaWS.setAskCur(record);
                                        },
                                        //store: 'TopicListStore', //getRange(0, 9),
                                        itemTpl: thumiao_listask
                                    }

                                ]

                            },

                        ]
                    },



                /**
                 * 15-某聊天室的单独页面
                 */
                    {
                        title: '查看问题',
                        layout: 'card',
                        //padding: 10,
                        style: 'background: #eeeeee url(../../static/phonesencha/comments-bg.png) repeat-y center;',
                        items:
                            [

                                //上方栏
                                {
                                    xtype: 'toolbar',
                                    docked: 'top',

                                    style: 'background-color: #dddddd',

                                    height: '62',

                                    layout: {
                                        pack: 'left',
                                        align: 'left'
                                    },

                                    scrollable: {
                                        direction: 'horizontal',
                                        indicators: false
                                    },

                                    //fullscreen: true,
                                    ui: 'plain',
                                    defaults: {
                                        iconMask: true,
                                        ui      : 'plain',
                                    },
                                    //ui: 'light',


                                    items:
                                        [

                                            {
                                                id:'thu_askTop',
                                                xtype: 'panel',
                                            },
                                            {
                                                iconCls: 'more',
                                                handler: function(record, btn, index) {
                                                    //view.push(16);
                                                }
                                            },
                                        ]

                                },

                                {
                                    docked: 'left',
                                    layout: {
                                        type: 'vbox',
                                        align: 'middle'
                                    },
                                    width: '100%',

                                    items:
                                        [

                                            //接下来显示描述内容
                                            {
                                                id:'thu_askOne',
                                                docked: 'top',
                                                xtype: 'list',
                                                mode: 'SINGLE',
                                                allowDeselect: true,
                                                disclosure: true,
                                                width:360,
                                                //height: 300,
                                                scrollable: false,

                                                onItemDisclosure: {
                                                    scope: 'test',
                                                    handler: function(record, btn, index) {
                                                        view.push(18);
                                                        thumiao.PhoneSenchaWS.canvasReply(-1,null,-2);
                                                    }
                                                },
                                                itemTpl: thumiao_singleask,
                                            },
                                            //下面显示问题的讨论列表
                                            {
                                                scrollable: true,
                                                layout: 'vbox',
                                                cls: 'demo-list',
                                                flex: 2,
                                                width:320,

                                                style: 'background-color: black;',

                                                items:
                                                    [
                                                        {
                                                            id:'thu_askReplys',
                                                            docked: 'left',
                                                            xtype: 'list',
                                                            mode: 'SINGLE',
                                                            allowDeselect: true,
                                                            disclosure: true,
                                                            disableSelection: true,

                                                            scrollable: true,
                                                            width: 300,
                                                            //fullscreen: true,

                                                            //padding: 5,
                                                            onItemDisclosure: {
                                                                scope: 'test',
                                                                handler: function(record, btn, index) {
                                                                    view.push(18);
                                                                    thumiao.PhoneSenchaWS.canvasReply(record.data.id,record.data.canvas,record.data.replytoid);
                                                                }
                                                            },
                                                            itemTpl: thumiao_listaskreply,
                                                        },
                                                    ]
                                            }

                                        ]

                                }
                            ]

                    },


                /**
                 * 16-他人的个人志页面
                 */
                    {
                        title: '个人志',
                        layout: 'card',
                        //padding: 10,
                        items: [
                            {
                                xtype: 'tabpanel',
                                tabBar: {
                                    docked: 'bottom',
                                    layout: {
                                        pack: 'center'
                                    }
                                },
                                fullscreen: true,
                                //ui: 'light',
                                defaults: {
                                    scrollable: true
                                },

                                items: [

                                    //
                                    //1-个人档案
                                /**
                                 * 套用form
                                 */
                                    {
                                        id:'thu_otheruserinfo',
                                        xtype: 'formpanel',
                                        title: '档案',
                                        iconCls: 'bookmarks',
                                        cls: 'card1',
                                        displayField: 'title',
                                        standardSubmit: false,


                                        items:
                                            [
                                                {
                                                    xtype: 'panel',
                                                    html: thumiao_singleouserinfo,
                                                    width:'80%',
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '基本资料',
                                                    margin: 20,
                                                    defaults: {
                                                        required  : true,
                                                        labelAlign: 'left',
                                                        labelWidth: '40%'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            label: '人人ID',
                                                            disabled:true,
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: '注册时间',
                                                            disabled:true,
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: '最近登录',
                                                            disabled:true,
                                                        },
                                                        {
                                                            id: 'thumiao_ouserinfo_intro',
                                                            xtype: 'textareafield',
                                                            label: '个人介绍',
                                                            disabled:true,
                                                        },
                                                        {
                                                            id: 'thu_user_focus',
                                                            xtype: 'togglefield',
                                                            label: '关注',
                                                        },
                                                    ]
                                                },
                                            ]
                                    },

                                    //2-关注
                                    {
                                        xtype: 'panel',
                                        title: '关注',
                                        html: '<h1>关注</h1><p>--关注</p>',
                                        iconCls: 'star',
                                        layout: 'fit',
                                        cls: 'demo-list',
                                        displayField: 'title',
                                        scrollable: false,

                                        items: [


                                            {
                                                //width: Ext.os.deviceType == 'Phone' ? null : 480,
                                                //height: Ext.os.deviceType == 'Phone' ? null : 900,
                                                id:'thu_otheruserfocuses',
                                                xtype: 'list',
                                                allowDeselect: true,
                                                onItemDisclosure: function(record, btn, index) {
                                                    thumiao.PhoneSencha.viewCat(record.data['id']);
                                                    thumiao.PhoneSencha.catNews(record);
                                                    view.push(8);
                                                    //Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                                                },
                                                //store: 'CatListStore', //getRange(0, 9),
                                                itemTpl: thumiao_listcat,
                                            }

                                        ]

                                    },

                                    //3-新鲜事
                                    // {
                                    // 	disabled:thumiao_disabled,
                                    // 	xtype: 'panel',
                                    // 	title: '新鲜事',
                                    // 	html: '<h1>新鲜事</h1><p>--新鲜事</p>',
                                    // 	iconCls: 'star',
                                    // 	layout: 'fit',
                                    // 	cls: 'demo-list',
                                    // 	displayField: 'title',
                                    // 	scrollable: false,

                                    // 	items: [


                                    // 		{
                                    // 			//width: Ext.os.deviceType == 'Phone' ? null : 480,
                                    // 			//height: Ext.os.deviceType == 'Phone' ? null : 900,
                                    // 			xtype: 'list',
                                    // 			allowDeselect: true,
                                    // 			onItemDisclosure: function(record, btn, index) {

                                    // 			},
                                    // 			//store: 'NewsListStore', //getRange(0, 9),
                                    // 			itemTpl: thumiao_listnews,
                                    // 		},
                                    // 		thumiao_undercon,

                                    // 	]

                                    // },

                                ]
                            },
                        ]
                    },

                /**
                 * 17-一条群公告的页面
                 */
                    {
                        title: '群公告',
                        html: thumiao_singlenotice,
                    },


                /**
                 * 18-某聊天室问题的评论&涂鸦页面
                 */
                    {
                        title: '评论某问题',
                        layout: 'card',
                        //padding: 10,
                        items: [

                            {
                                xtype: 'panel',
                                title: '评论某问题',
                                //fullscreen: true,
                                id: 'location-content',
                                layout: 'fit',
                                cls: 'demo-list',
                                displayField: 'title',
                                scrollable: false,

                                items: [

                                    //上方工具栏【极端重要】
                                    {
                                        xtype: 'toolbar',
                                        docked: 'top',

                                        height: '40',

                                        layout: {
                                            pack: 'center',
                                            align: 'center'
                                        },

                                        scrollable: {
                                            direction: 'horizontal',
                                            indicators: false
                                        },

                                        //fullscreen: true,
                                        ui: 'plain',
                                        defaults: {
                                            iconMask: true,
                                            ui      : 'plain',
                                        },
                                        //ui: 'light',

                                        items: [
                                            {
                                                xtype: 'spacer',
                                                html: '<p align="center"><font size="5" color="white">|</font></p>',
                                            },
                                            {
                                                text: '画笔',
                                                //iconCls: 'compose',
                                                //xtype: 'image',
                                                xtype: 'button',
                                                //style: 'background-image: url('html_table.png');',
                                                //delegate: 'button',
                                                handler: function (button) {
                                                    drawtools.showBy(button);
                                                    thumiao.PhoneSenchaWS.canvasTools();
                                                }
                                            },
                                            {
                                                xtype: 'spacer',
                                                html: '<p align="center"><font size="5" color="white">|</font></p>',
                                            },
                                            {
                                                //ui: 'back',
                                                text: '撤销',
                                                //iconCls: 'compose',
                                                //xtype: 'image',
                                                xtype: 'button',
                                                //style: 'background-image: url('html_table.png');',
                                                //delegate: 'button',
                                                handler: function (button) {
                                                    thumiao.PhoneSenchaWS.undoCanvas();
                                                }
                                            },
                                            {
                                                xtype: 'spacer',
                                                html: '<p align="center"><font size="5" color="white">|</font></p>',
                                            },
                                            {
                                                id:'thu_showBG',
                                                text: '隐藏背景',
                                                //icon: './images/icons/edit-undo-small.png',
                                                //iconMask: true,
                                                //xtype: 'image',
                                                xtype: 'button',
                                                //style: 'background-color: white;',
                                                //delegate: 'button',
                                                handler: function (button) {
                                                    thumiao.PhoneSenchaWS.showBG();
                                                }
                                            },
                                            {
                                                xtype: 'spacer',
                                                html: '<p align="center"><font size="5" color="white">|</font></p>',
                                            },
                                            {
                                                text: '清空',
                                                //iconCls: 'compose',
                                                //xtype: 'image',
                                                xtype: 'button',
                                                //style: 'background-image: url('html_table.png');',
                                                //delegate: 'button',
                                                handler: function (button) {
                                                    thumiao.PhoneSenchaWS.clearCanvas();
                                                }
                                            },
                                            {
                                                xtype: 'spacer',
                                                html: '<p align="center"><font size="5" color="white">|</font></p>',
                                            },
                                            {
                                                text: '保存图片',
                                                //iconCls: 'compose',
                                                //xtype: 'image',
                                                xtype: 'button',
                                                //style: 'background-image: url('html_table.png');',
                                                //delegate: 'button',
                                                handler: function (button) {
                                                    filenameSheet.showBy(button);
                                                }
                                            },
                                            {
                                                xtype: 'spacer',
                                                html: '<p align="center"><font size="5" color="white">|</font></p>',
                                            },
                                        ]
                                    },

                                    {
                                        xtype: 'container',
                                        fullscreen: true,

                                        layout: {
                                            type: 'hbox',
                                            align: 'middle'
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                docked: 'top',
                                                layout: 'hbox',
                                                padding: 5,
                                                centered: true,
                                                html: '<div id="thu_canvasdiv"><canvas id="thu_canvas"></canvas></div>',
                                            },

                                            {
                                                xtype: 'panel',
                                                text: 'textarea of records',
                                                style: 'padding: 10 20 10 20',

                                                docked: 'top',
                                                //padding: 5,

                                                //width: 400,

                                                items: [
                                                    {
                                                        id:'thu_askreply',
                                                        xtype: 'textareafield',
                                                        name : 'records',
                                                        placeHolder: '请输入评论内容',
                                                        disabled: false,
                                                        width: 350,
                                                        autoComplete: true,
                                                        autoCorrect: true,
                                                        style: 'background: white',
                                                        clearIcon: true,
                                                        autoCapitalize : false
                                                    },
                                                ]
                                            },
                                            {
                                                docked: 'top',
                                                text: 'panel of writing and sending',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle'
                                                },
                                                //margin: 5,
                                                //padding: 5,
                                                items: [
                                                    {
                                                        xtype: 'spacer'
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        text: '舍弃',
                                                        width: 100,
                                                        margin: 5,
                                                        padding: 5,
                                                        //docked: 'left',
                                                        handler: function (button) {
                                                            thumiao.PhoneSenchaWS.askClear();
                                                            view.pop();
                                                        }
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        ui: 'confirm',
                                                        text: '提交',
                                                        width: 100,
                                                        margin: 5,
                                                        padding: 5,
                                                        //docked: 'left',
                                                        handler: function (button) {
                                                            thumiao.PhoneSenchaWS.askReply();
                                                        }
                                                    },
                                                    {
                                                        xtype: 'spacer'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            });

        thumiao.PhoneSencha.view = view;
        thumiao.PhoneSencha.addvote = addvote;
        thumiao.PhoneSencha.chooseaddress = chooseaddress;
        thumiao.PhoneSenchaWS.bubblePanel = bubblePanel;

        Ext.Viewport.add(view);

    },

});