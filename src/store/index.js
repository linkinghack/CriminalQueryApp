import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultUser = {
    "id": 1,
    "userID": "admin",
    "password": null,
    "email": "linkinghack@outlook.com",
    "realName": "刘磊",
    "role": 1,
    "departmentID": 1,
    "activated": true,
    "phone": "18235101905",
    "department": {
        "id": 1,
        "departmentName": "公安部",
        "supervisorID": 0,
        "level": 1,
        "districtID": 100000
    }
};

const store = new Vuex.Store({
    // options
    state() {
        return {
            user: null
        }
    },
    // 通过$store.commit('datakey', dataObj)来调用mutation
    mutations: {
        user: (state, user) => {
            state.user = user
        }
    },
    // 相当于计算属性
    getters: {
        user: state => state.user,
    }
})

export default store