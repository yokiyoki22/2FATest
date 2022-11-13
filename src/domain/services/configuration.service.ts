import dotenv from 'dotenv';

dotenv.config();
export const Port = process.env.PORT;
export const ConnectionString = process.env.ROOT_CONNECTION_STRING;
export const JwtSecret = process.env.JWT_SECRET!;

export function CheckConfig(){
    // console.log(process.env)

    if(Port == null){
        console.log("Invalid configuration.");
        console.log("Make sure to specify PORT in your environment variables.");
        process.exit();
    }

    if(ConnectionString == null){
        console.log("Invalid configuration.");
        console.log("Make sure to specify CONNECTION_STRING in your environment variables.");
        process.exit();
    }

    if(JwtSecret == null){
        console.log("Invalid configuration.");
        console.log("Make sure to specify JWT_SECRET in your environment variables.");
        process.exit();
    }
}
