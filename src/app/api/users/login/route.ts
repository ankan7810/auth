import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/user.models.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

connect();

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("user exists");
              
        //check if password is correct
        //compare(string,hash)
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);
        
        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        //create token.sign(Data,secret key)
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        //create NextResponse
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        //in nextjs cookies are avalible by default.
        response.cookies.set("token", token, {
            httpOnly: true, 
        })

        //response gone and user logged in.
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}