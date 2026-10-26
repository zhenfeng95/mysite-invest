/** 首页「本周推荐」细条；活动结束将 items 清空或整段设为 null 即可下线 */
export interface HomeWeeklySpotlightItem {
  badge?: string
  title: string
  description: string
  to: string
}

export interface HomeWeeklySpotlight {
  label: string
  items: HomeWeeklySpotlightItem[]
}

export const homeWeeklySpotlight: HomeWeeklySpotlight | null = {
  label: '本周推荐',
  items: [
    {
      title: '嘉信国际开户教程',
      description: '护照材料、线上申请、W-8BEN 到可入金，以及有港卡时的港币入金路径',
      to: '/tutorials/schwab-account-guide',
    },
    {
      badge: '活动进行中',
      title: '宝时证券开户教程',
      description: '线上开户材料、见证流程与入金注意点，供对照官方页面',
      to: '/tutorials/bosco-account-guide',
    },
  ],
}
