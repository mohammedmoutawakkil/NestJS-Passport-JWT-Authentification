import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto{
    @IsNotEmpty()
    @MinLength(3)
    username:string;
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @IsNotEmpty()
    @MaxLength(10)
    password:string;
}