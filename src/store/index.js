import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
    mainState:true,
    toggle:false
}
const getters = {
    getMain(state){
        return state.mainState
    }
}
const mutations = {
    changeMain(state){
        state.mainState = !state.mainState
    },
    toggleNav(state){
        state.toggle = !state.toggle
    }
}
const actions = {
    comMain(context){
        context.commit('true')
    }
}


const store = new Vuex.Store({
    state,getters,mutations,actions
})

export default store;
