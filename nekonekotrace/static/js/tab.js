/**
 * By Shen Ke, 2012/4/19
 */

 
Ext.require([
    'Ext.navigation.View',
	'Ext.ActionSheet',
    'Ext.Button',
    'Ext.Toolbar',
	'Ext.XTemplate',
	'Ext.Panel',
	'Ext.SegmentedButton',
	'Ext.util.JSONP',
	'Ext.data.Store',
	'Ext.List',
]);

Ext.YQL = {
    useAllPublicTables: true,
    yqlUrl: 'http://query.yahooapis.com/v1/public/yql',
    request: function(cfg) {
        var p = cfg.params || {};
        p.q = cfg.query;
        p.format = 'json';
        if (this.useAllPublicTables) {
            p.env = 'store://datatables.org/alltableswithkeys';
        }

        Ext.util.JSONP.request({
            url: this.yqlUrl,
            callbackKey: 'callback',
            params: p,
            callback: cfg.callback,
            scope: cfg.scope || window
        });
    }
};


/**
 * 暂时使用contact数据
 */
Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']	//定义表项的格式，姓+名
});

Ext.regModel('null', {
    fields: ['null']
});

Ext.create('Ext.data.Store', {
    id: 'ListStore',
    model: 'Contact',
    sorters: 'firstName',
    getGroupString : function(record) {
        return record.get('firstName')[0];
    },
    data: [
        {firstName: 'Julio', lastName: 'Benesh'},
        {firstName: 'Julio', lastName: 'Minich'},
        {firstName: 'Tania', lastName: 'Ricco'},
        {firstName: 'Odessa', lastName: 'Steuck'},
        {firstName: 'Nelson', lastName: 'Raber'},
        {firstName: 'Tyrone', lastName: 'Scannell'},
        {firstName: 'Allan', lastName: 'Disbrow'},
        {firstName: 'Cody', lastName: 'Herrell'},
        {firstName: 'Julio', lastName: 'Burgoyne'},
        {firstName: 'Jessie', lastName: 'Boedeker'},
        {firstName: 'Allan', lastName: 'Leyendecker'},
        {firstName: 'Javier', lastName: 'Lockley'},
        {firstName: 'Guy', lastName: 'Reasor'},
        {firstName: 'Jamie', lastName: 'Brummer'},
        {firstName: 'Jessie', lastName: 'Casa'},
        {firstName: 'Marcie', lastName: 'Ricca'},
        {firstName: 'Gay', lastName: 'Lamoureaux'},
        {firstName: 'Althea', lastName: 'Sturtz'},
        {firstName: 'Kenya', lastName: 'Morocco'},
        {firstName: 'Rae', lastName: 'Pasquariello'},
        {firstName: 'Ted', lastName: 'Abundis'},
        {firstName: 'Jessie', lastName: 'Schacherer'},
        {firstName: 'Jamie', lastName: 'Gleaves'},
        {firstName: 'Hillary', lastName: 'Spiva'},
        {firstName: 'Elinor', lastName: 'Rockefeller'},
        {firstName: 'Dona', lastName: 'Clauss'},
        {firstName: 'Ashlee', lastName: 'Kennerly'},
        {firstName: 'Alana', lastName: 'Wiersma'},
        {firstName: 'Kelly', lastName: 'Holdman'},
        {firstName: 'Mathew', lastName: 'Lofthouse'},
        {firstName: 'Dona', lastName: 'Tatman'},
        {firstName: 'Clayton', lastName: 'Clear'},
        {firstName: 'Rosalinda', lastName: 'Urman'},
        {firstName: 'Cody', lastName: 'Sayler'},
        {firstName: 'Odessa', lastName: 'Averitt'},
        {firstName: 'Ted', lastName: 'Poage'},
        {firstName: 'Penelope', lastName: 'Gayer'},
        {firstName: 'Katy', lastName: 'Bluford'},
        {firstName: 'Kelly', lastName: 'Mchargue'},
        {firstName: 'Kathrine', lastName: 'Gustavson'},
        {firstName: 'Kelly', lastName: 'Hartson'},
        {firstName: 'Carlene', lastName: 'Summitt'},
        {firstName: 'Kathrine', lastName: 'Vrabel'},
        {firstName: 'Roxie', lastName: 'Mcconn'},
        {firstName: 'Margery', lastName: 'Pullman'},
        {firstName: 'Avis', lastName: 'Bueche'},
        {firstName: 'Esmeralda', lastName: 'Katzer'},
        {firstName: 'Tania', lastName: 'Belmonte'},
        {firstName: 'Malinda', lastName: 'Kwak'},
        {firstName: 'Tanisha', lastName: 'Jobin'},
        {firstName: 'Kelly', lastName: 'Dziedzic'},
        {firstName: 'Darren', lastName: 'Devalle'},
        {firstName: 'Julio', lastName: 'Buchannon'},
        {firstName: 'Darren', lastName: 'Schreier'},
        {firstName: 'Jamie', lastName: 'Pollman'},
        {firstName: 'Karina', lastName: 'Pompey'},
        {firstName: 'Hugh', lastName: 'Snover'},
        {firstName: 'Zebra', lastName: 'Evilias'}
    ]
});


 
Ext.setup({
	icon: 'icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    onReady: function() {
	/**
	* 遮罩层弹出
	*/	
	var addnews = Ext.create('Ext.Panel', {
	items: [
	{
            docked: 'top',
            xtype : 'toolbar',
            title : '发布新鲜事'
    },
	{
            id:'xhl_newNewsContent',
            xtype: 'textareafield',
            name: 'content',
            label: '内容',
            required: true
	},
	{
		items: [
		{
			xtype: 'textfield',
			name: 'filename',
			id:'userfile',
			inputType : 'file',
			label: '图片',
			placeHolder: '请输入图片网页路径URL',
			autoCapitalize : true,
			required: true,
			useClearIcon: true
		}]
	},
	{
		layout: 'hbox',
		items:[ 
		{
					xtype: 'spacer'
		},
		{
			id:'xhl_newImage',
			xtype: 'button',
			ui: 'drastic',
			text: '上传图片',
			height: 10,  
			width: 100,
			handler: function() 
			{           
                thumiao.PhoneSencha.buttonNewImage();
			}
		},
		{
            xtype: 'button',
            ui: 'action',
            text: '选择地点',
			height: 10,  
			width: 100,
		},]
	},
	{
			xtype: 'toolbar',
			dock: 'bottom',
			ui: 'dark',
			items: [
			{
					xtype: 'button',
					ui: 'drastic',
					text: '取消发布',
					handler: function() {           
                        addnews.hide();
                    }
			},
			{
					xtype: 'spacer'
			},
			{
			xtype: 'button',
			ui: 'action',
			text: '发布',
			handler: function() 
			{
				thumiao.PhoneSencha.newNews(); 
			}
			}
			]
	}
    ]});
		
/**
 * 用作时间轴显示
 */
		var groupingBase_ForTimeBar = {
            itemTpl: '<div class="contact2"><strong>{firstName}</strong> {lastName}</div>',
            mode: 'SINGLE',
            allowDeselect: true,
            disclosure: true,
            grouped: true,
            indexBar: true,
            plugins: 'pullrefresh',

            onItemDisclosure: {
                scope: 'test',
                handler: function(record, btn, index) {
                    view.push(9);
					//alert('Disclose more info for ' + record.get('firstName'));
                }
            },

            store: Ext.create('Ext.data.Store', {
                model: 'Contact',
                sorters: 'firstName',

                getGroupString : function(record) {
                    return record.get('firstName')[0];
                },

                autoLoad: true,

                proxy: {
                    type: 'memory',
                    data: [
                        {firstName: 'Tommy1', lastName: 'Maintz'},
						{firstName: 'Tommy2', lastName: 'Maintz'},
						{firstName: 'Tommy3', lastName: 'Maintz'},
                        {firstName: 'Ed', lastName: 'Spencer'},
                        {firstName: 'Jamie', lastName: 'Avins'},
                        {firstName: 'Aaron', lastName: 'Conran'},
                        {firstName: 'Ed', lastName: 'Spencer'},
                        {firstName: 'Jamie', lastName: 'Avins'},
                        {firstName: 'Aaron', lastName: 'Conran'},
                        {firstName: 'Dave1', lastName: 'Kaneda'},
						{firstName: 'Dave2', lastName: 'Kaneda'},
						{firstName: 'Dave3', lastName: 'Kaneda'},
						{firstName: 'Dave4', lastName: 'Kaneda'},
						{firstName: 'Dave5', lastName: 'Kaneda'},
                        {firstName: 'Michael1', lastName: 'Mullany'},
						{firstName: 'Michael2', lastName: 'Mullany'},
						{firstName: 'Michael3', lastName: 'Mullany'},
                        {firstName: 'Abraham', lastName: 'Elias'},
                        {firstName: 'Jay', lastName: 'Robinson'},
                        {firstName: 'Zed', lastName: 'Zacharias'}
                    ]
                }
            })
        };
		
			
/**
 * 表单
 */		

		var form;

        Ext.define('User', {
            extend: 'Ext.data.Model',

            fields: [
                {name: 'name',     type: 'string'},
                {name: 'password', type: 'password'},
                {name: 'email',    type: 'string'},
                {name: 'url',      type: 'string'},
                {name: 'date',     type: 'date'},
                {name: 'number',   type: 'integer'},
                {name: 'height',   type: 'integer'},
                {name: 'enable',   type: 'integer'},
                {name: 'spinner',  type: 'integer'},
                {name: 'single_slider'},
                {name: 'multiple_slider'},
                {name: 'rank',     type: 'string'},
                {name: 'enable',   type: 'boolean'},
                {name: 'cool',     type: 'boolean'},
                {name: 'color',    type: 'string'},
                {name: 'team',     type: 'string'},
                {name: 'secret',   type: 'boolean'}
            ]
        });

        Ext.define('Ranks', {
            extend: 'Ext.data.Model',

            fields: [
                {name: 'rank',     type: 'string'},
                {name: 'title',    type: 'string'}
            ]
        });

        var ranksStore = Ext.create('Ext.data.Store', {
            data : [
                { rank : 'master',  title : 'Master'},
                { rank : 'padawan', title : 'Student'},
                { rank : 'teacher', title : 'Instructor'},
                { rank : 'aid',     title : 'Assistant'}
            ],
            model : 'Ranks',
            autoLoad : true,
            autoDestroy : true
        });

		
/**
 * 单选显示的模板中所需查询方法
 */
		var demoLookup = {
            kiva: {
                query: 'select * from kiva.loans.recent',
                tpl: Ext.create('Ext.XTemplate', '<tpl if="loans"><tpl for="loans">{name}<br/></tpl></tpl>')
            },
            weather: {
                query: 'select * from weather.forecast where location = 94301',
                tpl: Ext.create('Ext.XTemplate', '<h1>{channel.item.condition.temp}&deg; {channel.item.condition.text}</h1> \
                <h2>{channel.item.title}</h2>')
            },
            extjs: {
                query: "select * from rss where url='http://feeds.feedburner.com/extblog' limit 5",
                tpl: Ext.create('Ext.XTemplate', [
                    '<tpl if="item">',
                        '<tpl for="item">',
                            '<h2><a href="{link}" target="_blank">{title}</a><small> by {creator}</small></h2>',
                            '<p>{description}</p>',
                        '</tpl>',
                    '</tpl>'
                ])
            }
        };

		
/**
 * 单选显示的模板中查询请求方法
 */
        var makeYqlRequest = function(btn) {
            Ext.Viewport.setMask({
                message: 'Loading...'
            });
            
            var selected = btn.value;
            var opts = demoLookup[selected];
            if (opts) {
                Ext.YQL.request({
                    query: opts.query,
                    callback: function(response) {
                        var results = [];
                        if (response.query && response.query.results) {
                            results = response.query.results;
                        }
                        Ext.getCmp('location-content').update(opts.tpl.apply(results));
                        Ext.Viewport.unmask();
                    }
                });
            }
        };
		
		
/**
 * 整个界面的支架：切换模板
 */
        var view = Ext.create('Ext.navigation.View', {
            fullscreen: true,

            //true means the back button text will always be 'back'
            // useTitleForBackButtonText: true,

            items: [

/**
 * 0-主页
 */		
                {
                    title: '首页',
                    layout: 'card',
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
										ui      : 'plain'

                                    },
									//ui: 'light',
									items: [
										
										//logo
										{ iconCls: 'star', width: 40 },
										
										{ xtype: 'spacer' },
										
										//退出
										{ iconMask: true, iconCls: 'action', width: 40 }

                                    ]
								},
					
								//1-导航
								{
									xtype: 'panel',
									title: '导航',
									
									//fullscreen: true,
									
									layout: {
										type : 'vbox',
										align: 'middle'
									},
									
									//导航页面
									items: [
										{
											xtype: 'button',
											width: 150,
											text: '新鲜事',
											margin: 20,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												view.push(1);
											}
										},
										{
											xtype: 'button',
											width: 150,
											text: '猫志',
											margin: 0,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												thumiao.PhoneSencha.buttonCatList();
												view.push(2);
											}
										},
										{
											xtype: 'button',
											width: 150,
											text: '个人志',
											margin: 20,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												view.push(3);
											}
										},
										{
											xtype: 'button',
											width: 150,
											text: '位置',
											margin: 0,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												thumiao.PhoneSencha.buttonLocationList();
												view.push(4);
											}
										},
										{
											xtype: 'button',
											width: 150,
											text: '留言板',
											margin: 20,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												view.push(5);
											}
										},
										{
											xtype: 'button',
											width: 150,
											text: '群消息',
											margin: 0,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												view.push(6);
											}
										},
										{
											xtype: 'button',
											width: 150,
											text: '搜索',
											margin: 20,
											
											handler: function() {
												//we already have other items in this navigation view, so we can simply use an index if we want
												view.push(7);
											}
										}
									],
									
									iconCls: 'star',
									cls: 'blog',
									displayField: 'title',

									
								},
								
								//2-设置
								{
									xtype: 'panel',
									title: '设置',
									html: '<div><h1>设置</h1><p>--设置~</p></div>',
									iconCls: 'star',
									cls: 'card1',
									displayField: 'title',


								},
								
								//3-关于
								{
									xtype: 'panel',
									title: '关于',
									html: '<h1>关于团队</h1><h2>成员</h2><p>五人。</p><h2>特点</h2><p>效率低。</p><h1>关于应用</h1><h2>nekotrace</h2><p>很好吧。</p>',
									iconCls: 'star',
									cls: 'card1',
									displayField: 'title'
									
									
								},
								
								
								/*****************************************************************************/
								
								
							]
						},
                    ]
                },

				
/**
 * 1-新鲜事
 */
                {
                    title: '新鲜事',
                    layout: 'card',
					//animation: {type:"fade",duration:250},
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
										
										//{ ui: 'back', text: '����' },
										
										//撰写
										{
											//ui: 'back',
											iconCls: 'compose',						 
											delegate: 'button',
											handler: function (button) {
												addnews.showBy(button);
												thumiao.PhoneSencha.newImageInit();
											}

											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
										
										{ xtype: 'spacer' },
										
										//显示方式
										{
											xtype: 'segmentedbutton',
											items: [
												{ text: '列表', pressed: true },
												{ text: '时间轴' },
												{ text: '地图' }
											]
										},
										
										{ xtype: 'spacer' },
										
										
										//刷新
										{
											//ui: 'default',
											//text: '刷新',
											iconCls: 'refresh',
											//width: 44,
											//height: 20
										},

									]
								},
							
								//新鲜事页面模块
								//1-全部新鲜事
								{
									xtype: 'panel',
									title: '全部',
									iconCls: 'star',
									scrollable: false,
									layout: 'fit',
									cls: 'demo-list',
									items: [{
										//width: Ext.os.deviceType == 'Phone' ? null : 480,
										//height: Ext.os.deviceType == 'Phone' ? null : 900,
										xtype: 'list',
										onItemDisclosure: function(record, btn, index) {
											view.push(9);
											//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
										},
										store: 'ListStore', //getRange(0, 9),
										itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
									}]
									
									
								},
								
								//2-我的新鲜事
								{
									xtype: 'panel',
									title: '我的',
									iconCls: 'star',
									scrollable: false,
									layout: 'fit',
									cls: 'demo-list',
									items: [{
										//width: Ext.os.deviceType == 'Phone' ? null : 480,
										//height: Ext.os.deviceType == 'Phone' ? null : 900,
										xtype: 'list',
										onItemDisclosure: function(record, btn, index) {
											view.push(9);
											//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
										},
										store: 'ListStore', //getRange(0, 9),
										itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
									}]
									
									
								},
								
								//3-猫的新鲜事
								{
									xtype: 'panel',
									title: '猫的',
									iconCls: 'star',
									scrollable: false,
									layout: 'fit',
									cls: 'demo-list',
									items: [{
										//width: Ext.os.deviceType == 'Phone' ? null : 480,
										//height: Ext.os.deviceType == 'Phone' ? null : 900,
										xtype: 'list',
										onItemDisclosure: function(record, btn, index) {
											view.push(9);
											//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
										},
										store: 'ListStore', //getRange(0, 9),
										itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
									}]
									
									
								},
								
								//4-图片新鲜事
								{
									xtype: 'panel',
									title: '图片',
									iconCls: 'star',
									scrollable: false,
									layout: 'fit',
									cls: 'demo-list',
									items: [{
										//width: Ext.os.deviceType == 'Phone' ? null : 480,
										//height: Ext.os.deviceType == 'Phone' ? null : 900,
										xtype: 'list',
										onItemDisclosure: function(record, btn, index) {
											view.push(9);
											//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
										},
										store: 'ListStore', //getRange(0, 9),
										itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
									}]
									
									
								},
								
								//5-群公告
								{
									xtype: 'panel',
									title: '群公告',
									iconCls: 'star',
									scrollable: false,
									layout: 'fit',
									cls: 'demo-list',
									items: [{
										//width: Ext.os.deviceType == 'Phone' ? null : 480,
										//height: Ext.os.deviceType == 'Phone' ? null : 900,
										xtype: 'list',
										onItemDisclosure: function(record, btn, index) {
											view.push(9);
											//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
										},
										store: 'ListStore', //getRange(0, 9),
										itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
									}]
									
									
								},
								
								
								/*****************************************************************************/
								
								
							]
						},
                    ]
                },

/**
 * 2-猫志
 */
                {
                    title: '猫志',
                    layout: 'card',
                    items: [
                        {
							
							xtype: 'panel',
							title: '某猫',
							layout: 'fit',
							cls: 'demo-list',
							displayField: 'title',
							scrollable: false,
									
							store: Ext.create('Ext.data.TreeStore', {
								fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
							
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
											//ui: 'back',
											//text: '新建',
											iconCls: 'add',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
										
										{xtype: 'spacer'},
										
										{
											xtype: 'segmentedbutton',
											items: [
												{
													text: '列表',
													id: 'location-kiva',
													value: 'kiva',
													pressed: true,
													handler: makeYqlRequest
												},
												{
													text: '头像',
													id: 'location-extjs',
													value: 'extjs',
													handler: makeYqlRequest
												}
											]
										},
										{xtype: 'spacer'},
										
										//查找
										{
											//ui: 'back',
											//text: '查找',
											iconCls: 'search',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
									]
								},
								
								
								/*
								{
									xtype: 'button',
									width: 150,
									text: '猫0',
									margin: 20,
								
									handler: function() {
									//we already have other items in this navigation view, so we can simply use an index if we want
										view.push(8);
									}
								},
								*/
								
								{
									//width: Ext.os.deviceType == 'Phone' ? null : 480,
									//height: Ext.os.deviceType == 'Phone' ? null : 900,
									id:'xhl_catList',
									xtype: 'list',
									onItemDisclosure: function(record, btn, index) {
										view.push(8);
										thumiao.PhoneSencha.viewCat(record.data['id']);			
									},
									itemTpl: '<div class="contact"><strong>{name}</strong> {content}</div>'
								}
								
								/*****************************************************************************/
								
								
							]
							
						},
                    ]
                },
				

				
/**
 * 3-个人志
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
									xtype: 'formpanel',
									title: '档案',
									//html: '<h1>档案</h1><p>--档案</p>',
									iconCls: 'star',
									cls: 'card1',
									displayField: 'title',
									
									url: 'postUser.php',
									standardSubmit: false,
									
									
									items: [
										{
											xtype: 'fieldset',
											title: '基本资料',
											margin: 20,
											instructions: '基本资料',
											defaults: {
												required  : true,
												labelAlign: 'left',
												labelWidth: '40%'
											},
											items: [
												{
													xtype: 'textfield',
													name : 'name',
													label: '姓名',
													clearIcon: true,
													autoCapitalize : false
												},
												{
													xtype: 'passwordfield',
													name : 'password',
													label: '密码',
													clearIcon: false
												},
												{
													xtype: 'textfield',
													name : 'disabled',
													label: 'disabled',
													disabled: true,
													clearIcon: true
												},
												{
													xtype: 'emailfield',
													name : 'email',
													label: '邮箱',
													placeHolder: 'you@sencha.com',
													clearIcon: true
												},
												{
													xtype: 'urlfield',
													name : 'url',
													label: '链接',
													placeHolder: 'http://sencha.com',
													clearIcon: true
												},
												{
													xtype: 'checkboxfield',
													name : 'cool',
													label: 'CheckBox',
													value: true
												},
												{
													xtype: 'spinnerfield',
													name : 'spinner',
													label: '啊'
												},
												{
													xtype: 'selectfield',
													name : 'rank',
													label: '啊',
													valueField : 'rank',
													displayField : 'title',
													store : ranksStore
												},
												{
													xtype: 'datepickerfield',
													name : 'date',
													label: '日期',
													value: new Date(),
													picker: {
														yearFrom: 1980
													}
												},
												{
													xtype: 'hiddenfield',
													name : 'secret',
													value: 'false'
												},
												
												{
													xtype: 'sliderfield',
													name : 'height',
													label: '音量'
												},
												{
													xtype: 'togglefield',
													name : 'enable',
													label: '啊'
												},
												{
													xtype: 'radiofield',
													name: 'team',
													label: '啊1',
													value : 'redteam'
												},
												{
													xtype: 'radiofield',
													name: 'team',
													label: '啊2',
													value: 'blueteam'
												},
												{
													xtype : 'textareafield',
													name  : 'bio',
													label : '简介',
													maxLength : 60,
													maxRows : 10
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
											
												
												
												
												{
													text: 'Reset',
													ui : 'default',
													handler: function() {
														form.reset();
													}
												},
												
												{xtype: 'spacer'},
												
												{
													text: 'Save',
													ui: 'confirm',
													handler: function() {
														if (formBase.user) {
															form.updateRecord(formBase.user, true);
														}
														form.submit({
															waitMsg : {message:'Submitting', cls : 'demos-loading'}
														});
													}
														
												}
											],

											listeners: {
												submit: function(form, result) {
													console.log('success', Ext.toArray(arguments));
												},
												exception: function(form, result) {
													console.log('failure', Ext.toArray(arguments));
												}
											}
										}
									],
									
									store: Ext.create('Ext.data.TreeStore', {
										//fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),
									
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
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),
									
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
													//height: 20
												},
												
												{ xtype: 'spacer' },
												
												//显示方式
												{
													xtype: 'segmentedbutton',
													items: [
														{ text: '列表', pressed: true },
														{ text: '头像' }
													]
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
											xtype: 'list',
											onItemDisclosure: function(record, btn, index) {
												view.push(8);
												//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
											},
											store: 'ListStore', //getRange(0, 9),
											itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
										}
										
									]
									
								},
								
								//3-设置
								{
									xtype: 'panel',
									title: '设置',
									html: '<h1>设置</h1><p>--设置</p>',
									iconCls: 'star',
									cls: 'card3',
									displayField: 'title',
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),

								},
								
								
								/*****************************************************************************/
								
								
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
							id: 'location-content',
							layout: 'fit',
							cls: 'demo-list',
							displayField: 'title',
							scrollable: false,
									
							store: Ext.create('Ext.data.TreeStore', {
								fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
							
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
											//ui: 'back',
											//text: '新建',
											iconCls: 'add',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
										
										{xtype: 'spacer'},
										
										{
											xtype: 'segmentedbutton',
											items: [
												{
													text: '列表',
													id: 'location-kiva',
													value: 'kiva',
													pressed: true,
													handler: makeYqlRequest
												},
												{
													text: '地图',
													id: 'location-extjs',
													value: 'extjs',
													handler: makeYqlRequest
												}
											]
										},
										{xtype: 'spacer'},
										
										//查找
										{
											//ui: 'back',
											//text: '查找',
											iconCls: 'search',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
									]
								},
								
								{
									//width: Ext.os.deviceType == 'Phone' ? null : 480,
									//height: Ext.os.deviceType == 'Phone' ? null : 900,
									id:'xhl_locationList',
									xtype: 'list',
									onItemDisclosure: function(record, btn, index) {
										view.push(11);
										//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
									},
									//store: 'ListStore', //getRange(0, 9),
									itemTpl: '<div class="contact"><strong>{name}</strong></div>'
								}
								
							]
									
						},
								
								/*****************************************************************************/
												
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
									
							store: Ext.create('Ext.data.TreeStore', {
								fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
							
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

										
										//删除
										{
											//ui: 'back',
											iconCls: 'trash',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
									
										{ xtype: 'spacer' },
										

										
										{ xtype: 'spacer' },

										
										//查找
										{
											iconCls: 'search',
											//width: 44,
											//height: 20
										},

									]
								},
								
								{
									//width: Ext.os.deviceType == 'Phone' ? null : 480,
									//height: Ext.os.deviceType == 'Phone' ? null : 900,
									xtype: 'list',
									onItemDisclosure: function(record, btn, index) {
										view.push(9);
										//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
									},
									store: 'ListStore', //getRange(0, 9),
									itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
								}
								
							]
									
						},
								
								/*****************************************************************************/
												
                    ]
                },
				
/**
 * 6-群消息
 */
                {
                    title: '群消息',
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
								//1-群公告
/**
 * 采用list
 */
								{
									
									xtype: 'panel',
									title: '公告',
									//html: '<h1>公告</h1><p>--公告</p>',
									iconCls: 'star',
									scrollable: false,
									layout: 'fit',
									cls: 'demo-list',
									items: [{
										//width: Ext.os.deviceType == 'Phone' ? null : 480,
										//height: Ext.os.deviceType == 'Phone' ? null : 900,
										xtype: 'list',
										onItemDisclosure: function(record, btn, index) {
											view.push(9);
											//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
										},
										store: 'ListStore', //getRange(0, 9),
										itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
									}]
									
									
								},

								
								//2-投票
								{
									xtype: 'panel',
									title: '投票',
									html: '<h1>投票</h1><p>--投票</p>',
									iconCls: 'star',
									cls: 'card2',
									displayField: 'title',
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),
									
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
													//height: 20
												},
												
												{ xtype: 'spacer' },
												
												{ xtype: 'spacer' },
												
												//查找
												{
													iconCls: 'search',
													//width: 44,
													//height: 20
												},

											]
										},
									]
									
								},
								
								
								//3-反馈
								{
									xtype: 'panel',
									title: '反馈',
									html: '<h1>反馈</h1><p>--反馈</p>',
									iconCls: 'star',
									cls: 'card3',
									displayField: 'title',
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),
									
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

												
												//新建
												{
													//ui: 'back',
													iconCls: 'compose',
													//html: '<p><a href="Index.html"></a><p>',
													width: 40,
													//height: 20
												},
												
												{ xtype: 'spacer' },
												
												{ xtype: 'spacer' },
												
												//删除
												{
													//ui: 'default',
													iconCls: 'trash',
													//width: 44,
													//height: 20
												},

											]
										},
									]

								},
								
								
								/*****************************************************************************/
								
								
							]
						},
                    ]
                },
				
/**
 * 7-搜索
 */
                {
                    title: '搜索',
                    layout: 'card',
                    //padding: 10,
                    items: [
                        
							
						{
							xtype: 'panel',
							//title: '搜索',
							html: '<h1>搜索</h1><p>--搜索</p>',
							//iconCls: 'star',
							cls: 'card3',
							displayField: 'title',
							
							store: Ext.create('Ext.data.TreeStore', {
								fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
							
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
										

										{ xtype: 'spacer' },
										
										//输入框
										{
											xtype      : 'textfield',
											placeHolder: '请输入查找内容...',
										},
										
										{ xtype: 'spacer' },

										//{ ui: 'forward', text: 'ˢ��' },

										//搜索
										{
											//ui: 'default',
											iconCls: 'search',
											//width: 44,
											//height: 20
										},

									]
								},
							]
									
						},
								
								/*****************************************************************************/
												
                    ]
                },
				
				
				
				
				
/**
 * 8-猫志-具体一只猫
 */
                {
                    title: '某猫',
                    layout: 'card',
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
								//1-猫档案
/**
 * 套用form
 */
								
								{
									id:'xhl_catInfo',
									xtype: 'formpanel',
									title: '档案',
									//html: '<h1>档案</h1><p>--档案</p>',
									iconCls: 'star',
									cls: 'card1',
									displayField: 'title',
									
									url: 'postUser.php',
									standardSubmit: false,
									
									
									items: [
										{
											xtype: 'fieldset',
											title: '基本资料',
											margin: 20,
											instructions: '基本资料',
											defaults: {
												required  : true,
												labelAlign: 'left',
												labelWidth: '40%'
											},
											items: [
												{
													
													xtype: 'textfield',
													name : 'name',
													label: '姓名',
													clearIcon: true,
													autoCapitalize : false
												},
												{
													xtype: 'passwordfield',
													name : 'password',
													label: '密码',
													clearIcon: false
												},
												{
													xtype: 'textfield',
													name : 'disabled',
													label: 'disabled',
													disabled: true,
													clearIcon: true
												},
												{
													xtype: 'emailfield',
													name : 'email',
													label: '邮箱',
													placeHolder: 'you@sencha.com',
													clearIcon: true
												},
												{
													xtype: 'urlfield',
													name : 'url',
													label: '链接',
													placeHolder: 'http://sencha.com',
													clearIcon: true
												},
												{
													xtype: 'checkboxfield',
													name : 'cool',
													label: 'CheckBox',
													value: true
												},
												{
													xtype: 'spinnerfield',
													name : 'spinner',
													label: '啊'
												},
												{
													xtype: 'selectfield',
													name : 'rank',
													label: '啊',
													valueField : 'rank',
													displayField : 'title',
													store : ranksStore
												},
												{
													xtype: 'datepickerfield',
													name : 'date',
													label: '日期',
													value: new Date(),
													picker: {
														yearFrom: 1980
													}
												},
												{
													xtype: 'hiddenfield',
													name : 'secret',
													value: 'false'
												},
												
												{
													xtype: 'sliderfield',
													name : 'height',
													label: '音量'
												},
												{
													xtype: 'togglefield',
													name : 'enable',
													label: '啊'
												},
												{
													xtype: 'radiofield',
													name: 'team',
													label: '啊1',
													value : 'redteam'
												},
												{
													xtype: 'radiofield',
													name: 'team',
													label: '啊2',
													value: 'blueteam'
												},
												{
													xtype : 'textareafield',
													name  : 'bio',
													label : '简介',
													maxLength : 60,
													maxRows : 10
												},
											]
										},
										
									],
									
									store: Ext.create('Ext.data.TreeStore', {
										//fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),
									
								},
								
								
								
								//2-数据
								{
									xtype: 'panel',
									title: '数据',
									html: '<h1>数据</h1><p>--数据</p>',
									//layout: 'card2',
									iconCls: 'star',
									cls: 'card2',
									displayField: 'title',
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),

								},
								
								//3-新鲜事
/**
 * 套用简单list
 */
								{
									xtype: 'panel',
									title: '新鲜事',
									//html: '<h1>新鲜事</h1><p>--新鲜事</p>',
									layout: 'fit',
									iconCls: 'star',
									cls: 'demo-list',
									displayField: 'title',
									scrollable: false,
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),
									
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
												
												//{ ui: 'back', text: '����' },
												
												//撰写
												{
													//ui: 'back',
													iconCls: 'compose',
													//html: '<p><a href="Index.html"></a><p>',
													//width: 30,
													//height: 20
												},
												
												{ xtype: 'spacer' },
												
												//显示方式
												{
													xtype: 'segmentedbutton',
													items: [
														{ text: '列表' },
														{ text: '时间轴', pressed: true },
														{ text: '地图' }
													]
												},
												
												{ xtype: 'spacer' },
												
												
												//刷新
												{
													//ui: 'default',
													//text: '刷新',
													iconCls: 'refresh',
													//width: 44,
													//height: 20
												},

											]
										},
										
										//新鲜事列表
										{
											xtype: 'list',
											itemTpl: '<div class="contact2"><strong>{firstName}</strong> {lastName}</div>',
											mode: 'SINGLE',
											allowDeselect: true,
											disclosure: true,
											grouped: true,
											indexBar: true,
											plugins: 'pullrefresh',

											onItemDisclosure: {
												scope: 'test',
												handler: function(record, btn, index) {
													view.push(9);
													//alert('Disclose more info for ' + record.get('firstName'));
												}
											},

											store: 'ListStore',
											//})
										}
										
									]
									
								},
								
								//4-印象
								{
									xtype: 'panel',
									title: '印象',
									html: '<h1>印象</h1><p>--印象</p>',
									iconCls: 'star',
									cls: 'card4',
									displayField: 'title',
									
									store: Ext.create('Ext.data.TreeStore', {
										fields: ['title', 'text'],
										
										root: {},
										proxy: {
											type: 'ajax',
											url: 'blog.json'
										}
									}),

								},
								
								/*****************************************************************************/
								
								
							]
							
						},
                    ]
                },
				
				
				
/**
 * 9-独立的新鲜事页面
 */
                {
                    title: '某新鲜事',
                    layout: 'card',
                    items: [
                        {
							xtype: 'formpanel',
							title: '档案',
							//html: '<h1>档案</h1><p>--档案</p>',
							//iconCls: 'star',
							cls: 'card1',
							displayField: 'title',
							
							url: 'postUser.php',
							standardSubmit: false,
									
									
							items: [
								{
									xtype: 'fieldset',
									title: '基本资料',
									margin: 20,
									instructions: '基本资料',
									defaults: {
										required  : true,
										labelAlign: 'left',
										labelWidth: '40%'
									},
									items: [
										{
											xtype: 'textfield',
											name : 'name',
											label: '姓名',
											clearIcon: true,
											autoCapitalize : false
										},
										{
											xtype: 'passwordfield',
											name : 'password',
											label: '密码',
											clearIcon: false
										},
										{
											xtype: 'textfield',
											name : 'disabled',
											label: 'disabled',
											disabled: true,
											clearIcon: true
										},
										{
											xtype: 'emailfield',
											name : 'email',
											label: '邮箱',
											placeHolder: 'you@sencha.com',
											clearIcon: true
										},
										{
											xtype: 'urlfield',
											name : 'url',
											label: '链接',
											placeHolder: 'http://sencha.com',
											clearIcon: true
										},
										{
											xtype: 'checkboxfield',
											name : 'cool',
											label: 'CheckBox',
											value: true
										},
										{
											xtype: 'spinnerfield',
											name : 'spinner',
											label: '啊'
										},
										{
											xtype: 'selectfield',
											name : 'rank',
											label: '啊',
											valueField : 'rank',
											displayField : 'title',
											store : ranksStore
										},
										{
											xtype: 'datepickerfield',
											name : 'date',
											label: '日期',
											value: new Date(),
											picker: {
												yearFrom: 1980
											}
										},
										{
											xtype: 'hiddenfield',
											name : 'secret',
											value: 'false'
										},
											
										{
											xtype: 'sliderfield',
											name : 'height',
											label: '音量'
										},
										{
											xtype: 'togglefield',
											name : 'enable',
											label: '啊'
										},
										{
											xtype: 'radiofield',
											name: 'team',
											label: '啊1',
											value : 'redteam'
										},
										{
											xtype: 'radiofield',
											name: 'team',
											label: '啊2',
											value: 'blueteam'
										},
										{
											xtype : 'textareafield',
											name  : 'bio',
											label : '简介',
											maxLength : 60,
											maxRows : 10
										},
									]
								},
								
							],
							
							store: Ext.create('Ext.data.TreeStore', {
								//fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
									
								//},
								
								/*****************************************************************************/
								
								
							
							
						},
                    ]
                },
				
				
/**
 * 10-独立的（其他用户）个人页面
 */
                {
                    title: '某人',
                    layout: 'card',
                    items: [
                        {
							xtype: 'formpanel',
							title: '档案',
							//html: '<h1>档案</h1><p>--档案</p>',
							//iconCls: 'star',
							cls: 'card1',
							displayField: 'title',
							
							url: 'postUser.php',
							standardSubmit: false,
									
									
							items: [
								{
									xtype: 'fieldset',
									title: '基本资料',
									margin: 20,
									instructions: '基本资料',
									defaults: {
										required  : true,
										labelAlign: 'left',
										labelWidth: '40%'
									},
									items: [
										{
											xtype: 'textfield',
											name : 'name',
											label: '姓名',
											clearIcon: true,
											autoCapitalize : false
										},
										{
											xtype: 'passwordfield',
											name : 'password',
											label: '密码',
											clearIcon: false
										},
										{
											xtype: 'textfield',
											name : 'disabled',
											label: 'disabled',
											disabled: true,
											clearIcon: true
										},
										{
											xtype: 'emailfield',
											name : 'email',
											label: '邮箱',
											placeHolder: 'you@sencha.com',
											clearIcon: true
										},
										{
											xtype: 'urlfield',
											name : 'url',
											label: '链接',
											placeHolder: 'http://sencha.com',
											clearIcon: true
										},
										{
											xtype: 'checkboxfield',
											name : 'cool',
											label: 'CheckBox',
											value: true
										},
										{
											xtype: 'spinnerfield',
											name : 'spinner',
											label: '啊'
										},
										{
											xtype: 'selectfield',
											name : 'rank',
											label: '啊',
											valueField : 'rank',
											displayField : 'title',
											store : ranksStore
										},
										{
											xtype: 'datepickerfield',
											name : 'date',
											label: '日期',
											value: new Date(),
											picker: {
												yearFrom: 1980
											}
										},
										{
											xtype: 'hiddenfield',
											name : 'secret',
											value: 'false'
										},
											
										{
											xtype: 'sliderfield',
											name : 'height',
											label: '音量'
										},
										{
											xtype: 'togglefield',
											name : 'enable',
											label: '啊'
										},
										{
											xtype: 'radiofield',
											name: 'team',
											label: '啊1',
											value : 'redteam'
										},
										{
											xtype: 'radiofield',
											name: 'team',
											label: '啊2',
											value: 'blueteam'
										},
										{
											xtype : 'textareafield',
											name  : 'bio',
											label : '简介',
											maxLength : 60,
											maxRows : 10
										},
									]
								},
								
							],
							
							store: Ext.create('Ext.data.TreeStore', {
								//fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
									
								//},
								
								/*****************************************************************************/
								
								
							
							
						},
                    ]
                },
				
				
				
/**
 * 11-位置的单独页面，即该位置的新鲜事列表，以列表或时间轴方式显示
 */
                {
                    title: '某位置',
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
									
							store: Ext.create('Ext.data.TreeStore', {
								fields: ['title', 'text'],
								
								root: {},
								proxy: {
									type: 'ajax',
									url: 'blog.json'
								}
							}),
							
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
											//ui: 'back',
											//text: '新建',
											iconCls: 'compose',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
										
										{xtype: 'spacer'},
										
										{
											xtype: 'segmentedbutton',
											items: [
												{
													text: '列表',
													id: 'location-kiva',
													value: 'kiva',
													pressed: true,
													handler: makeYqlRequest
												},
												{
													text: '地图',
													id: 'location-extjs',
													value: 'extjs',
													handler: makeYqlRequest
												}
											]
										},
										{xtype: 'spacer'},
										
										//查找
										{
											//ui: 'back',
											//text: '查找',
											iconCls: 'search',
											//html: '<p><a href="Index.html"></a><p>',
											//width: 30,
											//height: 20
										},
									]
								},
								
								{
									//width: Ext.os.deviceType == 'Phone' ? null : 480,
									//height: Ext.os.deviceType == 'Phone' ? null : 900,
									xtype: 'list',
									onItemDisclosure: function(record, btn, index) {
										view.push(9);
										//Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
									},
									store: 'ListStore', //getRange(0, 9),
									itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
								}
								
							]
									
						},
								
								/*****************************************************************************/
												
                    ]
                },
				
				
            ]
        });

		
/**
 * 原切换模板中按钮
 */
        var optionsSheet = Ext.create('Ext.ActionSheet', {
            items: [
                {
                    xtype: 'button',
                    text: 'Add a random view',
                    handler: function() {
                        //use the push method of the navigation view to create a new view
                        view.push({
                            title: Date.now().toString(),
                            padding: 10,
                            html: 'This is a random view.'
                        });

                        //hide the sheet
                        optionsSheet.hide();
                    }
                },
                {
                    xtype: 'button',
                    text: 'Toggle back button text',
                    handler: function() {
                        //simply call the setter for the useTitleForBackButtonText configuration
                        view.setUseTitleForBackButtonText(!view.getUseTitleForBackButtonText());

                        //hide the sheet
                        optionsSheet.hide();
                    }
                },
                {
                    xtype: 'button',
                    text: 'Pop the current view',
                    itemId: 'pop',
                    handler: function() {
                        //call the pop method in the navigation view
                        view.pop();

                        //hide the sheet
                        optionsSheet.hide();
                    }
                },
                {
                    text: 'Cancel',
                    ui: 'decline',
                    handler: function() {
                        //hide the sheet
                        optionsSheet.hide();
                    }
                }
            ]
        });
		
    },
	
	
});

