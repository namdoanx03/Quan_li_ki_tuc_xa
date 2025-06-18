export const baseURL = "http://localhost:4000"


const SummaryApi = {
    // USER
    login: {
        url: "/api/user/login",
        method: "post",
    },
    addStudent: {
        url: "/api/user/addStudent",
        method: "post",
    },
    deleteStudent: {
        url: "/api/user/deleteStudent",
        method: "delete",
    },
    getAllStudent: {
        url: "/api/user/getAllStudent",
        method: "get",
    },
    getStudentByMaSV: {
        url: "/api/user/getStudentMaSV",
        method: "get",
    },
    updateStudent: {
        url: "/api/user/updateStudent",
        method: "patch",
    },

    // ROOM
    addRoom: {
        url: "/api/room/addRoom",
        method: "post",
    },
    updateRoom: {
        url: "/api/room/updateRoom",
        method: "patch",
    },
    deleteRoom: {
        url: "/api/room/deleteRoom",
        method: "delete",
    },

    // SERVICE
    addService: {
        url: "/api/service/addService",
        method: "post",
    },
    updateService: {
        url: "/api/service/updateService",
        method: "patch",
    },
    deleteService: {
        url: "/api/service/deleteService",
        method: "delete",
    },
    getAllService: {
        url: "/api/service/getAllService",
        method: "get",
    },

    // ROW ROOM
    addRowRoom: {
        url: "/api/rowRoom/addRowRoom",
        method: "post",
    },
    updateRowRoom: {
        url: "/api/rowRoom/updateRowRoom",
        method: "patch",
    },
    deleteRowRoom: {
        url: "/api/rowRoom/deleteRowRoom",
        method: "delete",
    },
    getAllRowRoom: {
        url: "/api/rowRoom/getAllRowRoom",
        method: "get",
    },

    // CONTRACT
    createContract: {
        url: "/api/contract/createContract",
        method: "post",
    },
    cancelContract: {
        url: "/api/contract/cancelContract",
        method: "delete",
    },
    getAllContract: {
        url: "/api/contract/getAllContract",
        method: "get",
    },
    extendContract: {
        url: "/api/contract/extendContract",
        method: "patch",
    },

    // BILL
    createBill: {
        url: "/api/bill/createBill",
        method: "post",
    },
}

export default SummaryApi