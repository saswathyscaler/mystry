import mongoose, { Schema ,Document} from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}


const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is rrequired"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true, "Email is rrequired"],
        unique:true,
        match:[/.+\@.+\..+/,'Please Provide a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code Expiary is required"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages:[MessageSchema]

})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema) 


export default UserModel