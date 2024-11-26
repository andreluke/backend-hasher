interface createUser{
    Body:{ nome: string; email: string; senha: string }
}

interface getUser{
    Body: {
        userId:string
    }
}

interface updateUser{
    Body:{ userId: string; nome?: string; email?: string; senha?: string }
}

interface deleteUser{
    Body:{
        userId:string
    }
}

export {
    getUser,
    createUser,
    updateUser,
    deleteUser
}