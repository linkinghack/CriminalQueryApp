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
            user:  JSON.parse(localStorage.getItem('user')) || null ,
            userDepartment: JSON.parse(localStorage.getItem('userDepartment')) || null,
            token: localStorage.getItem('token') ||  "",
            departmentsForTree: departments,
            newCriminalInfo: null,
            newWantedOrder: null,
            currentCriminalDetail: null,
        }
    },
    // 通过$store.commit('datakey', dataObj)来调用mutation
    mutations: {
        user: (state, user) => {
            state.user = user
        },
        userDepartment: (state, department) => {
            state.userDepartment = department
        },
        token: (state, token) => {
            state.token = token
        },
        departmentsForTree: (state, data) =>{
            state.departmentsForTree = data
        },
        newCriminalInfo: (state, info) => {
            state.newCriminalInfo = info
        },
        newWantedOrder: (state, order) => {
            state.newWantedOrder = order
        },
        currentCriminalDetail: (state, detail) => {
            state.currentCriminalDetail = detail
        }
    },
    // 相当于计算属性
    getters: {
        user: state => state.user,
        userDepartment: state => state.userDepartment,
        token: state => state.token,
        departmentsForTree: state => state.departmentsForTree,
        newCriminalInfo: state => state.newCriminalInfo,
        newWantedOrder: state => state.newWantedOrder,
        currentCriminalDetail: state => state.currentCriminalDetail,
    }
})

export default store