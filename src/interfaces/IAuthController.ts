interface loginInterface{
    Body:{
        email: string,
        senha:string
    }
}

interface refreshInterface{
    Body:{
        refreshToken: string
    }
}

export {
    loginInterface,
    refreshInterface
}