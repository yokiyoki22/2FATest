import dotenv from 'dotenv'

dotenv.config();
export const Port = process.env.PORT;

export function CheckConfig(){
    // console.log(process.env)

    if(Port === undefined){
        console.log("Invalid configuration.");
        console.log("Make sure to specify PORT in your environment variables.");
        process.exit();
    }
}
