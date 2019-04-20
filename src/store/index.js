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

const departments = [
    {
        id:1,
        pId:0,
        value: '1',
        label: '公安部'
    }
]

const store = new Vuex.Store({
    // options
    state() {
        return {
            user: null,
            departmentsForTree: departments,
        }
    },
    // 通过$store.commit('datakey', dataObj)来调用mutation
    mutations: {
        user: (state, user) => {
            state.user = user
        },
        departmentsForTree: (state, data) =>{
            state.departmentsForTree = data
        }
    },
    // 相当于计算属性
    getters: {
        user: state => state.user,
        departmentsForTree: state => state.departmentsForTree
    }
})

export default store