import mongoose, { Schema } from "mongoose";
import validator from "validator";
const LinkSchema = new Schema({
    url: {
        type: String,
        required: [true, "O link é necessário"],
        validate: {
            validator: (v) => validator.isURL(v),
            message: (props) => `${props.value} não é uma URL válida!`,
        }
    },
    slug: {
        type: String,
        unique: true,
        maxlength: 12,
        required: true
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
const LinkModel = mongoose.model("Link", LinkSchema, "links");
export default LinkModel;
