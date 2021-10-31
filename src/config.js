import {imgSrc} from './utils/config'

export default {

    // 正常模式的tab title配置
    tabTitles: [
      {
        title: '资产',
        icon: imgSrc+'wallet_gray',
        activeIcon: imgSrc+'wallet_blue'
      },
      {
        title: '发现',
        icon: imgSrc+'browser1',
        activeIcon: imgSrc+'browser1_blue',
        
      },
      {
        title: '我的',
        icon: imgSrc+'my_gray',
        activeIcon: imgSrc+'my_blue',
        
      }
    ],

    tabEnTitles: [
      {
        title: 'Assets',
        icon: imgSrc+'wallet_gray',
        activeIcon: imgSrc+'wallet_blue'
      },
      {
        title: 'Discover',
        icon: imgSrc+'browser1',
        activeIcon: imgSrc+'browser1_blue',
        
      },
      {
        title: 'My',
        icon: imgSrc+'my_gray',
        activeIcon: imgSrc+'my_blue',
        
      }
    ],

    // tabTitles: [
    //   {
    //     title: '增加'
    //   },
    //   {
    //     title: '赎回',
    //     dot: true
    //   }
    // ],
    tabStyles: {
      bgColor: '#FFFFFF',
      titleColor: '#666666',
      activeTitleColor: '#3994da',
      activeBgColor: '#FFFFFF',
      isActiveTitleBold: false,
      iconWidth: 50,
      iconHeight: 50,
      width: 160,
      height: 120,
      fontSize: 24,
      textPaddingLeft: 10,
      textPaddingTop: 10,
      textPaddingRight: 10
    },

    tabTopStyles: {
      bgColor: '#FFFFFF',
      titleColor: '#666666',
      activeTitleColor: '#1E90FF',
      activeBgColor: '#FFFFFF',
      isActiveTitleBold: true,
      iconWidth: 0,
      iconHeight:0,
      width: 325,
      height: 120,
      fontSize: 28,
      hasActiveBottom: true,
      activeBottomColor: '#FFC900',
      activeBottomHeight: 6,
      activeBottomWidth: 120,
      textPaddingLeft: 10,
      textPaddingRight: 10,
      normalBottomColor: 'rgba(0,0,0,0.4)',
      normalBottomHeight: 2,
      hasRightIcon: true,
      rightOffset: 100

    },
  
    // 使用 iconFont 模式的tab title配置
    tabIconFontTitles: [
      {
        title: '首页',
        codePoint: '\ue623'
      },
      {
        title: '特别推荐',
        codePoint: '\ue608'
      },
      {
        title: '消息中心',
        codePoint: '\ue752',
        badge: 5
      },
      {
        title: '我的主页',
        codePoint: '\ue601',
        dot: true
      }
    ],
    tabIconFontStyles: {
      bgColor: '#FFFFFF',
      titleColor: '#666666',
      activeTitleColor: '#3D3D3D',
      activeBgColor: '#FFFFFF',
      isActiveTitleBold: true,
      width: 160,
      height: 120,
      fontSize: 24,
      textPaddingLeft: 10,
      textPaddingRight: 10,
      iconFontSize: 50,
      iconFontMarginBottom: 8,
      iconFontColor: '#333333',
      activeIconFontColor: 'red',
      iconFontUrl: '//at.alicdn.com/t/font_501019_mauqv15evc1pp66r.ttf'
    }
  }