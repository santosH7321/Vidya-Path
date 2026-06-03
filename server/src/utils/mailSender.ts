import nodemailer from "nodemailer";

const mailSender = async (email: String, title: String, body: String) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'VidyaPath || By Santosh Kumar',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        if(error instanceof Error){
            console.log(error.message);
            return error.message;
        }
    }
}


export default mailSender;