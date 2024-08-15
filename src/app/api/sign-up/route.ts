import dbConnect from "@/lib/dbConnect";

import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVeficationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        const verifyCode = Math.floor(100000 + Math.random() * 9000000).toString();

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "username is Already Taken ",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already resgisetd ",
                    },
                    { status: 400 }
                );
            } else {
                const hassesPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hassesPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        } else {
            const hassesPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hassesPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save()
        }


        // send verification email 

        const emailResponse = await sendVeficationEmail(
            email,
            username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User Registerd successfully Pleaee verify",
            },
            { status: 201 }
        );


    } catch (error) {
        console.error(error, "error Registering user");
        return Response.json(
            {
                success: false,
                message: "Error registering User",
            },
            { status: 500 }
        );
    }
}
