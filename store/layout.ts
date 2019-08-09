export interface StoreInterface {
  is_show_nav: boolean
}

export const state = (): StoreInterface => ({
  is_show_nav: false
})

export const mutations = {
  toggle_show_nav(state) {
    state.is_show_nav = !state.is_show_nav
  }
}
