import Vue from 'vue'
import { InjectionKey } from 'nuxt-composition-api'

export type TocRow = {
  depth: number
  id: string
  text: string
}

export const store = () => {
  const state = Vue.observable<{ isShowNav: boolean; toc: TocRow[] }>({
    isShowNav: false,
    toc: [],
  })

  return {
    get isShowNav() {
      return state.isShowNav
    },

    set isShowNav(_isShowNav) {
      state.isShowNav = _isShowNav
    },

    get toc() {
      return state.toc
    },

    set toc(toc) {
      state.toc = [...toc]
    },
  }
}

export type StoreType = ReturnType<typeof store>
export const StoreKey: InjectionKey<StoreType> = Symbol('SiteStore')
