import mongoose, { Schema } from "mongoose";
const LinkUsuarioSchema = new Schema({
    url: {
        type: String,
    },
    slug: {
        type: String,
        unique: false
    }
});
const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: [true, "Nome é obrigatório"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "O e-mail é obrigatório"],
        validate: {
            validator: function (value) {
                // expressão regular para validar o formato do e-mail
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(value);
            },
            message: (props) => `${props.value} não é um formato de e-mail válido`,
        },
    },
    senha: {
        type: String,
        select: false,
        trim: true,
        required: [true, "A senha é obrigatória"],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    removed_at: {
        type: Date,
        default: null
    },
    links: {
        type: [LinkUsuarioSchema]
    }
}, {
    toJSON: {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
const UsuarioModel = mongoose.model("Usuario", UsuarioSchema, "Usuarios");
export default UsuarioModel;
