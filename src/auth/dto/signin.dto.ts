import { IsNotEmpty, IsPhoneNumber, IsString,IsEmail, MinLength } from "class-validator";

export class SignInDto {
    email: string    
    password: string;
}
